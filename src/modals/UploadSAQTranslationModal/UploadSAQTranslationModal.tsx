import { Component, Prop, Vue } from 'vue-property-decorator';
import { isEmpty } from 'lodash';
import { handleError } from 'components/Toast';
import { UPLOAD_TRANSLATE } from 'config/constants';
import ImportFile from 'components/ImportFile';
import Button from 'components/FormUI/Button';
import SupplierLayout from 'components/Layout/SupplierLayout';
import { getShortToken } from 'api/auth';
import { downloadSAQTranslationTemplate } from 'utils/download-helper';
import { uploadSAQTranslation } from 'api/saq';
import * as Styled from './styled';

const ValidationModal = () => import('modals/ValidationModal');

@Component
export default class UploadSAQTranslationModal extends Vue {
  @Prop({ required: true }) readonly roleId: string;
  @Prop({ required: true }) readonly roleName: string;

  @Prop({
    default: () => {
      //
    },
  })
  onSuccess: () => void;

  private isSubmitting: boolean = false;
  private validationErrors: Files.ValidationError[] = [];
  get hasErrors(): boolean {
    return !isEmpty(this.validationErrors);
  }

  get numberErrors(): number {
    return this.validationErrors.length;
  }

  closeModal(): void {
    this.$emit('close');
  }

  async downloadTemplate(): Promise<void> {
    try {
      const response = await getShortToken();
      const downloadProductsUrl = downloadSAQTranslationTemplate(
        response.shortToken,
        this.roleId,
      );
      window.open(downloadProductsUrl, '_blank');
    } catch (error) {
      handleError(error as App.ResponseError);
    }
  }

  async onSubmit(file: App.SelectedFile): Promise<void> {
    try {
      this.isSubmitting = true;
      const params: SAQ.TranslationParams = {
        file,
        roleId: this.roleId,
      };
      const { validationErrors } = await uploadSAQTranslation(params);
      this.validationErrors = validationErrors;
      if (this.numberErrors > 0) {
        this.showValidationModal();
      } else {
        this.closeModal();
        this.onSuccess();
        this.$toast.success(
          this.$t('upload_translations_file_success_message'),
        );
      }
    } catch (error) {
      handleError(error as App.ResponseError);
    } finally {
      this.isSubmitting = false;
    }
  }

  showValidationModal(): void {
    this.$modal.show(
      ValidationModal,
      {
        validationErrors: this.validationErrors,
        numberErrors: this.numberErrors,
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
          {this.$t('role_saq_translation', {
            roleName: this.roleName,
          })}
        </Styled.Back>
      </Styled.Top>
    );
  }

  renderActions(): JSX.Element {
    return (
      <Styled.Actions>
        <Button
          label={this.$t('download_template')}
          icon="download"
          width="100%"
          variant="outlinePrimary"
          click={this.downloadTemplate}
        />
        <ImportFile
          accept={UPLOAD_TRANSLATE.ACCEPTED}
          inputId="uploadSAQTranslation"
          validateFile={this.onSubmit}
        >
          <Button
            label={this.$t('upload_translation_file')}
            icon="export"
            width="100%"
            isLoading={this.isSubmitting}
            disabled={this.isSubmitting}
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
          {this.$t('upload_saq_translation_file_empty_message')}
        </Styled.EmptyText>
      </Styled.Empty>
    );
  }

  render(): JSX.Element {
    return (
      <SupplierLayout>
        <Styled.Container>
          {this.renderHeader()}
          <Styled.Wrapper>
            {this.renderActions()}
            {this.renderEmpty()}
          </Styled.Wrapper>
        </Styled.Container>
      </SupplierLayout>
    );
  }
}
