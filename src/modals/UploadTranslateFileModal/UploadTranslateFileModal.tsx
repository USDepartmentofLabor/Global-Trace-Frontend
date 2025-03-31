/* eslint-disable max-lines */
import { Component, Vue, Prop } from 'vue-property-decorator';
import { get, isEmpty } from 'lodash';
import { handleError } from 'components/Toast';
import { UPLOAD_TRANSLATE } from 'config/constants';
import ImportFile from 'components/ImportFile';
import Button from 'components/FormUI/Button';
import SupplierLayout from 'components/Layout/SupplierLayout';
import TranslationFiles from 'components/TranslationFiles';
import { SpinLoading } from 'components/Loaders';
import { getShortToken } from 'api/auth';
import {
  downloadLatestAttributeTranslationUrl,
  downloadLatestProductTranslationUrl,
  downloadTranslationAttributesTemplate,
  downloadTranslationProductsTemplate,
} from 'utils/download-helper';
import {
  updateTranslationAttributes,
  updateTranslationProducts,
  getLatestAttributeTranslationFile,
  getLatestProductTranslationFile,
  validateTranslationProductsTemplate,
  validateTranslationAttributesTemplate,
  deleteProductTranslationFile,
  deleteAttributeTranslationFile,
} from 'api/product-translation';
import { UploadType } from 'enums/app';
import * as Styled from 'styles/translation-file';
import EmptyFile from './elements/EmptyFile';

const ValidationModal = () => import('modals/ValidationModal');

@Component
export default class UploadTranslateFileModal extends Vue {
  @Prop({
    default: () => {
      //
    },
  })
  onSuccess: () => void;

  private isLoading: boolean = false;
  private isSubmitting: boolean = false;
  private isDeleting: boolean = false;
  private latestProductTranslationFile: App.SelectedFile[] = [];
  private latestAttributeTranslationFile: App.SelectedFile[] = [];
  private uploadedProductResponse: Files.UploadedFileResponse = null;
  private uploadedAttributeResponse: Files.UploadedFileResponse = null;

  get hasData(): boolean {
    return !(
      isEmpty(this.latestAttributeTranslationFile) &&
      isEmpty(this.latestProductTranslationFile)
    );
  }

  get isDisabledSubmit(): boolean {
    return this.isSubmitting || !this.hasData;
  }

  get validationProductErrors(): Files.ValidationError[] {
    return get(this.uploadedProductResponse, 'validationErrors', []);
  }

  get numberProductErrors(): number {
    return this.validationProductErrors.length;
  }

  get validationAttributeErrors(): Files.ValidationError[] {
    return get(this.uploadedAttributeResponse, 'validationErrors', []);
  }

  get numberAttributeErrors(): number {
    return this.validationAttributeErrors.length;
  }

  async initData(): Promise<void> {
    this.isLoading = true;
    try {
      const [latestProductTranslation, latestAttributeTranslation] =
        await Promise.all([
          getLatestProductTranslationFile(),
          getLatestAttributeTranslationFile(),
        ]);
      this.latestProductTranslationFile = latestProductTranslation;
      this.latestAttributeTranslationFile = latestAttributeTranslation;
    } catch (error) {
      handleError(error as App.ResponseError);
    } finally {
      this.isLoading = false;
    }
  }

  created(): void {
    this.initData();
  }

  closeModal(): void {
    this.$emit('close');
  }

  async downloadProductTemplates(): Promise<void> {
    try {
      const response = await getShortToken();
      const downloadProductsUrl = downloadTranslationProductsTemplate(
        response.shortToken,
      );
      window.open(downloadProductsUrl, '_blank');
    } catch (error) {
      handleError(error as App.ResponseError);
    }
  }

  async downloadAttributesTemplates(): Promise<void> {
    try {
      const response = await getShortToken();
      const downloadAttributeUrl = downloadTranslationAttributesTemplate(
        response.shortToken,
      );
      window.open(downloadAttributeUrl, '_blank');
    } catch (error) {
      handleError(error as App.ResponseError);
    }
  }

  async onValidateTranslationProducts(file: App.SelectedFile): Promise<void> {
    try {
      this.uploadedProductResponse = await validateTranslationProductsTemplate(
        file,
      );
      if (this.numberProductErrors > 0) {
        this.showValidationModal(UploadType.PRODUCT);
      } else {
        this.latestProductTranslationFile = [
          ...this.latestProductTranslationFile,
          file,
        ];
      }
    } catch (error) {
      handleError(error as App.ResponseError);
    }
  }

  async onValidateTranslationAttributes(file: App.SelectedFile): Promise<void> {
    try {
      this.uploadedAttributeResponse =
        await validateTranslationAttributesTemplate(file);
      if (this.numberAttributeErrors > 0) {
        this.showValidationModal(UploadType.ATTRIBUTE);
      } else {
        this.latestAttributeTranslationFile = [
          ...this.latestAttributeTranslationFile,
          file,
        ];
      }
    } catch (error) {
      handleError(error as App.ResponseError);
    }
  }

  async onDownload(fileId: string, isProduct: boolean = false): Promise<void> {
    try {
      const { shortToken } = await getShortToken();
      const downloadUrl = isProduct
        ? downloadLatestProductTranslationUrl(fileId, shortToken)
        : downloadLatestAttributeTranslationUrl(fileId, shortToken);
      window.open(downloadUrl, '_blank');
    } catch (error) {
      handleError(error as App.ResponseError);
    }
  }

  async onDeleteProductFile(file: App.SelectedFile): Promise<void> {
    if (!this.isDeleting) {
      this.isDeleting = true;
      if (file.createdAt) {
        try {
          await deleteProductTranslationFile(file.id);
        } catch (error) {
          handleError(error as App.ResponseError);
        }
      } else {
        this.uploadedProductResponse = null;
      }
      this.latestProductTranslationFile =
        this.latestProductTranslationFile.filter(({ id }) => id !== file.id);
      this.isDeleting = false;
    }
  }

  async onDeleteAttributeFile(file: App.SelectedFile): Promise<void> {
    if (!this.isDeleting) {
      this.isDeleting = true;
      if (file.createdAt) {
        try {
          await deleteAttributeTranslationFile(file.id);
        } catch (error) {
          handleError(error as App.ResponseError);
        }
      } else {
        this.uploadedAttributeResponse = null;
      }
      this.latestAttributeTranslationFile =
        this.latestAttributeTranslationFile.filter(({ id }) => id !== file.id);
      this.isDeleting = false;
    }
  }

  async onSubmit(): Promise<void> {
    try {
      const fileProductsId = get(this.uploadedProductResponse, 'file.id', '');
      const fileAttributesId = get(
        this.uploadedAttributeResponse,
        'file.id',
        '',
      );
      this.isSubmitting = true;

      await Promise.all([
        fileProductsId && updateTranslationProducts(fileProductsId),
        fileAttributesId && updateTranslationAttributes(fileAttributesId),
      ]);

      this.uploadedProductResponse = null;
      this.uploadedAttributeResponse = null;
      this.$toast.success(this.$t('upload_translations_file_success_message'));
      this.onSuccess();
      this.closeModal();
    } catch (error) {
      handleError(error as App.ResponseError);
    } finally {
      this.isSubmitting = false;
    }
  }

  showValidationModal(type: UploadType): void {
    const title =
      type === UploadType.PRODUCT
        ? this.$t('product_translation')
        : this.$t('product_attribute_translation');
    this.$modal.show(
      ValidationModal,
      {
        title,
        validationErrors:
          type === UploadType.ATTRIBUTE
            ? this.validationAttributeErrors
            : this.validationProductErrors,
        numberErrors:
          type === UploadType.ATTRIBUTE
            ? this.numberAttributeErrors
            : this.numberProductErrors,
      },
      {
        width: '550px',
        height: 'auto',
        clickToClose: false,
      },
    );
  }

  renderHeader(): JSX.Element {
    return (
      <Styled.Top>
        <Styled.Back onClick={this.closeModal}>
          <font-icon name="arrow_left" color="black" size="20" />
          {this.$t('upload_translation')}
        </Styled.Back>
        <Button
          width="100%"
          label={this.$t('common.action.submit')}
          variant="primary"
          isLoading={this.isSubmitting}
          disabled={this.isDisabledSubmit}
          click={this.onSubmit}
        />
      </Styled.Top>
    );
  }

  renderActions(): JSX.Element {
    return (
      <Styled.Actions>
        <ImportFile
          validateFile={this.onValidateTranslationProducts}
          accept={UPLOAD_TRANSLATE.ACCEPTED}
          inputId="uploadProducts"
        >
          <Button
            label={this.$t('product_translation')}
            icon="upload"
            width="248px"
            disabled={this.isSubmitting}
          />
        </ImportFile>
        <ImportFile
          validateFile={this.onValidateTranslationAttributes}
          accept={UPLOAD_TRANSLATE.ACCEPTED}
          inputId="uploadAttributes"
        >
          <Button
            label={this.$t('product_attribute_translation')}
            icon="upload"
            width="248px"
            disabled={this.isSubmitting}
          />
        </ImportFile>
      </Styled.Actions>
    );
  }

  renderContent(): JSX.Element {
    if (this.isLoading) {
      return <SpinLoading />;
    }
    if (!this.hasData) {
      return (
        <EmptyFile
          downloadProductTemplates={this.downloadProductTemplates}
          downloadAttributesTemplates={this.downloadAttributesTemplates}
        />
      );
    }
    return (
      <Styled.FileList>
        <TranslationFiles
          title={this.$t('product_translation')}
          files={this.latestProductTranslationFile}
          download={(fileId: string) => this.onDownload(fileId, true)}
          delete={this.onDeleteProductFile}
        />
        <TranslationFiles
          title={this.$t('product_attribute_translation')}
          files={this.latestAttributeTranslationFile}
          download={(fileId: string) => this.onDownload(fileId)}
          delete={this.onDeleteAttributeFile}
        />
      </Styled.FileList>
    );
  }

  render(): JSX.Element {
    return (
      <SupplierLayout>
        <Styled.Container>
          {this.renderHeader()}
          <Styled.Wrapper>
            {this.renderActions()}
            {this.renderContent()}
          </Styled.Wrapper>
        </Styled.Container>
      </SupplierLayout>
    );
  }
}
