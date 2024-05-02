/* eslint-disable  max-lines-per-function */
import { Component, Prop, Mixins } from 'vue-property-decorator';
import { cloneDeep, isEmpty } from 'lodash';
import { Screen, Node, Edge } from 'vnodes';
import { NODE_HEIGHT } from 'config/constants';
import Button from 'components/FormUI/Button';
import { isMobile } from 'utils/helpers';
import Unsupported from 'components/Unsupported';
import * as Styled from './styled';
import MapMixin from './MapMixin';
import RiskAssessment from './RiskAssessment';

@Component
export default class TraceOrderMap extends Mixins(MapMixin) {
  @Prop({ default: 'default' }) size: string;
  @Prop({ default: true }) isEdit: boolean;
  @Prop({ default: [] }) data: BrandSupplier.TraceSupplierMapGroup[];
  @Prop({ default: [] }) canEditSupplierIds: string[];

  private activeNodeId: string = '';

  get nodeOptions(): App.Any {
    return {
      width: 160,
      height: NODE_HEIGHT.BIG,
    };
  }

  get nodes(): BrandSupplier.TraceSupplierMapGroup[] {
    const result: BrandSupplier.TraceSupplierMapGroup[] = [];
    const data = cloneDeep(this.data.reverse());
    data.forEach((supplier) => {
      result.push({
        ...supplier,
        id: supplier.orderSupplierId,
      });
    });
    return result;
  }

  get lines(): BrandSupplier.Line[] {
    let result: BrandSupplier.Line[] = [];
    this.data.forEach(({ orderSupplierId, targets }) => {
      if (!isEmpty(targets)) {
        const lines: BrandSupplier.Line[] = targets
          .map((partnerId) => {
            const node = this.data.find(
              ({ orderSupplierId }) => orderSupplierId === partnerId,
            );
            return node
              ? {
                  fromNodeId: orderSupplierId,
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
    const supplier = this.data.find(
      ({ orderSupplierId }) => node.id === orderSupplierId,
    );
    const canEdit = this.canEditSupplierIds.includes(node.id);
    return (
      <Styled.Node
        vOn:mouseover={() => this.setActiveNodeId(node.id)}
        vOn:mouseleave={() => this.setActiveNodeId()}
        vOn:click={() => this.clickSupplier(supplier)}
        activated={this.relatedNodeIds.includes(node.id)}
        height={this.nodeOptions.height}
        v-tooltip={this.getTooltipOptions(node.label)}
      >
        {canEdit && (
          <font-icon
            name="edit"
            size="16"
            color="envy"
            vOn:click_native={(e: Event) => {
              e.stopPropagation();
              this.editSupplier(supplier, true);
            }}
          />
        )}
        <Styled.NodeHeader>
          <Styled.Label>{supplier.label}</Styled.Label>
          <Styled.Name maxLine={2}>{node.label}</Styled.Name>
        </Styled.NodeHeader>
        <Styled.NodeBody vOn:click={(e: Event) => e.stopPropagation()}>
          {this.isEdit && (
            <Button
              variant="outlinePrimary"
              size="tiny"
              label={this.$t('add_another_supplier')}
              click={() => {
                this.editSupplier(supplier, false);
              }}
            />
          )}
          {!this.isEdit && <RiskAssessment supplier={supplier} />}
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
        isReverse
        size={this.size}
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
