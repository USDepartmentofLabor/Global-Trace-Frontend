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
import {
  getGrievanceReport,
  getCategories,
  getReasons,
  getAssignees,
} from 'api/grievance-report';
import { MODULE } from './constants';

@Module({
  dynamic: true,
  namespaced: true,
  name: MODULE,
  store: store,
})
class GrievanceReport
  extends VuexModule
  implements AppStore.GrievanceReportState
{
  public reports: GrievanceReport.Report[] = [];
  public indicators: GrievanceReport.Category[] = [];
  public reasons: GrievanceReport.Reason[] = [];
  public assignees: Auth.User[] = [];
  public total: number = 1;
  public lastPage: number = 1;
  public currentPage: number = 1;
  public perPage: number = 10;

  @Action
  public async getGrievanceReportList({
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
      this.SET_LIST_GRIEVANCE_REPORT(response);
      onSuccess(response);
    } catch (error) {
      onFailure(error);
    } finally {
      onFinish();
    }
  }

  @Action
  public async getIndicators() {
    try {
      const response = await getCategories({ type: CategoryEnum.INDICATOR });
      this.SET_LIST_INDICATOR(response);
    } catch (error) {
      //
    } finally {
      //
    }
  }

  @Action
  public async getReasons() {
    try {
      const response = await getReasons();
      this.SET_LIST_REASON(response);
    } catch (error) {
      //
    } finally {
      //
    }
  }

  @Action
  public async getAssignees() {
    try {
      const response = await getAssignees();
      this.SET_LIST_ASSIGNEE(response);
    } catch (error) {
      //
    } finally {
      //
    }
  }

  @Mutation
  private SET_LIST_GRIEVANCE_REPORT(
    data: App.ListItem<GrievanceReport.Report>,
  ): void {
    this.reports = data.items;
    this.total = data.total;
    this.lastPage = data.lastPage;
    this.currentPage = data.currentPage;
    this.perPage = data.perPage;
  }

  @Mutation
  private SET_LIST_INDICATOR(data: GrievanceReport.Category[]): void {
    this.indicators = data;
  }

  @Mutation
  private SET_LIST_REASON(data: GrievanceReport.Reason[]): void {
    this.reasons = data;
  }

  @Mutation
  private SET_LIST_ASSIGNEE(data: Auth.User[]): void {
    this.assignees = data;
  }
}

export default getModule(GrievanceReport);
