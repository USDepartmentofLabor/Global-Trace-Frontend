/* eslint-disable  max-lines-per-function */
import { Component, Prop, Mixins } from 'vue-property-decorator';
import { cloneDeep, findIndex, get, groupBy, isEmpty, pick } from 'lodash';
import { Screen } from 'vnodes';
import {
  NODE_HEIGHT,
  NODE_SPACE_Y,
  NODE_WIDTH,
  SUPPLIER_SPLIT_CODE,
} from 'config/constants';
import { isMobile } from 'utils/helpers';
import Unsupported from 'components/Unsupported';
import * as Styled from './styled';
import MapMixin from './MapMixin';
import MapNode from './MapNode';
import MapEdge from './MapEdge';

@Component
export default class TraceOrderMap extends Mixins(MapMixin) {
  @Prop({ default: 'default' }) size: string;
  @Prop({ default: true }) isEdit: boolean;
  @Prop({ default: [] }) data: BrandSupplier.TraceSupplierMapGroup[];
  @Prop({ default: [] }) canEditSupplierIds: string[];

  private activeNodeId: string = '';
  private nodes: BrandSupplier.TraceSupplierMapGroup[] = [];
  private lines: BrandSupplier.Line[] = [];
  private lineLabels: BrandSupplier.Line[] = [];

  get nodeOptions(): App.Any {
    return {
      width: NODE_WIDTH.BIG,
      height: NODE_HEIGHT.BIG,
    };
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
    this.initNodes();
    this.initLines();
    this.initLineLabels();
  }

  initNodes() {
    const tierNodes =
      this.convertTiersToNodes() as BrandSupplier.TraceSupplierMapGroup[];
    const data = [...tierNodes, ...cloneDeep(this.data.reverse())];
    data.forEach((supplier) => {
      const id = supplier.isTier ? supplier.id : supplier.orderSupplierId;
      const type = get(supplier, 'type.name');
      const childrens: BrandSupplier.TraceSupplierMapGroup[] =
        this.getChildrens(supplier);
      const parents: BrandSupplier.TraceSupplierMapGroup[] =
        this.getParents(supplier);
      const tier = tierNodes.find(
        ({ label }) =>
          label &&
          type &&
          label
            .toLowerCase()
            .split(SUPPLIER_SPLIT_CODE)
            .includes(type.toLowerCase()),
      );
      this.nodes.push({
        ...supplier,
        id,
        childrens,
        parents,
        x: this.getLeft(tier, supplier),
        y: this.getTop(supplier),
      });
    });
  }

  getLeft(
    tier: BrandSupplier.TraceSupplierMapGroup,
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
        return (NODE_HEIGHT.MEDIUM + NODE_SPACE_Y) * index + this.marginTop;
      }
      return this.marginTop;
    }
    return 0;
  }

  getChildrens(
    supplier: BrandSupplier.TraceSupplierMapGroup,
  ): BrandSupplier.TraceSupplierMapGroup[] {
    const childrens: BrandSupplier.TraceSupplierMapGroup[] = [];
    this.data.forEach((chain) => {
      if (supplier.id !== chain.id) {
        const index = chain.targets.findIndex(
          ({ targetId }) => targetId === supplier.orderSupplierId,
        );
        if (index > -1) {
          childrens.push(chain);
        }
      }
    });
    return childrens;
  }

  getParents(
    supplier: BrandSupplier.TraceSupplierMapGroup,
  ): BrandSupplier.TraceSupplierMapGroup[] {
    const parents: BrandSupplier.TraceSupplierMapGroup[] = [];
    supplier.targets.forEach(({ targetId }) => {
      parents.push(
        this.data.find(({ orderSupplierId }) => orderSupplierId === targetId),
      );
    });
    return parents;
  }

  initLines() {
    this.data.forEach(({ orderSupplierId, targets }) => {
      if (!isEmpty(targets)) {
        const lines: BrandSupplier.Line[] = targets
          .map(({ targetId, hasBrokerIcon }) => {
            const node = this.data.find(
              ({ orderSupplierId }) => orderSupplierId === targetId,
            );
            return node
              ? {
                  hasBrokerIcon,
                  fromNodeId: orderSupplierId,
                  toNodeId: targetId,
                }
              : null;
          })
          .filter((item) => item);
        this.lines = [...this.lines, ...lines];
      }
    });
  }

  initLineLabels() {
    this.lineLabels = this.lines.filter(({ hasBrokerIcon }) => hasBrokerIcon);
  }

  setActiveNodeId(id: string = null): void {
    this.activeNodeId = id;
  }

  expandSupplier(node: App.MapNode) {
    node.isExpanded = !node.isExpanded;
    this.handleExpand(node, null);
  }

  handleExpand(node: App.MapNode, childrenNode: App.MapNode) {
    const currentNode = childrenNode || node;
    const appNode = this.nodes.find(
      ({ orderSupplierId }) => currentNode.id === orderSupplierId,
    );
    const { childrens } = appNode;
    childrens.forEach((children) => {
      const childrenNode = this.graph.nodes.find(
        ({ id }: { id: string }) => id === children.orderSupplierId,
      );
      if (node.isExpanded) {
        childrenNode.parentsTotal++;
      } else {
        childrenNode.parentsTotal--;
      }
      this.handleExpand(node, childrenNode);
    });
  }

  mounted() {
    this.graph.reset();
    this.nodes.forEach((node) => {
      if (node) {
        const appNode = this.nodes.find(
          ({ orderSupplierId }) => node.id === orderSupplierId,
        );
        const nodeData = pick(node, [
          'id',
          'name',
          'label',
          'isRoot',
          'isTier',
          'parents',
          'childrens',
          'x',
          'y',
        ]);
        this.graph.createNode({
          isExpanded: true,
          parentsTotal: get(appNode, 'parents.length', 0),
          childrensTotal: get(appNode, 'childrens.length', 0),
          ...nodeData,
          ...this.nodeOptions,
        });
      }
    });
    this.lines.forEach((line) => {
      this.drawLine(line);
    });
    this.fitContent(false);
  }

  renderNode(node: App.MapNode): JSX.Element {
    const childrensTotal = this.lines.filter(
      ({ toNodeId }) => toNodeId === node.id,
    ).length;
    return (
      <MapNode
        key={node.id}
        nodes={this.nodes}
        tiers={this.tiers}
        graphNodes={this.graph.nodes}
        relatedNodeIds={this.relatedNodeIds}
        isEdit={this.isEdit}
        data={this.data}
        node={node}
        canEditSupplierIds={this.canEditSupplierIds}
        childrensTotal={childrensTotal}
        setActiveNodeId={this.setActiveNodeId}
        expandSupplier={() => {
          this.expandSupplier(node);
        }}
        clickSupplier={this.clickSupplier}
        editSupplier={this.editSupplier}
      />
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
          {this.graph.edges.map((edge: App.MapEdge) => (
            <MapEdge
              key={edge.id}
              activeNodeId={this.activeNodeId}
              edge={edge}
              nodes={this.nodes}
              graphNodes={this.graph.nodes}
            />
          ))}
          {this.lineLabels.map(this.renderLabel)}
          {this.graph.nodes.map(this.renderNode)}
        </Screen>
      </Styled.Wrapper>
    );
  }
}
