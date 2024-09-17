/* eslint-disable  max-lines-per-function */
import { Component, Mixins, Prop } from 'vue-property-decorator';
import { get } from 'lodash';
import { Node } from 'vnodes';
import Button from 'components/FormUI/Button';
import { NODE_HEIGHT, NODE_WIDTH } from 'config/constants';
import { getRiskAssessmentStatus } from 'utils/risk-assessment';
import * as Styled from './styled';
import MapMixin from './MapMixin';
import NodeInformation from './NodeInformation';

@Component
export default class MapNode extends Mixins(MapMixin) {
  @Prop({ required: true }) node: App.MapNode;
  @Prop({ default: [] }) nodes: BrandSupplier.TraceSupplierMapGroup[];
  @Prop({ default: [] }) data: BrandSupplier.TraceSupplierMapGroup[];
  @Prop({ default: [] }) graphNodes: App.MapNode[];
  @Prop({ default: [] }) relatedNodeIds: string[];
  @Prop({ default: [] }) canEditSupplierIds: string[];
  @Prop({ default: 0 }) childrensTotal: number;
  @Prop({ default: true }) isEdit: boolean;
  @Prop({
    default: () => {
      // TODO
    },
  })
  setActiveNodeId: (id: string) => void;
  @Prop({
    default: () => {
      // TODO
    },
  })
  expandSupplier: () => void;

  get nodeOptions(): App.Any {
    return {
      width: NODE_WIDTH.MEDIUM,
      height: NODE_HEIGHT.BIG,
    };
  }

  get show() {
    return this.node.parentsTotal > 0 || this.node.isTier || this.node.isRoot;
  }

  renderNodeContent(): JSX.Element {
    if (this.node.isTier) {
      return this.renderTier(this.node);
    }
    const supplier = this.data.find(
      ({ orderSupplierId }) => this.node.id === orderSupplierId,
    );
    const canEdit = this.canEditSupplierIds.includes(this.node.id);
    const hasChildren = this.node.childrensTotal > 0;
    const status = getRiskAssessmentStatus(
      get(supplier, 'riskData'),
    ).toLowerCase();
    const showChildrensTotal = !this.node.isExpanded && this.childrensTotal > 0;
    return (
      <Styled.Node
        status={status}
        activated={this.relatedNodeIds.includes(this.node.id)}
        height={this.nodeOptions.height}
        v-tooltip={this.getTooltipOptions(this.node.label)}
        vOn:mouseover={() => this.setActiveNodeId(this.node.id)}
        vOn:mouseleave={() => this.setActiveNodeId('')}
        vOn:click={() => this.clickSupplier(supplier)}
      >
        {hasChildren && (
          <Styled.ExpandIcon
            isExpanded={this.node.isExpanded}
            vOn:click={(e: Event) => {
              e.stopPropagation();
              this.expandSupplier();
            }}
          >
            {showChildrensTotal && (
              <Styled.TargetTotal>+{this.childrensTotal}</Styled.TargetTotal>
            )}
            <font-icon name="arrow_back" size="14" color="stormGray" />
          </Styled.ExpandIcon>
        )}
        <NodeInformation
          name={supplier.name}
          supplier={supplier}
          canEdit={canEdit}
          edit={() => {
            this.editSupplier(supplier, true);
          }}
        />
        {this.isEdit && (
          <Button
            width="100%"
            variant="outlinePrimary"
            size="tiny"
            label={this.$t('add_another_supplier')}
            click={(e: Event) => {
              e.stopPropagation();
              this.editSupplier(supplier, false);
            }}
          />
        )}
      </Styled.Node>
    );
  }

  render(): JSX.Element {
    if (this.show) {
      return (
        <g key={this.node.id}>
          <Node
            data={this.node}
            margin={0}
            ref="node"
            width={this.nodeOptions.width}
            height={this.nodeOptions.height}
            useDrag={false}
          >
            {this.renderNodeContent()}
          </Node>
        </g>
      );
    }
  }
}
