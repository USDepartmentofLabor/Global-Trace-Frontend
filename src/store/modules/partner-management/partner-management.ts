import {
  Action,
  getModule,
  Module,
  Mutation,
  VuexModule,
} from 'vuex-module-decorators';
import { get, noop } from 'lodash';
import store from 'store/index';
import { getPartnerList } from 'api/partner-management';
import { MODULE } from './constants';

@Module({
  dynamic: true,
  namespaced: true,
  name: MODULE,
  store: store,
})
class PartnerManagement
  extends VuexModule
  implements AppStore.PartnerManagementState
{
  public partners: PartnerManagement.Partner[] = [];
  public total: number = 1;
  public lastPage: number = 1;
  public currentPage: number = 1;
  public perPage: number = 10;

  @Action
  public async getPartnerList({
    params,
    callback,
  }: {
    params: PartnerManagement.RequestParams;
    callback: App.Callback;
  }): Promise<void> {
    const onSuccess = get(callback, 'onSuccess', noop);
    const onFailure = get(callback, 'onFailure', noop);
    const onFinish = get(callback, 'onFinish', noop);

    try {
      const response = await getPartnerList(params);
      this.SET_LIST_PARTNER(response);
      onSuccess(response);
    } catch (error) {
      onFailure(error);
    } finally {
      onFinish();
    }
  }

  @Mutation
  private SET_LIST_PARTNER(
    data: App.ListItem<PartnerManagement.Partner>,
  ): void {
    this.partners = data.items;
    this.total = data.total;
    this.lastPage = data.lastPage;
    this.currentPage = data.currentPage;
    this.perPage = data.perPage;
  }
}

export default getModule(PartnerManagement);
