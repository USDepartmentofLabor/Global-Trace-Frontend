/* eslint-disable  max-lines-per-function */
import { Component, Prop, Mixins } from 'vue-property-decorator';
import {
  cloneDeep,
  findIndex,
  get,
  groupBy,
  isEmpty,
  maxBy,
  pick,
} from 'lodash';
import { Screen, Node, Edge, Label } from 'vnodes';
import {
  NODE_HEIGHT,
  NODE_SPACE_Y,
  NODE_WIDTH,
  SUPPLIER_SPLIT_CODE,
} from 'config/constants';
import { getRiskAssessmentStatus } from 'utils/risk-assessment';
import * as Styled from './styled';
import MapMixin from './MapMixin';
import NodeInformation from './NodeInformation';

@Component
export default class TraceOrderPdfMap extends Mixins(MapMixin) {
  @Prop({ default: [] }) data: BrandSupplier.TraceSupplierMapGroup[];
  @Prop({
    default: () => {
      //
    },
  })
  loaded: () => void;

  private activeNodeId: string = '';
  private tierNodes: BrandSupplier.SupplierItem[] = [];

  get nodeOptions(): App.Any {
    return {
      width: NODE_WIDTH.BIG,
      height: NODE_HEIGHT.BIG,
    };
  }

  get nodes(): BrandSupplier.SupplierItem[] {
    const result: BrandSupplier.SupplierItem[] = this.tierNodes;
    const data = cloneDeep(this.data.reverse());
    data.forEach((supplier) => {
      const type = get(supplier, 'type.name');
      const tier = this.tierNodes.find(
        ({ label }) =>
          label &&
          type &&
          label
            .toLowerCase()
            .split(SUPPLIER_SPLIT_CODE)
            .includes(type.toLowerCase()),
      );
      supplier.id = supplier.orderSupplierId;
      supplier.name = supplier.name || supplier.label;
      supplier.x = this.getLeft(tier, supplier);
      supplier.y = this.getTop(supplier);
      result.push(supplier);
    });
    return result;
  }

  get lines(): BrandSupplier.Line[] {
    let result: BrandSupplier.Line[] = [];
    this.nodes.forEach(({ id, targets }) => {
      if (!isEmpty(targets)) {
        const lines: BrandSupplier.Line[] = (targets as BrandSupplier.Target[])
          .map(({ targetId, hasBrokerIcon }) => {
            const node = this.nodes.find((node) => node.id === targetId);
            return node
              ? {
                  hasBrokerIcon,
                  fromNodeId: id,
                  toNodeId: targetId,
                }
              : null;
          })
          .filter((item) => item);
        result = [...result, ...lines];
      }
    });
    return result;
  }

  get lineLabels(): BrandSupplier.Line[] {
    return this.lines.filter(({ hasBrokerIcon }) => hasBrokerIcon);
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

  created() {
    this.tierNodes = this.convertTiersToNodes();
  }

  setActiveNodeId(id: string = null): void {
    this.activeNodeId = id;
  }

  getLeft(
    tier: BrandSupplier.SupplierItem,
    supplier: BrandSupplier.TraceSupplierMapGroup,
  ): number {
    return supplier.isTier ? supplier.x : get(tier, 'x', 0);
  }

  getTop(supplier: BrandSupplier.TraceSupplierMapGroup): number {
    const type = get(supplier, 'type.name');
    if (!supplier.isTier) {
      const typeGroup = groupBy(this.data, 'type.name');
      const suppliers = get(typeGroup, type);
      const index = findIndex(
        suppliers,
        ({ orderSupplierId }) =>
          orderSupplierId.toLowerCase() === supplier.orderSupplierId,
      );
      if (index > -1) {
        return (
          (NODE_HEIGHT.MEDIUM + NODE_SPACE_Y) * index +
          this.marginTop +
          this.getTierHeight()
        );
      }
      return this.marginTop + this.getTierHeight();
    }
    return 0;
  }

  getTierHeight(): number {
    const maxTierName = maxBy(this.tierNodes, 'name.length');
    return (maxTierName.name.length / 20) * 30;
  }

  mounted() {
    this.graph.reset();
    this.nodes.forEach((node) => {
      if (node) {
        const nodeData = pick(node, [
          'id',
          'name',
          'label',
          'isRoot',
          'isTier',
          'x',
          'y',
        ]);
        this.graph.createNode({
          ...nodeData,
          ...this.nodeOptions,
        });
      }
    });
    this.lines.forEach((line) => {
      this.drawLine(line);
    });
    this.fitContent(false);
    this.checkIsLoaded();
  }

  checkIsLoaded() {
    const hasLogo = this.data.find(
      ({ isRoot, logo }) => isRoot && !isEmpty(logo),
    );
    if (!hasLogo) {
      this.loaded();
    }
  }

  renderNodeContent(node: App.MapNode): JSX.Element {
    if (node.isTier) {
      return this.renderTier(node, {
        height: this.getTierHeight(),
        isExpand: true,
      });
    }
    const supplier = this.nodes.find(({ id }) => id === node.id);
    const status = getRiskAssessmentStatus(get(supplier, 'riskData'));
    return (
      <Styled.Node
        status={status}
        activated={this.relatedNodeIds.includes(node.id)}
        height={this.nodeOptions.height}
      >
        <NodeInformation
          name={supplier.name}
          supplier={supplier}
          edit={() => {
            this.editSupplier(supplier, true);
          }}
          loadedLogo={this.loaded}
        />
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

  renderLabel(line: BrandSupplier.Line): JSX.Element {
    const edge = this.graph.edges.find(
      ({ from, to }: { from: string; to: string }) =>
        from === line.fromNodeId && to === line.toNodeId,
    );
    return (
      edge && (
        <Label edge={edge}>
          <font-icon
            name="broker"
            color="highland"
            size="20"
            title={this.$t('intermediaries')}
          />
        </Label>
      )
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
          {this.graph.edges.map((edge: App.MapEdge) => (
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
          {this.lineLabels.map(this.renderLabel)}
          {this.graph.nodes.map(this.renderNode)}
        </Screen>
      </Styled.Wrapper>
    );
  }
}
