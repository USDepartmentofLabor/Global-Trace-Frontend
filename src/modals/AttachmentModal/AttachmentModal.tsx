import { Component, Vue, Prop } from 'vue-property-decorator';
import VueUploadComponent from 'vue-upload-component';
import { get, head, isEmpty } from 'lodash';
import { RESOURCES, UPLOAD_EXCEL_FILE } from 'config/constants';
import { formatSize } from 'utils/helpers';
import { TypeUpload } from 'enums/saq';
import saqModule from 'store/modules/saq';
import Button from 'components/FormUI/Button';
import SupplierLayout from 'components/Layout/SupplierLayout';
import { handleError } from 'components/Toast';
import { importSAQ } from 'api/saq';
import { downloadSAQTemplate } from 'utils/download-helper';
import { getShortToken } from 'api/auth';
import * as Styled from './styled';

const ValidationModal = () => import('modals/ValidationModal');

@Component
export default class AttachmentModal extends Vue {
  @Prop({ required: true }) readonly roleName: string;
  @Prop({ required: true }) readonly roleId: string;
  @Prop({ default: false }) readonly hasFacilityGroupTemplate: boolean;
  @Prop({ required: true }) onSuccess: () => void;

  private isSubmitting: boolean = false;
  private saqFile: App.SelectedFile[] = [];
  private facilityGroupTemplateFile: App.SelectedFile[] = [];
  private errors: Files.UploadedSAQResponse[] = [];

  get hasData(): boolean {
    return !isEmpty(this.uploadedFiles);
  }

  get isDisabledSubmit(): boolean {
    if (this.hasFacilityGroupTemplate) {
      const hasSaqFiles = this.saqFile.length > 0;
      const hasFacilityGroupTemplateFiles =
        this.facilityGroupTemplateFile.length > 0;
      return (
        this.isSubmitting || !(hasSaqFiles && hasFacilityGroupTemplateFiles)
      );
    }
    return this.isSubmitting || !this.hasData;
  }

  get uploadedFiles(): App.SelectedFile[] {
    return this.saqFile.concat(this.facilityGroupTemplateFile);
  }

  get title(): string {
    return this.errors[0].fileName;
  }

  get validationErrors(): Files.ValidationError[] {
    return get(this.errors[0].validation, 'validationErrors', []);
  }

  get numberErrors(): number {
    return this.validationErrors.length;
  }

  get numberFileErrors(): number {
    return saqModule.uploadedResponse.length;
  }

  get params(): SAQ.ImportParams {
    return {
      fileSaq: head(this.saqFile),
      fileFacilityGroupTemplate: head(this.facilityGroupTemplateFile),
      roleId: this.roleId,
    };
  }

  closeModal(): void {
    this.$emit('close');
  }

  async onValidateUpload(): Promise<void> {
    await saqModule.uploadSAQFile({
      data: this.params,
      callback: {
        onSuccess: () => {
          if (this.numberFileErrors > 0) {
            this.errors = saqModule.uploadedResponse;
            this.showErrors();
          } else {
            this.onSubmit();
          }
        },
        onFailure: (error: App.ResponseError) => {
          handleError(error);
        },
      },
    });
  }

  async downloadTemplate(): Promise<void> {
    try {
      const response = await getShortToken();
      const downloadProductsUrl = downloadSAQTemplate(
        response.shortToken,
        this.roleId,
      );
      window.open(downloadProductsUrl, '_blank');
    } catch (error) {
      handleError(error as App.ResponseError);
    }
  }

  showErrors() {
    if (this.errors.length > 0) {
      this.showValidationModal();
      this.errors.shift();
    }
    if (this.errors.length === 0) {
      this.$modal.hide('ValidationModal');
    }
  }

  async onSubmit(): Promise<void> {
    try {
      this.isSubmitting = true;
      await importSAQ(this.params);
      saqModule.resetFileUpload();
      this.$toast.success(this.$t('upload_saq_file_success_message'));
      this.closeModal();
      this.onSuccess();
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
        extension: UPLOAD_EXCEL_FILE.EXTENSIONS,
        title: this.errors[0].fileName,
        validationErrors: this.validationErrors,
        numberErrors: this.numberErrors,
        onCancel: this.showErrors,
      },
      {
        name: 'ValidationModal',
        width: '459px',
        height: 'auto',
        clickToClose: false,
      },
    );
  }

  removeFile(message: string) {
    if (message === TypeUpload.SAQ) {
      this.saqFile = [];
    } else if (message === TypeUpload.FACILITY) {
      this.facilityGroupTemplateFile = [];
    }
  }

  handleAddFile(message: TypeUpload) {
    head(this.facilityGroupTemplateFile).message = message;
  }

  handleAddSAQFile(message: TypeUpload) {
    head(this.saqFile).message = message;
  }

  renderHeader(): JSX.Element {
    return (
      <Styled.Top>
        <Styled.Back onClick={this.closeModal}>
          <font-icon name="arrow_left" color="black" size="20" />
          {this.$t('role_saq', {
            role: this.roleName,
          })}
        </Styled.Back>
        <Button
          width="100%"
          label={this.$t('common.action.submit')}
          variant="primary"
          isLoading={this.isSubmitting}
          disabled={this.isDisabledSubmit}
          click={this.onValidateUpload}
        />
      </Styled.Top>
    );
  }

  renderActions(): JSX.Element {
    return (
      <Styled.Actions>
        <VueUploadComponent
          vModel={this.saqFile}
          accept={UPLOAD_EXCEL_FILE.EXTENSIONS}
          inputId="uploadSAQ"
          vOn:input={() => this.handleAddSAQFile(TypeUpload.SAQ)}
        >
          <Button
            label={this.$t('define_new_saq')}
            icon="upload"
            width="248px"
          />
        </VueUploadComponent>
        {this.hasFacilityGroupTemplate && (
          <VueUploadComponent
            vModel={this.facilityGroupTemplateFile}
            accept={UPLOAD_EXCEL_FILE.EXTENSIONS}
            inputId="uploadFacility"
            vOn:input={() => this.handleAddFile(TypeUpload.FACILITY)}
          >
            <Button
              label={this.$t('define_facility_group')}
              icon="upload"
              width="248px"
            />
          </VueUploadComponent>
        )}
        {!this.hasFacilityGroupTemplate && (
          <Button
            label={this.$t('define_facility_group')}
            icon="upload"
            width="248px"
            disabled={!this.hasFacilityGroupTemplate}
          />
        )}
      </Styled.Actions>
    );
  }

  renderEmpty(): JSX.Element {
    return (
      <Styled.Empty>
        <Styled.EmptyImage />
        <Styled.EmptyText>
          {this.$t('attachment_empty_message')}
        </Styled.EmptyText>
        <Styled.Actions>
          <Button
            label={this.$t('download_template')}
            icon="download"
            variant="outlinePrimary"
            width="248px"
            click={this.downloadTemplate}
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
            <Styled.Icon src={RESOURCES.ICON_XLS_FILE} />
            <Styled.FileInfo>
              <span>{file.name}</span>
              <span>{formatSize(file.size)}</span>
            </Styled.FileInfo>
            <Styled.RemoveFile vOn:click={() => this.removeFile(file.message)}>
              <font-icon name="remove" color="ghost" size="14" />
            </Styled.RemoveFile>
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
