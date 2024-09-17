import {
  Action,
  getModule,
  Module,
  Mutation,
  VuexModule,
} from 'vuex-module-decorators';
import { get, noop } from 'lodash';
import store from 'store/index';
import {
  createSupplyChainNodes,
  getSupplyChainMapping,
} from 'api/supply-chain';
import { MODULE } from './constants';

@Module({
  dynamic: true,
  namespaced: true,
  name: MODULE,
  store: store,
})
class SupplyChain extends VuexModule {
  public supplyChainMapping: SupplyChain.SupplyChainMapping = null;

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
  async createSupplyChainNodes({
    params,
    callback,
  }: {
    params: SupplyChain.NodeParams;
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
    data: SupplyChain.SupplyChainMapping,
  ): void {
    this.supplyChainMapping = data;
  }
}

export default getModule(SupplyChain);
