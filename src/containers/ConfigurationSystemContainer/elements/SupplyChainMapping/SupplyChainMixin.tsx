/* eslint-disable max-lines */
import { Vue, Component, Prop } from 'vue-property-decorator';
import { flatMap, get, has, head, isEmpty, size } from 'lodash';
import supplyChain from 'store/modules/supply-chain';
import { handleError } from 'components/Toast';
import {
  deleteMultiple,
  deleteSupplyChain,
  updateSupplyChainNodeMetadata,
} from 'api/supply-chain';
import { SupplyChainNodeActionEnum } from 'enums/setting';
import { updateSupplyChainMappingNodes } from './supply-chain-mapping-helpers';

const ConfirmModal = () => import('modals/ConfirmModal');

@Component
export default class SupplyChainMixin extends Vue {
  @Prop({ required: true }) graph: App.Any;
  @Prop({ required: true })
  supplyChain: SupplyChain.SupplyChainMapping;
  @Prop({ required: true })
  roles: RoleAndPermission.Role[];
  @Prop({ required: true })
  index: number;
  @Prop({ required: true })
  isDeletingNode: boolean;
  @Prop({
    default: () => {
      //
    },
  })
  reload: () => void;
  @Prop({
    default: () => {
      //
    },
  })
  deletedNode: () => void;

  public isLoading = true;
  public nodeOptions = {
    width: 222,
    height: 60,
  };
  public edgeOptions = {
    fromAnchor: {
      y: '50%',
      snap: 'rect',
    },
    toAnchor: {
      y: '50%',
      snap: 'rect',
    },
  };
  public abortController: AbortController = null;

  get lineLabels(): SupplyChain.Line[] {
    return this.supplyChain.lines.filter(({ hasBrokerIcon }) => hasBrokerIcon);
  }

  drawLine(line: SupplyChain.Line): void {
    const from = line.fromNodeId;
    const to = line.toNodeId;
    if (from && to) {
      this.graph.createEdge(from, to, this.edgeOptions);
    }
  }

  getFromNodeTotal(roleId: string = null): number {
    if (roleId) {
      const fromNode = this.supplyChain.nodes.filter(
        ({ fromRoleId }) => fromRoleId === roleId,
      );
      return fromNode.length;
    }
    return 0;
  }

  onDebouncedUpdateMetadata(
    node: App.MapNode,
    callback: (isSuccess: boolean) => void = null,
  ): void {
    if (this.abortController) {
      this.abortController.abort();
    }
    this.onUpdateNodeMetadata(node, callback);
  }

  async onUpdateNodeMetadata(
    node: App.MapNode,
    callback: (isSuccess: boolean) => void,
  ): Promise<void> {
    try {
      const params = this.getUpdateMetadataParams(node);
      this.abortController = new AbortController();
      const signal = this.abortController.signal;
      await updateSupplyChainNodeMetadata(node.id, params, signal);
      updateSupplyChainMappingNodes(node, this.supplyChain.nodes);
      if (callback) {
        callback(true);
      }
    } catch (error) {
      if (error) {
        handleError(error as App.ResponseError);
      }
      this.abortController = null;
      if (callback) {
        callback(false);
      }
    }
  }

  showConfirmDeleteModal(nodeIds: string[]): void {
    const firstNode = this.supplyChain.nodes.find(
      ({ id }) => head(nodeIds) === id,
    );
    const rootNodes = this.supplyChain.lines.filter(
      (item) => !has(item, 'fromNodeId'),
    );
    const firstNodeTotal = size(rootNodes);
    const isFirstNode = head(rootNodes).toNodeId === head(nodeIds);
    const isDeleteChain = firstNodeTotal === 1 && isFirstNode;
    this.$modal.show(
      ConfirmModal,
      {
        icon: 'warning_outline',
        iconSize: '60',
        iconColor: 'alizarinCrimson',
        message: isDeleteChain
          ? this.$t('remove_initial_node_title')
          : this.$t('remove_downstream_connection_title'),
        note: isDeleteChain
          ? this.$t('remove_initial_node_message')
          : this.$t('remove_downstream_connection_message'),
        confirmLabel: isDeleteChain
          ? this.$t('yes_continue_anyway')
          : this.$t('preview_impact'),
        confirmButtonVariant: isDeleteChain ? 'danger' : 'outlineDanger',
        cancelLabel: this.$t('common.action.cancel'),
        onConfirm: () => {
          if (isDeleteChain) {
            return this.onDelete(firstNode);
          } else {
            return this.getImpactDataFromNodeIds(nodeIds);
          }
        },
      },
      { width: '480px', height: 'auto', clickToClose: false, adaptive: true },
    );
  }

  showConfirmDeleteRelationModal(relationIds: string[]): void {
    this.$modal.show(
      ConfirmModal,
      {
        icon: 'warning_outline',
        iconSize: '60',
        iconColor: 'alizarinCrimson',
        message: this.$t('remove_downstream_connection_title'),
        note: this.$t('remove_downstream_connection_message'),
        confirmLabel: this.$t('preview_impact'),
        confirmButtonVariant: 'outlineDanger',
        cancelLabel: this.$t('common.action.cancel'),
        onConfirm: () => {
          return this.getImpactData(
            relationIds,
            SupplyChainNodeActionEnum.EDIT_DOWNSTREAM_SUPPLIER,
          );
        },
      },
      { width: '480px', height: 'auto', clickToClose: false, adaptive: true },
    );
  }

  async getImpactDataFromNodeIds(ids: string[]) {
    const lineIds = this.supplyChain.lines.filter(({ toNodeId }) =>
      ids.includes(toNodeId),
    );
    const relationIds = flatMap(lineIds, 'relation.id');
    this.getImpactData(relationIds, SupplyChainNodeActionEnum.DELETE);
  }

  async getImpactData(
    relationIds: string[],
    nodeAction: SupplyChainNodeActionEnum,
  ) {
    supplyChain.getImpactData({
      nodeAction,
      chainId: this.supplyChain.chainId,
      nodeIds: relationIds,
      callback: {
        onFailure: (error: App.ResponseError) => {
          handleError(error);
        },
      },
    });
  }

  saveCalculatedField(
    newNodeId: string,
    data: SupplyChain.Calculator,
    isUpdate: boolean,
  ) {
    const nodeIndex = this.supplyChain.nodes.findIndex(
      ({ id }) => newNodeId === id,
    );
    if (nodeIndex > -1) {
      if (isUpdate) {
        this.updateCalculatedField(nodeIndex, data);
      } else {
        this.supplyChain.nodes[nodeIndex].calculateFields.push(data);
      }
    }
  }

  updateCalculatedField(nodeIndex: number, data: SupplyChain.Calculator) {
    const calculatedFieldIndex = this.supplyChain.nodes[
      nodeIndex
    ].calculateFields.findIndex(({ id }) => id === data.id);
    if (calculatedFieldIndex > -1) {
      this.supplyChain.nodes[nodeIndex].calculateFields[calculatedFieldIndex] =
        data;
    }
  }

  async onDelete(firstNode: SupplyChain.Node = null): Promise<void> {
    try {
      if (firstNode) {
        return await this.handleDeleteChain(firstNode);
      }
      switch (supplyChain.nodeAction) {
        case SupplyChainNodeActionEnum.DELETE:
          await this.handleDeleteNode();
          break;
        case SupplyChainNodeActionEnum.EDIT_DOWNSTREAM_SUPPLIER:
          await this.handleDeleteSuppliers();
          break;
        case SupplyChainNodeActionEnum.EDIT_OUTPUT_PRODUCT:
          await this.updateOutputProduct();
          break;
      }
    } catch (error) {
      handleError(error as App.ResponseError);
    } finally {
      this.deletedNode();
    }
  }

  async handleDeleteChain(firstNode: SupplyChain.Node = null): Promise<void> {
    this.removeAllLines();
    this.removeAllNodes();
    await deleteSupplyChain(firstNode.id);
    supplyChain.removeChain(this.supplyChain.chainId);
  }

  removeAllLines() {
    this.supplyChain.lines.forEach(({ fromNodeId, toNodeId }) => {
      const edge = this.graph.edges.find(
        ({ from, to }: { from: string; to: string }) =>
          from === fromNodeId && to === toNodeId,
      );
      if (edge) {
        this.graph.removeEdge(edge);
      }
    });
  }

  removeAllNodes() {
    this.supplyChain.nodes.forEach(({ id }) => {
      const node = this.graph.nodes.find((item: App.MapNode) => item.id === id);
      if (node) {
        this.graph.removeNode(node);
      }
    });
  }

  async handleDeleteNode(): Promise<void> {
    try {
      const relationId = head(supplyChain.currentImpactNodeIds);
      const line = this.supplyChain.lines.find(
        ({ relation }) => relation.id === relationId,
      );
      const currentNode = this.supplyChain.nodes.find(
        (node) => node.id === line.toNodeId,
      );
      await deleteSupplyChain(currentNode.id);
      this.reload();
    } catch (error) {
      if (error) {
        handleError(error as App.ResponseError);
      }
    }
  }

  async handleDeleteSuppliers(): Promise<void> {
    try {
      await deleteMultiple({
        chainId: supplyChain.currentImpactChainId,
        nodeIds: supplyChain.currentImpactNodeIds,
      });
      this.reload();
    } catch (error) {
      if (error) {
        handleError(error as App.ResponseError);
      }
    }
  }

  async updateOutputProduct(): Promise<void> {
    try {
      this.abortController = new AbortController();
      const signal = this.abortController.signal;
      await updateSupplyChainNodeMetadata(
        head(supplyChain.currentImpactNodeIds),
        {
          outputProductDefinitionIds:
            supplyChain.currentOutputProductDefinitionIds,
        },
        signal,
      );
      this.reload();
    } catch (error) {
      if (error) {
        handleError(error as App.ResponseError);
      }
      this.abortController = null;
    }
  }

  deleteLinesFromImpactData() {
    const { deletedLineIds } = supplyChain.currentImpactData;
    const lines = this.supplyChain.lines.filter(({ relation }) =>
      deletedLineIds.includes(relation.id),
    );
    if (!isEmpty(lines)) {
      lines.forEach((line) => {
        this.updateOutputProductDefinitionIds(line);
        const edge = this.graph.edges.find(
          ({ from, to }: { from: string; to: string }) =>
            from === line.fromNodeId && to === line.toNodeId,
        );
        this.graph.removeEdge(edge);
      });
    }
  }

  updateOutputProductDefinitionIds(line: SupplyChain.Line) {
    const outputProductDefinitionIds = get(
      line,
      'relation.outputProductDefinitionIds',
      [],
    );
    const toNodeIndex = this.supplyChain.nodes.findIndex(
      ({ id }) => id === line.toNodeId,
    );
    if (toNodeIndex > -1) {
      this.supplyChain.nodes[toNodeIndex].outputProductDefinitionIds =
        this.supplyChain.nodes[toNodeIndex].outputProductDefinitionIds.filter(
          (id) => !outputProductDefinitionIds.includes(id),
        );
    }
  }

  deleteNodesFromImpactData() {
    const { deletedNodeIds } = supplyChain.currentImpactData;
    const nodes = this.supplyChain.nodes.filter(({ id }) =>
      deletedNodeIds.includes(id),
    );
    if (!isEmpty(nodes)) {
      nodes.forEach(({ id }) => {
        const node = this.graph.nodes.find(
          (item: App.MapNode) => item.id === id,
        );
        this.graph.removeNode(node);
      });
    }
    this.supplyChain.nodes = this.supplyChain.nodes.filter(
      ({ id }) => !deletedNodeIds.includes(id),
    );
  }

  getSupplyChainNode(node: App.MapNode): SupplyChain.Node {
    return this.supplyChain.nodes.find(({ id }) => id === node.id);
  }

  getUpdateMetadataParams(
    node: App.MapNode,
  ): SupplyChain.UpdateNodeMetadataParams {
    const { outputProductDefinitionIds } = this.getSupplyChainNode(node);
    const position = {
      left: node.x,
      top: node.y,
    };
    return {
      outputProductDefinitionIds,
      position,
    };
  }
}
