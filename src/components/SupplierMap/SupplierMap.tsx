/* eslint-disable  max-lines-per-function */
import { Component, Prop, Mixins } from 'vue-property-decorator';
import { get, isEmpty, maxBy, pick } from 'lodash';
import { Screen } from 'vnodes';
import { NODE_SPACE_Y, NODE_WIDTH, NODE_HEIGHT } from 'config/constants';
import { isMobile } from 'utils/helpers';
import Unsupported from 'components/Unsupported';
import * as Styled from './styled';
import MapMixin from './MapMixin';
import SupplierNode from './SupplierNode';
import SupplierEdge from './SupplierEdge';

@Component
export default class SupplierMap extends Mixins(MapMixin) {
  @Prop({ default: [] }) data: Array<BrandSupplier.SupplierMapGroup[]>;

  private activeNodeId: string = '';
  private nodes: BrandSupplier.SupplierItem[] = [];
  private lines: BrandSupplier.Line[] = [];

  get nodeOptions(): App.Any {
    return {
      width: NODE_WIDTH.BIG,
      height: NODE_HEIGHT.MEDIUM,
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
  }

  initNodes() {
    const tierNodes =
      this.convertTiersToNodes() as BrandSupplier.SupplierItem[];
    let result: BrandSupplier.SupplierItem[] = tierNodes;
    this.data.forEach((group, groupIndex) => {
      const top = this.getGroupTop(groupIndex);
      group.forEach(({ suppliers, type }, supplierGroupIndex) => {
        const isExist = this.isExistInTiers(type);
        if (isExist) {
          const isRoot = supplierGroupIndex === group.length - 1;
          const { x } = tierNodes.find(
            ({ label }) => label.toLowerCase() === type.toLowerCase(),
          );
          suppliers = suppliers.reverse().map((supplier, index) => {
            const childrens: BrandSupplier.SupplierItem[] =
              this.getChildrens(supplier);
            const parents: BrandSupplier.SupplierItem[] =
              this.getParents(supplier);
            supplier.isRoot = isRoot;
            supplier.childrens = childrens;
            supplier.parents = parents;
            supplier.childrensTotal = supplier.targets.length;
            supplier.x = x;
            supplier.y = (NODE_HEIGHT.MEDIUM + NODE_SPACE_Y) * index + top;
            return supplier;
          });
          result = [...result, ...suppliers];
        }
      });
    });
    this.nodes = result.filter((item) => !isEmpty(item));
  }

  initLines() {
    let result: BrandSupplier.Line[] = [];
    this.data.forEach((group) => {
      group.forEach(({ suppliers, type }) => {
        const isExist = this.isExistInTiers(type);
        if (isExist) {
          suppliers.forEach(({ id, targets }) => {
            if (!isEmpty(targets)) {
              const lines: BrandSupplier.Line[] = targets
                .map((partnerId) => {
                  const node = this.nodes.find((node) => node.id === partnerId);
                  return node
                    ? {
                        hasBrokerIcon: false,
                        fromNodeId: id,
                        toNodeId: partnerId,
                      }
                    : null;
                })
                .filter((item) => item);
              result = [...result, ...lines];
            }
          });
        }
      });
    });
    this.lines = result;
  }

  getParents(
    supplier: BrandSupplier.SupplierItem,
  ): BrandSupplier.SupplierItem[] {
    const parents: BrandSupplier.SupplierItem[] = [];
    this.data.forEach((group: BrandSupplier.SupplierMapGroup[]) => {
      group.forEach((tierGroup: BrandSupplier.SupplierMapGroup) => {
        tierGroup.suppliers.forEach((item) => {
          if ((item.targets as string[]).includes(supplier.id)) {
            parents.push(item);
          }
        });
      });
    });
    return parents;
  }

  getChildrens(
    supplier: BrandSupplier.SupplierItem,
  ): BrandSupplier.SupplierItem[] {
    const childrens: BrandSupplier.SupplierItem[] = [];
    (supplier.targets as string[]).forEach((targetId) => {
      this.data.forEach((group) => {
        group.forEach((tierGroup) => {
          tierGroup.suppliers.forEach((item) => {
            if (targetId === item.id) {
              childrens.push(item);
            }
          });
        });
      });
    });
    return childrens;
  }

  expandSupplier(node: App.MapNode) {
    node.isExpanded = !node.isExpanded;
    this.handleExpand(node, null);
  }

  handleExpand(node: App.MapNode, childrenNode: App.MapNode) {
    const currentNode = childrenNode || node;
    const appNode = this.nodes.find(({ id }) => currentNode.id === id);
    const { childrens } = appNode;
    childrens.forEach((children) => {
      const childrenNode = this.graph.nodes.find(
        ({ id }: { id: string }) => id === children.id,
      );
      if (node.isExpanded) {
        childrenNode.parentsTotal++;
      } else {
        childrenNode.parentsTotal--;
      }
      this.handleExpand(node, childrenNode);
    });
  }

  getGroupTop(groupIndex: number): number {
    let top = 0;
    for (let i = 0; i < this.data.length; i++) {
      const max = maxBy(this.data[i], (group) => group.suppliers.length);
      const groupTop =
        max.suppliers.length * (NODE_HEIGHT.MEDIUM + NODE_SPACE_Y);
      if (groupIndex > 0 && i < groupIndex) {
        top += groupTop;
      }
    }
    return top + this.marginTop;
  }

  setActiveNodeId(id: string = null): void {
    this.activeNodeId = id;
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
          'parents',
          'childrens',
          'x',
          'y',
        ]);
        this.graph.createNode({
          ...nodeData,
          isExpanded: true,
          parentsTotal: get(node, 'parents.length', 0),
          childrensTotal: get(node, 'childrens.length', 0),
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
      <SupplierNode
        key={node.id}
        nodes={this.nodes}
        tiers={this.tiers}
        graphNodes={this.graph.nodes}
        relatedNodeIds={this.relatedNodeIds}
        node={node}
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
        size="default"
        vOn:wheel={(e: Event) => e.stopPropagation()}
      >
        <Screen ref="screen" options={this.screenOptions}>
          {this.graph.edges.map((edge: App.MapEdge) => (
            <SupplierEdge
              key={edge.id}
              activeNodeId={this.activeNodeId}
              edge={edge}
              nodes={this.nodes}
              graphNodes={this.graph.nodes}
            />
          ))}
          {this.graph.nodes.map(this.renderNode)}
        </Screen>
      </Styled.Wrapper>
    );
  }
}
