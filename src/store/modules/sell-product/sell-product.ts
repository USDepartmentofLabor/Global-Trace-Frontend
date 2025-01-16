import {
  Action,
  getModule,
  Module,
  Mutation,
  VuexModule,
} from 'vuex-module-decorators';
import { get, noop } from 'lodash';
import { getPartnerPurchasers, sellProduct } from 'api/sell';
import store from 'store/index';
import { MODULE } from './constants';

@Module({
  dynamic: true,
  namespaced: true,
  name: MODULE,
  store: store,
})
class SellProduct extends VuexModule implements AppStore.SellProductState {
  public partnerPurchasers: SellProduct.PartnerPurchaser[] = [];

  @Action
  public resetPartnerPurchasers(): void {
    this.RESET_PARTNER_PURCHASERS();
  }

  @Action
  async getPartnerPurchaser({
    params,
    callback,
  }: {
    params: App.searchKey;
    callback: App.Callback;
  }): Promise<void> {
    const onSuccess = get(callback, 'onSuccess', noop);
    const onFailure = get(callback, 'onFailure', noop);
    const onFinish = get(callback, 'onFinish', noop);
    try {
      const response = await getPartnerPurchasers(params);
      this.SET_LIST_PARTNER_PURCHASER(response);
      onSuccess(response);
    } catch (error) {
      onFailure(error);
    } finally {
      onFinish();
    }
  }

  @Action
  async sellProduct({
    data,
    callback,
  }: {
    data: SellProduct.RequestParams;
    callback: App.Callback;
  }): Promise<void> {
    const onSuccess = get(callback, 'onSuccess', noop);
    const onFailure = get(callback, 'onFailure', noop);
    const onFinish = get(callback, 'onFinish', noop);
    try {
      const response = await sellProduct(data);
      onSuccess(response);
    } catch (error) {
      onFailure(error);
    } finally {
      onFinish();
    }
  }

  @Mutation
  private SET_LIST_PARTNER_PURCHASER(
    data: SellProduct.PartnerPurchaser[],
  ): void {
    this.partnerPurchasers = data;
  }

  @Mutation
  private RESET_PARTNER_PURCHASERS(): void {
    this.partnerPurchasers = [];
  }
}

export default getModule(SellProduct);
