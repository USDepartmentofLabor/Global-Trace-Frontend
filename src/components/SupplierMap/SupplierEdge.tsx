import { Component, Prop, Vue } from 'vue-property-decorator';
import { Edge } from 'vnodes';

@Component
export default class SupplierEdge extends Vue {
  @Prop({ required: true }) edge: App.MapEdge;
  @Prop({ default: [] }) nodes: App.MapNode[];
  @Prop({ default: [] }) graphNodes: App.MapNode[];
  @Prop({ default: '' }) activeNodeId: string;

  get show() {
    const fromNode = this.graphNodes.find(({ id }) => id === this.edge.from);
    const toNode = this.graphNodes.find(({ id }) => id === this.edge.to);
    return (
      fromNode &&
      toNode &&
      fromNode.isExpanded &&
      toNode.parentsTotal > 0 &&
      (fromNode.isRoot || fromNode.parentsTotal > 0)
    );
  }

  render(): JSX.Element {
    if (this.show) {
      return (
        <Edge
          from={this.edge.from}
          to={this.edge.to}
          data={this.edge}
          key={this.edge.id}
          nodes={this.graphNodes}
          class={{
            activated:
              this.edge.from === this.activeNodeId ||
              this.edge.to === this.activeNodeId,
          }}
        />
      );
    }
  }
}
