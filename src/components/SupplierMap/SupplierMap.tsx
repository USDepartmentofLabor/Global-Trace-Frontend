/* eslint-disable  max-lines-per-function */
import { Component, Prop, Mixins } from 'vue-property-decorator';
import { isEmpty, maxBy } from 'lodash';
import { Screen, Node, Edge } from 'vnodes';
import { NODE_SPACE, NODE_WIDTH, NODE_HEIGHT } from 'config/constants';
import { isMobile } from 'utils/helpers';
import Unsupported from 'components/Unsupported';
import * as Styled from './styled';
import RiskAssessment from './RiskAssessment';
import MapMixin from './MapMixin';

@Component
export default class SupplierMap extends Mixins(MapMixin) {
  @Prop({ default: [] }) data: Array<BrandSupplier.SupplierMapGroup[]>;

  private activeNodeId: string = '';
  get nodeOptions(): App.Any {
    return {
      width: 160,
      height: NODE_HEIGHT.MEDIUM,
    };
  }

  get nodes(): BrandSupplier.SupplierItem[] {
    let result: BrandSupplier.SupplierItem[] = [];
    this.data.forEach((group, groupIndex) => {
      const top = this.getGroupTop(groupIndex);
      group.forEach(({ suppliers }, supplierGroupIndex) => {
        suppliers = suppliers.map((supplier, index) => {
          supplier.x = (NODE_WIDTH.MEDIUM + NODE_SPACE) * supplierGroupIndex;
          supplier.y = (NODE_HEIGHT.MEDIUM + NODE_SPACE) * index + top;
          return supplier;
        });
        result = [...result, ...suppliers];
      });
    });
    return result;
  }

  get lines(): BrandSupplier.Line[] {
    let result: BrandSupplier.Line[] = [];
    this.data.forEach((group) => {
      group.forEach(({ suppliers }) => {
        suppliers.forEach(({ id, targets }) => {
          if (!isEmpty(targets)) {
            const lines: BrandSupplier.Line[] = targets
              .map((partnerId) => {
                const node = this.nodes.find((node) => node.id === partnerId);
                return node
                  ? {
                      fromNodeId: id,
                      toNodeId: partnerId,
                    }
                  : null;
              })
              .filter((item) => item);
            result = [...result, ...lines];
          }
        });
      });
    });
    return result;
  }

  get relatedNodeIds(): string[] {
    const result: string[] = [];
    if (this.activeNodeId) {
      result.push(this.activeNodeId);
      this.lines.forEach(({ fromNodeId, toNodeId }) => {
        if (fromNodeId === this.activeNodeId) {
          result.push(toNodeId);
        }
        if (toNodeId === this.activeNodeId) {
          result.push(fromNodeId);
        }
      });
    }
    return result;
  }

  getGroupTop(groupIndex: number): number {
    let top = 0;
    for (let i = 0; i < this.data.length; i++) {
      const max = maxBy(this.data[i], (group) => group.suppliers.length);
      const groupTop = max.suppliers.length * (NODE_HEIGHT.MEDIUM + NODE_SPACE);
      if (groupIndex > 0 && i < groupIndex) {
        top += groupTop;
      }
    }
    return top;
  }

  setActiveNodeId(id: string = null): void {
    this.activeNodeId = id;
  }

  mounted() {
    this.graph.reset();
    this.nodes.forEach((node) => {
      if (node) {
        const supplierNode = this.nodes.find(({ id }) => id === node.id);
        this.graph.createNode({
          id: node.id,
          label: node.name,
          x: supplierNode.x,
          y: supplierNode.y,
          ...this.nodeOptions,
        });
      }
    });
    this.lines.forEach((line) => {
      this.drawLine(line);
    });
    this.fitContent(false);
  }

  renderNodeContent(node: App.MapNode): JSX.Element {
    const supplier = this.nodes.find(({ id }) => id === node.id);
    return (
      <Styled.Node
        activated={this.relatedNodeIds.includes(node.id)}
        height={this.nodeOptions.height}
        vOn:mouseover={() => this.setActiveNodeId(node.id)}
        vOn:mouseleave={() => this.setActiveNodeId()}
        vOn:click={() => this.clickSupplier(supplier)}
        v-tooltip={this.getTooltipOptions(node.label)}
      >
        <font-icon
          name="edit"
          size="16"
          color="envy"
          vOn:click_native={(e: Event) => {
            e.stopPropagation();
            this.editSupplier(supplier, true);
          }}
        />
        <Styled.NodeHeader>
          <Styled.Name maxLine={2}>{node.label}</Styled.Name>
        </Styled.NodeHeader>
        <Styled.NodeBody>
          <RiskAssessment supplier={supplier} />
        </Styled.NodeBody>
      </Styled.Node>
    );
  }

  renderNode(node: App.MapNode): JSX.Element {
    return (
      <g>
        <Node
          data={node}
          margin={0}
          ref="node"
          width={this.nodeOptions.width}
          height={this.nodeOptions.height}
        >
          {this.renderNodeContent(node)}
        </Node>
      </g>
    );
  }

  render(): JSX.Element {
    if (isMobile()) {
      return <Unsupported />;
    }
    return (
      <Styled.Wrapper
        size="default"
        vOn:wheel={(e: Event) => e.stopPropagation()}
      >
        <Screen ref="screen" options={this.screenOptions}>
          {this.graph.edges.map((edge: App.Any) => (
            <Edge
              from={edge.from}
              to={edge.to}
              data={edge}
              key={edge.id}
              nodes={this.graph.nodes}
              class={{
                activated:
                  edge.from === this.activeNodeId ||
                  edge.to === this.activeNodeId,
              }}
            />
          ))}
          {this.graph.nodes.map(this.renderNode)}
        </Screen>
      </Styled.Wrapper>
    );
  }
}
