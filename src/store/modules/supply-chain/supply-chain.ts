import {
  Action,
  getModule,
  Module,
  Mutation,
  VuexModule,
} from 'vuex-module-decorators';
import { flatMap, get, head, noop } from 'lodash';
import store from 'store/index';
import {
  createSupplyChainNodes,
  getImpactData,
  getSupplyChainMapping,
  getUpdateImpacts,
} from 'api/supply-chain';
import { SupplyChainNodeActionEnum } from 'enums/setting';
import { MODULE } from './constants';

@Module({
  dynamic: true,
  namespaced: true,
  name: MODULE,
  store: store,
})
class SupplyChain extends VuexModule {
  public supplyChainMapping: SupplyChain.SupplyChainMapping[] = null;
  public currentImpactChainId: string = '';
  public nodeAction: SupplyChainNodeActionEnum = null;
  public currentImpactNodeIds: string[] = [];
  public currentOutputProductDefinitionIds: string[] = [];
  public currentImpactData: SupplyChain.PreviewImpactResponse = null;

  public get allNodes(): SupplyChain.Node[] {
    return flatMap(this.supplyChainMapping, 'nodes');
  }

  @Action
  public createChain(nodes: SupplyChain.Node[]) {
    this.CREATE_CHAIN(nodes);
  }

  @Action
  public removeNodesAndLines() {
    this.REMOVE_NODES_AND_LINES();
  }

  @Action
  public removeChain(chainId: string) {
    this.REMOVE_CHAIN(chainId);
  }

  @Action
  public async getSupplyChainMapping({
    callback,
  }: {
    callback: App.Callback;
  }): Promise<void> {
    const onSuccess = get(callback, 'onSuccess', noop);
    const onFailure = get(callback, 'onFailure', noop);
    const onFinish = get(callback, 'onFinish', noop);

    try {
      const data = await getSupplyChainMapping();
      this.INIT_SUPPLIER_CHAIN_MAPPING(data);
      onSuccess(data);
    } catch (error) {
      onFailure(error);
    } finally {
      onFinish();
    }
  }

  @Action
  public async getImpactData({
    nodeAction,
    chainId,
    nodeIds,
    callback,
  }: {
    nodeAction: SupplyChainNodeActionEnum;
    chainId: string;
    nodeIds: string[];
    callback: App.Callback;
  }): Promise<void> {
    const onSuccess = get(callback, 'onSuccess', noop);
    const onFailure = get(callback, 'onFailure', noop);
    const onFinish = get(callback, 'onFinish', noop);

    try {
      const impactData = await getImpactData({ nodeIds, chainId });
      this.SET_IMPACT_DATA({
        nodeAction,
        chainId,
        nodeIds,
        impactData,
        currentOutputProductDefinitionIds: [],
      });
      onSuccess();
    } catch (error) {
      onFailure(error);
    } finally {
      onFinish();
    }
  }

  @Action
  public async getUpdateImpactData({
    chainId,
    nodeId,
    outputProductDefinitionIds,
    callback,
  }: {
    chainId: string;
    nodeId: string;
    outputProductDefinitionIds: string[];
    callback: App.Callback;
  }): Promise<void> {
    const onSuccess = get(callback, 'onSuccess', noop);
    const onFailure = get(callback, 'onFailure', noop);
    const onFinish = get(callback, 'onFinish', noop);

    try {
      const impactData = await getUpdateImpacts(nodeId, {
        outputProductDefinitionIds: outputProductDefinitionIds,
      });
      this.SET_IMPACT_DATA({
        chainId,
        impactData,
        nodeAction: SupplyChainNodeActionEnum.EDIT_OUTPUT_PRODUCT,
        currentOutputProductDefinitionIds: outputProductDefinitionIds,
        nodeIds: [nodeId],
      });
      onSuccess();
    } catch (error) {
      onFailure(error);
    } finally {
      onFinish();
    }
  }

  @Action
  resetImpactData() {
    this.SET_IMPACT_DATA({
      nodeAction: null,
      chainId: null,
      nodeIds: [],
      impactData: null,
      currentOutputProductDefinitionIds: [],
    });
  }

  @Action
  async createSupplyChainNodes({
    params,
    callback,
  }: {
    params: SupplyChain.SupplyChainNodesParams;
    callback: App.Callback;
  }): Promise<void> {
    const onSuccess = get(callback, 'onSuccess', noop);
    const onFailure = get(callback, 'onFailure', noop);
    const onFinish = get(callback, 'onFinish', noop);
    try {
      const response = await createSupplyChainNodes(params);
      onSuccess(response);
    } catch (error) {
      onFailure(error);
    } finally {
      onFinish();
    }
  }

  @Mutation
  private INIT_SUPPLIER_CHAIN_MAPPING(
    data: SupplyChain.SupplyChainMapping[],
  ): void {
    this.supplyChainMapping = data;
  }

  @Mutation
  private CREATE_CHAIN(nodes: SupplyChain.Node[]) {
    this.supplyChainMapping.push({
      chainId: get(head(nodes), 'roleId'),
      lines: [],
      nodes,
    });
  }

  @Mutation
  private REMOVE_NODES_AND_LINES() {
    const chainIndex = this.supplyChainMapping.findIndex(
      (chain) => this.currentImpactChainId === chain.chainId,
    );
    if (chainIndex > -1) {
      this.supplyChainMapping[chainIndex].lines = this.supplyChainMapping[
        chainIndex
      ].lines.filter(
        ({ relation }) =>
          !this.currentImpactData.deletedLineIds.includes(relation.id),
      );
      this.supplyChainMapping[chainIndex].nodes = this.supplyChainMapping[
        chainIndex
      ].nodes.filter(
        ({ id }) => !this.currentImpactData.deletedNodeIds.includes(id),
      );
    }
  }

  @Mutation
  private REMOVE_CHAIN(chainId: string) {
    const chainIndex = this.supplyChainMapping.findIndex(
      (chain) => chainId === chain.chainId,
    );
    this.supplyChainMapping.splice(chainIndex, 1);
  }

  @Mutation
  private SET_IMPACT_DATA({
    nodeAction,
    chainId,
    nodeIds,
    currentOutputProductDefinitionIds,
    impactData,
  }: {
    nodeAction: SupplyChainNodeActionEnum;
    chainId: string;
    nodeIds: string[];
    currentOutputProductDefinitionIds: string[];
    impactData: SupplyChain.PreviewImpactResponse;
  }) {
    this.nodeAction = nodeAction;
    this.currentImpactChainId = chainId;
    this.currentImpactNodeIds = nodeIds;
    this.currentOutputProductDefinitionIds = currentOutputProductDefinitionIds;
    this.currentImpactData = impactData;
  }
}

export default getModule(SupplyChain);
