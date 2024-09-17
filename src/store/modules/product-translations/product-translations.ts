import {
  Action,
  getModule,
  Module,
  Mutation,
  VuexModule,
} from 'vuex-module-decorators';
import { get, noop } from 'lodash';
import store from 'store/index';
import {
  validateTranslationAttributesTemplate,
  validateTranslationProductsTemplate,
} from 'api/product-translation';
import { MODULE } from './constants';

@Module({
  dynamic: true,
  namespaced: true,
  name: MODULE,
  store: store,
})
class ProductTranslations
  extends VuexModule
  implements AppStore.ImportProductTranslationsState
{
  public uploadedProductsResponse: Files.UploadedFileResponse = {};
  public uploadedAttributesResponse: Files.UploadedFileResponse = {};

  @Action
  public async uploadProductsFile({
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
      const response = await validateTranslationProductsTemplate(data);
      this.ADD_UPLOAD_PRODUCTS_RESPONSE(response);
      onSuccess(response.fileId);
    } catch (error) {
      onFailure(error);
    } finally {
      onFinish();
    }
  }

  @Action
  public async uploadAttributesFile({
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
      const response = await validateTranslationAttributesTemplate(data);
      this.ADD_UPLOAD_ATTRIBUTES_RESPONSE(response);
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
  private ADD_UPLOAD_PRODUCTS_RESPONSE(data: Files.UploadedFileResponse): void {
    this.uploadedProductsResponse = data;
  }

  @Mutation
  private ADD_UPLOAD_ATTRIBUTES_RESPONSE(
    data: Files.UploadedFileResponse,
  ): void {
    this.uploadedAttributesResponse = data;
  }

  @Mutation
  private RESET_UPLOAD_FILE(): void {
    this.uploadedProductsResponse = {};
    this.uploadedAttributesResponse = {};
  }
}

export default getModule(ProductTranslations);
