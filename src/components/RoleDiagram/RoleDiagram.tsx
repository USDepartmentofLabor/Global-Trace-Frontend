import { Vue, Component, Prop } from 'vue-property-decorator';
import { Screen, Node, Edge, graph } from 'vnodes';
import { head, last } from 'lodash';
import { UserRoleEnum } from 'enums/user';
import * as Styled from './styled';

@Component
export default class RoleDiagram extends Vue {
  @Prop({ required: true }) data: App.Map;
  private graph = new graph();
  private screenOptions = {
    center: true,
  };
  private nodeOptions = {};
  private edgeOptions = {
    fromAnchor: {
      y: '50%',
      snap: 'rect',
    },
    toAnchor: {
      y: '50%',
      snap: 'rect',
    },
  };

  created() {
    this.data.nodes.forEach((node) => {
      if (node) {
        this.graph.createNode({
          id: node.id,
          label: node.label,
          isLabel: UserRoleEnum.BROKER === node.label,
          ...this.nodeOptions,
        });
      }
    });
    this.data.lines.forEach((line) => {
      const from = head(line);
      const to = last(line);
      if (from && to) {
        this.graph.createEdge(from, to, this.edgeOptions);
      }
    });
  }

  fitContent() {
    if (this.$refs.screen) {
      this.$nextTick(() => {
        (this.$refs.screen as App.Any).zoomNodes(this.graph.nodes, {
          scale: 1,
        });
      });
    }
  }

  mounted() {
    this.graph.graphNodes();
    this.fitContent();
  }

  renderNode(node: App.Any): JSX.Element {
    return (
      <g>
        <Node data={node} ref="node">
          <Styled.Node isLabel={node.isLabel}>{node.label}</Styled.Node>
        </Node>
      </g>
    );
  }

  render(): JSX.Element {
    return (
      <Styled.Wrapper vOn:wheel={(e: Event) => e.stopPropagation()}>
        <Screen ref="screen" options={this.screenOptions}>
          {this.graph.edges.map((edge: App.Any) => (
            <Edge data={edge} key={edge.id} nodes={this.graph.nodes} />
          ))}
          {this.graph.nodes.map(this.renderNode)}
        </Screen>
      </Styled.Wrapper>
    );
  }
}
