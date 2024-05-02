import {
  Action,
  getModule,
  Module,
  Mutation,
  VuexModule,
} from 'vuex-module-decorators';
import { get, noop } from 'lodash';
import { getSuppliers, validateSupplierTemplate } from 'api/brand-supplier';
import store from 'store/index';
import { MODULE } from './constants';

@Module({
  dynamic: true,
  namespaced: true,
  name: MODULE,
  store: store,
})
class BrandSupplier extends VuexModule implements AppStore.BrandSupplierState {
  public uploadedFile: Files.UploadedFile = {};
  public uploadedResponse: Files.UploadedFileResponse = {};
  public items: Auth.Facility[] = [];
  public currentPage: number = 1;
  public total: number = null;
  public lastPage: number = 1;
  public perPage: number = 10;

  @Action
  public async getSupplierList({
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
      const response = await getSuppliers(params);
      this.SET_SUPPLIER_LIST(response);
      onSuccess(response);
    } catch (error) {
      onFailure(error);
    } finally {
      onFinish();
    }
  }

  @Action
  public async uploadFileSuppliers({
    data,
    callback,
  }: {
    data: Files.UploadedFileParam;
    callback: App.Callback;
  }) {
    const onSuccess = get(callback, 'onSuccess', noop);
    const onFailure = get(callback, 'onFailure', noop);
    const onFinish = get(callback, 'onFinish', noop);

    try {
      const response = await validateSupplierTemplate(data);
      this.ADD_UPLOAD_FILE(data.file);
      this.ADD_UPLOAD_RESPONSE(response);
      onSuccess();
    } catch (error) {
      onFailure(error);
    } finally {
      onFinish();
    }
  }

  @Action
  public resetFileSuppliers() {
    this.RESET_UPLOAD_FILE();
  }

  @Mutation
  private SET_SUPPLIER_LIST(payload: App.ListItem<Auth.Facility>) {
    this.items = payload.items;
    this.total = payload.total;
    this.lastPage = payload.lastPage;
    this.currentPage = payload.currentPage;
    this.perPage = payload.perPage;
  }

  @Mutation
  private ADD_UPLOAD_FILE(file: Files.UploadedFile): void {
    this.uploadedFile = file;
  }

  @Mutation
  private ADD_UPLOAD_RESPONSE(data: Files.UploadedFileResponse): void {
    this.uploadedResponse = data;
  }

  @Mutation
  private RESET_UPLOAD_FILE(): void {
    this.uploadedFile = {};
    this.uploadedResponse = {};
  }
}

export default getModule(BrandSupplier);
