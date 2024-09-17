import {
  Action,
  getModule,
  Module,
  Mutation,
  VuexModule,
} from 'vuex-module-decorators';
import { get, noop } from 'lodash';
import store from 'store/index';
import { getUserList } from 'api/user-management';
import { MODULE } from './constants';

@Module({
  dynamic: true,
  namespaced: true,
  name: MODULE,
  store: store,
})
class UserManagement
  extends VuexModule
  implements AppStore.UserManagementState
{
  public users: Auth.User[] = [];
  public total: number = 1;
  public lastPage: number = 1;
  public currentPage: number = 1;
  public perPage: number = 20;

  @Action
  public async getUserList({
    params,
    callback,
  }: {
    params: UserManagement.RequestParams;
    callback: App.Callback;
  }): Promise<void> {
    const onSuccess = get(callback, 'onSuccess', noop);
    const onFailure = get(callback, 'onFailure', noop);
    const onFinish = get(callback, 'onFinish', noop);

    try {
      const response = await getUserList(params);
      this.SET_LIST_USER(response);
      onSuccess(response);
    } catch (error) {
      onFailure(error);
    } finally {
      onFinish();
    }
  }

  @Mutation
  private SET_LIST_USER(data: App.ListItem<Auth.User>): void {
    this.users = data.items;
    this.total = data.total;
    this.lastPage = data.lastPage;
    this.currentPage = data.currentPage;
    this.perPage = data.perPage;
  }
}

export default getModule(UserManagement);
