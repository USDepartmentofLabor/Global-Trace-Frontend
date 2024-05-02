/* eslint-disable  max-lines-per-function */
import { Component, Prop, Mixins } from 'vue-property-decorator';
import { cloneDeep, isEmpty } from 'lodash';
import { Screen, Node, Edge } from 'vnodes';
import { NODE_HEIGHT } from 'config/constants';
import * as Styled from './styled';
import MapMixin from './MapMixin';
import RiskAssessment from './RiskAssessment';

@Component
export default class TraceOrderPdfMap extends Mixins(MapMixin) {
  @Prop({ default: [] }) data: BrandSupplier.SupplierItem[];

  private activeNodeId: string = '';

  get nodeOptions(): App.Any {
    return {
      width: 160,
      height: NODE_HEIGHT.BIG,
    };
  }

  get nodes(): BrandSupplier.SupplierItem[] {
    const result: BrandSupplier.SupplierItem[] = [];
    const data = cloneDeep(this.data.reverse());
    data.forEach((item) => {
      item.id = item.orderSupplierId;
      item.name = item.name || item.label;
      result.push(item);
    });
    return result;
  }

  get lines(): BrandSupplier.Line[] {
    let result: BrandSupplier.Line[] = [];
    this.nodes.forEach(({ id, targets }) => {
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

  setActiveNodeId(id: string = null): void {
    this.activeNodeId = id;
  }

  mounted() {
    this.graph.reset();
    this.nodes.forEach((node) => {
      if (node) {
        this.graph.createNode({
          id: node.id,
          label: node.name,
          ...this.nodeOptions,
        });
      }
    });
    this.lines.forEach((line) => {
      this.drawLine(line);
    });
    this.fitContent();
  }

  renderNodeContent(node: App.MapNode): JSX.Element {
    const supplier = this.nodes.find(({ id }) => id === node.id);
    return (
      <Styled.Node
        activated={this.relatedNodeIds.includes(node.id)}
        height={this.nodeOptions.height}
      >
        <Styled.NodeHeader>
          <Styled.Name maxLine={4}>{node.label}</Styled.Name>
        </Styled.NodeHeader>
        <Styled.NodeBody>
          {supplier.riskData && <RiskAssessment supplier={supplier} />}
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
    return (
      <Styled.Wrapper
        isReverse
        height={500}
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
