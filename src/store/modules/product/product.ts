import {
  getModule,
  Module,
  VuexModule,
  Action,
  Mutation,
} from 'vuex-module-decorators';
import { get, noop } from 'lodash';
import { getProducts } from 'api/product-management';
import store from 'store/index';
import { MODULE } from './constants';

@Module({
  dynamic: true,
  namespaced: true,
  name: MODULE,
  store: store,
})
class Product extends VuexModule implements AppStore.ProductState {
  public products: ProductManagement.Product[] = [];

  @Action
  public async getProductList({
    callback,
  }: {
    callback: App.Callback;
  }): Promise<void> {
    const onSuccess = get(callback, 'onSuccess', noop);
    const onFailure = get(callback, 'onFailure', noop);
    const onFinish = get(callback, 'onFinish', noop);

    try {
      const data = await getProducts();
      this.SET_PRODUCT_LIST(data);
      onSuccess(data);
    } catch (error) {
      onFailure(error);
    } finally {
      onFinish();
    }
  }

  @Mutation
  private SET_PRODUCT_LIST(data: ProductManagement.Product[]): void {
    this.products = data;
  }
}

export default getModule(Product);
