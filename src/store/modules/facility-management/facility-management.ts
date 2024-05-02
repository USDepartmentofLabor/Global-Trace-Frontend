import {
  Action,
  getModule,
  Module,
  Mutation,
  VuexModule,
} from 'vuex-module-decorators';
import { get, noop } from 'lodash';
import store from 'store/index';
import { validateFacilityGroupTemplate } from 'api/facility-management';
import { MODULE } from './constants';

@Module({
  dynamic: true,
  namespaced: true,
  name: MODULE,
  store: store,
})
class FacilityManagement
  extends VuexModule
  implements AppStore.ImportFarmState
{
  public uploadedFile: Files.UploadedFile = {};
  public uploadedResponse: Files.UploadedFileResponse = {};

  @Action
  public async uploadFile({
    params,
    data,
    callback,
  }: {
    params: FacilityManagement.UploadFileParams;
    data: Files.UploadedFileParam;
    callback: App.Callback;
  }) {
    const onSuccess = get(callback, 'onSuccess', noop);
    const onFailure = get(callback, 'onFailure', noop);
    const onFinish = get(callback, 'onFinish', noop);

    try {
      const response = await validateFacilityGroupTemplate(data, params);
      this.ADD_UPLOAD_FILE(data.file);
      this.ADD_UPLOAD_RESPONSE(response);
      onSuccess(response.fileId);
    } catch (error) {
      onFailure(error);
    } finally {
      onFinish();
    }
  }

  @Action
  public resetFileUpload() {
    this.RESET_UPLOAD_FILE();
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

export default getModule(FacilityManagement);
