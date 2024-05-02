import { Action, getModule, Module, VuexModule } from 'vuex-module-decorators';
import { get, noop } from 'lodash';
import store from 'store/index';
import { createSupplyChainNodes } from 'api/supply-chain';
import { MODULE } from './constants';

@Module({
  dynamic: true,
  namespaced: true,
  name: MODULE,
  store: store,
})
class SupplyChain extends VuexModule {
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
}

export default getModule(SupplyChain);
