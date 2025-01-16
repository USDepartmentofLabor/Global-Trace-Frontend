import {
  Action,
  getModule,
  Module,
  Mutation,
  VuexModule,
} from 'vuex-module-decorators';
import { get, noop, orderBy } from 'lodash';
import { getPartnerSellers, getRequiredSellers } from 'api/purchase';
import { getCertificationList } from 'api/onboard';
import { convertEnumToTranslation } from 'utils/translation';
import { translate } from 'utils/helpers';
import store from 'store/index';
import { MODULE } from './constants';

@Module({
  dynamic: true,
  namespaced: true,
  name: MODULE,
  store: store,
})
class Purchase extends VuexModule implements AppStore.PurchaseState {
  public partnerSellers: Purchase.PartnersSeller[] = [];
  public certifications: App.DropdownOption[] = [];
  public productDefinitionAttributes: Purchase.ProductDefinitionAttribute[] =
    [];
  public isSellerRequired: boolean = false;

  @Action
  public resetPartnerSellers(): void {
    this.RESET_PARTNER_SELLERS();
  }

  @Action
  public setProductDefinitionAttribute(
    data: Purchase.ProductDefinitionAttribute[],
  ): void {
    this.SET_PRODUCT_DEFINITIONS_ATTRIBUTES(data);
  }

  @Action
  async getCertificationOptions({
    callback,
  }: {
    callback: App.Callback;
  }): Promise<void> {
    const onSuccess = get(callback, 'onSuccess', noop);
    const onFailure = get(callback, 'onFailure', noop);
    const onFinish = get(callback, 'onFinish', noop);
    try {
      const response = await getCertificationList();
      this.SET_CERTIFICATION(
        response.map(({ id, name }) => ({
          id: name,
          name: translate(convertEnumToTranslation(id as string)),
        })),
      );
      onSuccess(response);
    } catch (error) {
      onFailure(error);
    } finally {
      onFinish();
    }
  }

  @Action
  async getPartnerSellers({
    params,
    callback,
  }: {
    params: Purchase.PartnerSellerParam;
    callback: App.Callback;
  }): Promise<void> {
    const onSuccess = get(callback, 'onSuccess', noop);
    const onFailure = get(callback, 'onFailure', noop);
    const onFinish = get(callback, 'onFinish', noop);
    try {
      const response = await getPartnerSellers(params);
      this.SET_PARTNER_SELLERS(response);
      onSuccess(response);
    } catch (error) {
      onFailure(error);
    } finally {
      onFinish();
    }
  }

  @Action
  async getRequiredSellers({
    callback,
  }: {
    callback: App.Callback;
  }): Promise<void> {
    const onSuccess = get(callback, 'onSuccess', noop);
    const onFailure = get(callback, 'onFailure', noop);
    const onFinish = get(callback, 'onFinish', noop);
    try {
      const response = await getRequiredSellers();
      this.SET_REQUIRED_SELLERS(response);
      onSuccess(response);
    } catch (error) {
      onFailure(error);
    } finally {
      onFinish();
    }
  }

  @Mutation
  private SET_PARTNER_SELLERS(data: Purchase.PartnersSeller[]): void {
    this.partnerSellers = data;
  }

  @Mutation
  private RESET_PARTNER_SELLERS(): void {
    this.partnerSellers = [];
  }

  @Mutation
  private SET_CERTIFICATION(data: App.DropdownOption[]): void {
    this.certifications = data;
  }

  @Mutation
  private SET_PRODUCT_DEFINITIONS_ATTRIBUTES(
    data: Purchase.ProductDefinitionAttribute[],
  ): void {
    this.productDefinitionAttributes = orderBy(data, 'order', 'asc');
  }

  @Mutation
  private SET_REQUIRED_SELLERS(data: Purchase.RequiredSellers): void {
    this.isSellerRequired = data.isSellerRequired;
  }
}

export default getModule(Purchase);
