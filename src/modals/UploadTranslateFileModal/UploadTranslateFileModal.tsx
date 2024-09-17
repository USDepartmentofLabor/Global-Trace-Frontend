import { Component, Vue, Prop } from 'vue-property-decorator';
import { get, isEmpty } from 'lodash';
import productTranslationsModule from 'store/modules/product-translations';
import { handleError } from 'components/Toast';
import { RESOURCES, UPLOAD_TRANSLATE } from 'config/constants';
import { formatSize } from 'utils/helpers';
import ImportFile from 'components/ImportFile';
import Button from 'components/FormUI/Button';
import SupplierLayout from 'components/Layout/SupplierLayout';
import { getShortToken } from 'api/auth';
import {
  downloadTranslationAttributesTemplate,
  downloadTranslationProductsTemplate,
} from 'utils/download-helper';
import {
  updateTranslationAttributes,
  updateTranslationProducts,
} from 'api/product-translation';
import { UploadType } from 'enums/app';
import * as Styled from './styled';

const ValidationModal = () => import('modals/ValidationModal');

@Component
export default class UploadTranslateFileModal extends Vue {
  @Prop({
    default: () => {
      //
    },
  })
  onSuccess: () => void;

  private isSubmitting: boolean = false;
  private productTranslateFiles: App.SelectedFile[] = [];
  private attributeTranslateFiles: App.SelectedFile[] = [];

  get hasData(): boolean {
    return !isEmpty(this.uploadedFiles);
  }

  get isDisabledSubmit(): boolean {
    return this.isSubmitting || !this.hasData;
  }

  get uploadedFiles(): App.SelectedFile[] {
    return this.productTranslateFiles.concat(this.attributeTranslateFiles);
  }

  get validationProductErrors(): Files.ValidationError[] {
    return get(
      productTranslationsModule.uploadedProductsResponse,
      'validationErrors',
      [],
    );
  }

  get numberProductErrors(): number {
    return this.validationProductErrors.length;
  }

  get validationAttributeErrors(): Files.ValidationError[] {
    return get(
      productTranslationsModule.uploadedAttributesResponse,
      'validationErrors',
      [],
    );
  }

  get numberAttributeErrors(): number {
    return this.validationAttributeErrors.length;
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

  onValidateTranslationProducts(file: App.SelectedFile): Promise<void> {
    return new Promise((resolve, reject) => {
      productTranslationsModule.uploadProductsFile({
        data: { file },
        callback: {
          onSuccess: () => {
            if (this.numberProductErrors > 0) {
              this.showValidationModal(UploadType.PRODUCT);
            } else {
              this.productTranslateFiles = [file];
            }
            resolve();
          },
          onFailure: (error: App.ResponseError) => {
            handleError(error);
            reject();
          },
        },
      });
    });
  }

  onValidateTranslationAttributes(file: App.SelectedFile): Promise<void> {
    return new Promise((resolve, reject) => {
      productTranslationsModule.uploadAttributesFile({
        data: { file },
        callback: {
          onSuccess: () => {
            if (this.numberAttributeErrors > 0) {
              this.showValidationModal(UploadType.ATTRIBUTE);
            } else {
              this.attributeTranslateFiles = [file];
            }
            resolve();
          },
          onFailure: (error: App.ResponseError) => {
            handleError(error);
            reject();
          },
        },
      });
    });
  }

  async onSubmit(): Promise<void> {
    try {
      const fileProductsId = get(
        productTranslationsModule.uploadedProductsResponse,
        'file.id',
        '',
      );
      const fileAttributesId = get(
        productTranslationsModule.uploadedAttributesResponse,
        'file.id',
        '',
      );
      this.isSubmitting = true;

      if (fileProductsId) {
        await updateTranslationProducts(fileProductsId);
      }

      if (fileAttributesId) {
        await updateTranslationAttributes(fileAttributesId);
      }

      productTranslationsModule.resetFileUpload();
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
          />
        </ImportFile>
      </Styled.Actions>
    );
  }

  renderEmpty(): JSX.Element {
    return (
      <Styled.Empty>
        <Styled.EmptyImage />
        <Styled.EmptyText>
          {this.$t('upload_product_translations_file_empty_message')}
        </Styled.EmptyText>
        <Styled.Actions>
          <Button
            label={this.$t('product_translation')}
            icon="download"
            variant="outlinePrimary"
            width="248px"
            click={this.downloadProductTemplates}
          />
          <Button
            label={this.$t('product_attribute_translation')}
            icon="download"
            variant="outlinePrimary"
            width="248px"
            click={this.downloadAttributesTemplates}
          />
        </Styled.Actions>
      </Styled.Empty>
    );
  }

  renderContent(): JSX.Element {
    if (!this.hasData) {
      return this.renderEmpty();
    }
    return (
      <Styled.FileList>
        {this.uploadedFiles.map((file) => (
          <Styled.FileItem>
            <Styled.Icon src={RESOURCES.ICON_JSON_FILE} />
            <Styled.FileInfo>
              <span>{file.name}</span>
              <span>{formatSize(file.size)}</span>
            </Styled.FileInfo>
          </Styled.FileItem>
        ))}
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
