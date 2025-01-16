import { Component, Mixins, Watch } from 'vue-property-decorator';
import { debounce, flatMap, get, isEmpty } from 'lodash';
import { Node, Edge, Label } from 'vnodes';
import productModule from 'store/modules/product';
import supplyChain from 'store/modules/supply-chain';
import { getTooltipOptions } from './supply-chain-mapping-helpers';
import SupplyChainMixin from './SupplyChainMixin';
import SupplyChainNodeContent from './SupplyChainNodeContent';

@Component
export default class SupplyChain extends Mixins(SupplyChainMixin) {
  @Watch('isDeletingNode')
  onChangeDeleteNode() {
    this.onDelete();
  }

  created() {
    this.onDebouncedUpdateMetadata = debounce(
      this.onDebouncedUpdateMetadata,
      300,
    );
  }

  renderNodeContent(node: App.MapNode): JSX.Element {
    return (
      <SupplyChainNodeContent
        supplyChain={this.supplyChain}
        node={node}
        roleOptions={this.roles}
        productOptions={productModule.products}
        removeNodes={this.showConfirmDeleteModal}
        removeRelations={this.showConfirmDeleteRelationModal}
        saveCalculatedField={this.saveCalculatedField}
        reload={this.reload}
      />
    );
  }

  renderNode(node: App.MapNode): JSX.Element {
    const nodeIds = flatMap(this.supplyChain.nodes, 'id');
    const show = nodeIds.includes(node.id);
    if (show) {
      return (
        <g>
          <Node
            data={node}
            margin={0}
            ref="node"
            width={this.nodeOptions.width}
            height={this.nodeOptions.height}
            vOn:drag={() => this.onDebouncedUpdateMetadata(node)}
          >
            {this.renderNodeContent(node)}
          </Node>
        </g>
      );
    }
    return null;
  }

  renderLabel(line: SupplyChain.Line): JSX.Element {
    const edge = this.graph.edges.find(
      ({ from, to }: { from: string; to: string }) =>
        from === line.fromNodeId && to === line.toNodeId,
    );
    const show = this.supplyChain.lines.find(
      ({ fromNodeId, toNodeId }) =>
        edge &&
        fromNodeId === edge.from &&
        toNodeId === edge.to &&
        isEmpty(supplyChain.currentImpactChainId),
    );
    return (
      show && (
        <Label edge={edge}>
          <font-icon
            v-tooltip={getTooltipOptions(this.$t('intermediaries'))}
            name="broker"
            color="highland"
            size="20"
            title={this.$t('intermediaries')}
          />
        </Label>
      )
    );
  }

  renderEdge(edge: App.Any) {
    const line = this.supplyChain.lines.find(
      ({ fromNodeId, toNodeId }) =>
        fromNodeId === edge.from && toNodeId === edge.to,
    );
    const relationId = get(line, 'relation.id');
    const isDanger =
      supplyChain.currentImpactData?.deletedLineIds.includes(relationId);
    if (line) {
      return (
        <Edge
          class={{ isDanger: isDanger }}
          data={edge}
          key={edge.id}
          nodes={this.graph.nodes}
        />
      );
    }
    return null;
  }

  render(): JSX.Element {
    return (
      <g>
        {this.graph.edges.map(this.renderEdge)}
        {this.lineLabels.map(this.renderLabel)}
        {this.graph.nodes.map(this.renderNode)}
      </g>
    );
  }
}
