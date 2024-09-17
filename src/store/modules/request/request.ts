import {
  Action,
  getModule,
  Module,
  Mutation,
  VuexModule,
} from 'vuex-module-decorators';
import { get, noop } from 'lodash';
import store from 'store/index';
import { CategoryEnum } from 'enums/auditor';
import { getGrievanceReport, getCategories } from 'api/grievance-report';
import { MODULE } from './constants';

@Module({
  dynamic: true,
  namespaced: true,
  name: MODULE,
  store: store,
})
class Request extends VuexModule implements AppStore.AuditorRequestState {
  public requests: GrievanceReport.Report[] = [];
  public categories: GrievanceReport.Category[] = [];
  public indicators: GrievanceReport.Category[] = [];
  public subIndicators: GrievanceReport.Category[] = [];
  public total: number = 1;
  public lastPage: number = 1;
  public currentPage: number = 1;
  public perPage: number = 10;

  @Action
  public async getRequestList({
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
      const response = await getGrievanceReport(params);
      this.SET_LIST_REQUEST(response);
      onSuccess(response);
    } catch (error) {
      onFailure(error);
    } finally {
      onFinish();
    }
  }

  @Action
  async getCategories({ callback }: { callback: App.Callback }): Promise<void> {
    const onSuccess = get(callback, 'onSuccess', noop);
    const onFailure = get(callback, 'onFailure', noop);
    const onFinish = get(callback, 'onFinish', noop);
    try {
      const response = await getCategories({ type: CategoryEnum.CATEGORY });
      this.SET_LIST_CATEGORY(response);
      onSuccess(response);
    } catch (error) {
      onFailure(error);
    } finally {
      onFinish();
    }
  }

  @Action
  async getIndicators({ callback }: { callback: App.Callback }): Promise<void> {
    const onSuccess = get(callback, 'onSuccess', noop);
    const onFailure = get(callback, 'onFailure', noop);
    const onFinish = get(callback, 'onFinish', noop);
    try {
      const response = await getCategories({ type: CategoryEnum.INDICATOR });
      this.SET_LIST_INDICATOR(response);
      onSuccess(response);
    } catch (error) {
      onFailure(error);
    } finally {
      onFinish();
    }
  }

  @Action
  async getSubIndicators({
    parentIds,
    callback,
  }: {
    parentIds: string[];
    callback: App.Callback;
  }): Promise<void> {
    const onSuccess = get(callback, 'onSuccess', noop);
    const onFailure = get(callback, 'onFailure', noop);
    const onFinish = get(callback, 'onFinish', noop);
    try {
      const response = await getCategories({
        parentIds,
        type: CategoryEnum.SUB_INDICATOR,
      });
      this.SET_LIST_SUB_INDICATOR(response);
      onSuccess(response);
    } catch (error) {
      onFailure(error);
    } finally {
      onFinish();
    }
  }

  @Mutation
  private SET_LIST_CATEGORY(data: GrievanceReport.Category[]): void {
    this.categories = data;
  }

  @Mutation
  private SET_LIST_INDICATOR(data: GrievanceReport.Category[]): void {
    this.indicators = data;
  }

  @Mutation
  private SET_LIST_SUB_INDICATOR(data: GrievanceReport.Category[]): void {
    this.subIndicators = data;
  }

  @Mutation
  private SET_LIST_REQUEST(data: App.ListItem<GrievanceReport.Report>): void {
    this.requests = data.items;
    this.total = data.total;
    this.lastPage = data.lastPage;
    this.currentPage = data.currentPage;
    this.perPage = data.perPage;
  }
}

export default getModule(Request);
