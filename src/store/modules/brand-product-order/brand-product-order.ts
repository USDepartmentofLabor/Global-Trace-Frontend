import {
  getModule,
  Module,
  VuexModule,
  Action,
  Mutation,
} from 'vuex-module-decorators';
import { get, noop } from 'lodash';
import { getOrderList } from 'api/brand-orders';
import store from 'store/index';
import { MODULE } from './constants';

@Module({
  dynamic: true,
  namespaced: true,
  name: MODULE,
  store: store,
})
class BrandProductOrder
  extends VuexModule
  implements AppStore.BrandProductOrderState
{
  public items: BrandProduct.Order[] = [];
  public total: number = 1;
  public lastPage: number = 1;
  public perPage: number = 10;
  public currentPage: number = 1;

  @Action
  public async getOrderList({
    params,
    callback,
  }: {
    params: App.RequestParams;
    callback: App.Callback;
  }): Promise<void> {
    const onSuccess = get(callback, 'onSuccess', noop);
    const onFailure = get(callback, 'onFailure', noop);
    const onFinish = get(callback, 'onFinish', noop);

    try {
      const data = await getOrderList(params);
      this.SET_ORDER_LIST(data);
      onSuccess(data);
    } catch (error) {
      onFailure(error);
    } finally {
      onFinish();
    }
  }

  @Mutation
  private SET_ORDER_LIST(data: App.ListItem<BrandProduct.Order>): void {
    this.items = data.items;
    this.total = data.total;
    this.lastPage = data.lastPage;
    this.perPage = data.perPage;
    this.currentPage = data.currentPage;
  }
}

export default getModule(BrandProductOrder);
