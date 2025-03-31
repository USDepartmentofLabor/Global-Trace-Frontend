/* eslint-disable max-lines */
import { Component, Vue, Prop, Ref } from 'vue-property-decorator';
import { filter, get, isEmpty } from 'lodash';
import { handleError } from 'components/Toast';
import {
  RESOURCES,
  UPLOAD_EXCEL_FILE,
  UPLOAD_TRANSLATE,
} from 'config/constants';
import ImportFile from 'components/ImportFile';
import taxonomyExploitationModule from 'store/modules/taxonomy-exploitation';
import Button from 'components/FormUI/Button';
import SupplierLayout from 'components/Layout/SupplierLayout';
import { getShortToken } from 'api/auth';
import {
  ImportActionEnum,
  TaxonomyExploitationFileEnum,
  TemplateActionEnum,
} from 'enums/taxonomy-exploitation';
import {
  getLatestTaxonomyExploitations,
  importTaxonomyExploitations,
  uploadTaxonomyTranslationTemplate,
  deleteIndicatorsFile,
} from 'api/taxonomy-exploitation';
import {
  downloadTaxonomyExploitationFile,
  downloadTaxonomyExploitationTemplate,
  downloadTaxonomyTranslationTemplate,
} from 'utils/download-helper';
import { SpinLoading } from 'components/Loaders';
import TranslationFiles from 'components/TranslationFiles';
import * as Styled from './styled';

const ValidationModal = () => import('modals/ValidationModal');
const ImportTaxonomyExploitationModal = () =>
  import('modals/ImportTaxonomyExploitationModal');
const ImportConfirmModal = () => import('modals/ImportConfirmModal');

@Component
export default class ManageIndicatorListModal extends Vue {
  @Prop({
    default: () => {
      //
    },
  })
  onSuccess: () => void;

  @Ref('importFile')
  readonly importFileRef!: ImportFile;
  @Ref('importTranslation')
  readonly importTranslationRef!: ImportFile;

  private isLoading = true;
  private isDeleting = false;
  private taxonomyExploitationsFiles: TaxonomyManagement.TaxonomyExploitationFile[] =
    [];

  get hasData(): boolean {
    return !isEmpty(this.taxonomyExploitationsFiles);
  }

  get translationsFiles(): TaxonomyManagement.TaxonomyExploitationFile[] {
    return filter(
      this.taxonomyExploitationsFiles,
      ({ type }) => type === TaxonomyExploitationFileEnum.TAXONOMY_TRANSLATE,
    );
  }

  get indicatorListFiles(): TaxonomyManagement.TaxonomyExploitationFile[] {
    return filter(
      this.taxonomyExploitationsFiles,
      ({ type }) => type === TaxonomyExploitationFileEnum.INDICATOR_LIST,
    );
  }

  created() {
    this.getIndicatorListLatest();
  }

  async onDeleteFile(file: App.SelectedFile): Promise<void> {
    if (!this.isDeleting) {
      try {
        this.isDeleting = true;
        await deleteIndicatorsFile(file.id);
        this.getIndicatorListLatest();
      } catch (error) {
        handleError(error as App.ResponseError);
      } finally {
        this.isDeleting = false;
      }
    }
  }

  async getIndicatorListLatest(): Promise<void> {
    try {
      this.isLoading = true;
      this.taxonomyExploitationsFiles = await getLatestTaxonomyExploitations();
    } catch (error) {
      handleError(error as App.ResponseError);
    } finally {
      this.isLoading = false;
    }
  }

  closeModal(): void {
    this.$emit('close');
  }

  async downloadTemplate(): Promise<void> {
    try {
      const response = await getShortToken();
      const downloadUrl = downloadTaxonomyExploitationTemplate(
        response.shortToken,
      );
      window.open(downloadUrl, '_blank');
    } catch (error) {
      handleError(error as App.ResponseError);
    }
  }

  async downloadTranslation(): Promise<void> {
    try {
      const response = await getShortToken();
      const downloadUrl = downloadTaxonomyTranslationTemplate(
        response.shortToken,
      );
      window.open(downloadUrl, '_blank');
    } catch (error) {
      handleError(error as App.ResponseError);
    }
  }

  async downloadFile(id: string): Promise<void> {
    try {
      const response = await getShortToken();
      const downloadUrl = downloadTaxonomyExploitationFile(
        id,
        response.shortToken,
      );
      window.open(downloadUrl, '_blank');
    } catch (error) {
      handleError(error as App.ResponseError);
    }
  }

  selectUploadAction(action: TemplateActionEnum): void {
    let ref: App.Any = null;
    switch (action as TemplateActionEnum) {
      case TemplateActionEnum.INDICATOR_LIST:
        ref = this.importFileRef.uploadComponentRef;
        break;
      case TemplateActionEnum.TRANSLATION_FILE:
        ref = this.importTranslationRef.uploadComponentRef;
        break;
    }
    ref.$children[0].$el.click();
  }

  onValidateTaxonomy(
    file: App.SelectedFile,
  ): Promise<Files.UploadedFileResponse> {
    return new Promise((resolve, reject) => {
      taxonomyExploitationModule.uploadFile({
        data: { file },
        callback: {
          onSuccess: (response: Files.UploadedFileResponse) => {
            resolve(response);
          },
          onFailure: (error: App.ResponseError) => {
            handleError(error);
            reject();
          },
        },
      });
    });
  }

  showImportTaxonomyExploitationModal(data: Files.UploadedFileResponse): void {
    if (data && data.validatedItemCount < data.totalItems) {
      this.$modal.show(
        ImportTaxonomyExploitationModal,
        {
          validateFile: this.onValidateTaxonomy,
          validatedFile: this.showImportTaxonomyExploitationModal,
          importTaxonomyExploitation: this.openImportConfirmModal,
        },
        {
          name: 'ImportTaxonomyExploitationModal',
          width: '380px',
          height: 'auto',
          clickToClose: false,
          classes: 'modal-center',
        },
      );
    } else {
      this.openImportConfirmModal();
    }
  }

  openImportConfirmModal(): void {
    this.$modal.show(
      ImportConfirmModal,
      {
        icon: 'file_check',
        iconSize: '44',
        message: this.$t('import_file_confirmation_message'),
        note: this.$t('this_action_cannot_be_undone'),
        onImport: this.onImportTaxonomyExploitation,
      },
      { width: '374px', height: 'auto', clickToClose: false },
    );
  }

  async onImportTaxonomyExploitation(action: ImportActionEnum): Promise<void> {
    try {
      const fileId = get(
        taxonomyExploitationModule.uploadedResponse,
        'fileId',
        '',
      );
      const params: TaxonomyManagement.ImportParams = {
        action,
      };
      const { validationErrors } = await importTaxonomyExploitations(
        fileId,
        params,
      );
      if (!isEmpty(validationErrors)) {
        this.showValidationModal(validationErrors);
      } else {
        this.$toast.success(this.$t('successfully_updated_indicator_list'));
        this.$modal.hide('ImportConfirmModal');
      }
      taxonomyExploitationModule.resetFileUpload();
      this.getIndicatorListLatest();
      this.onSuccess();
    } catch (error) {
      handleError(error as App.ResponseError);
    }
  }

  showValidationModal(validationErrors: Files.ValidationError[]): void {
    this.$modal.show(
      ValidationModal,
      {
        validationErrors,
        numberErrors: validationErrors.length,
      },
      {
        width: '459px',
        height: 'auto',
        clickToClose: false,
      },
    );
  }

  async onValidateTranslation(file: App.SelectedFile): Promise<void> {
    try {
      const { validationErrors } = await uploadTaxonomyTranslationTemplate({
        file,
      });
      if (validationErrors.length > 0) {
        this.showValidationModal(validationErrors);
      } else {
        this.getIndicatorListLatest();
        this.onSuccess();
        this.$toast.success(this.$t('successfully_uploaded_file'));
      }
    } catch (error) {
      handleError(error as App.ResponseError);
    }
  }

  renderHeader(): JSX.Element {
    return (
      <Styled.Top>
        <Styled.Back onClick={this.closeModal}>
          <font-icon name="arrow_left" color="black" size="20" />
          {this.$t('manage_indicator_list')}
        </Styled.Back>
      </Styled.Top>
    );
  }

  renderHeaderActions(): JSX.Element {
    return (
      <Styled.Actions isBordered isFullWidthStyles>
        <Button
          label={this.$t('indicator_list')}
          icon="upload"
          width="100%"
          click={() => {
            this.selectUploadAction(TemplateActionEnum.INDICATOR_LIST);
          }}
        />
        <Button
          label={this.$t('indicator_list_translation')}
          icon="upload"
          width="100%"
          disabled={!this.hasData}
          click={() => {
            this.selectUploadAction(TemplateActionEnum.TRANSLATION_FILE);
          }}
        />
      </Styled.Actions>
    );
  }

  renderFooterActions(): JSX.Element {
    return (
      <Styled.Actions isCenter>
        <Button
          label={this.$t('indicator_list')}
          icon="download"
          variant="outlinePrimary"
          click={this.downloadTemplate}
        />
        <Button
          label={this.$t('indicator_list_translation')}
          icon="download"
          variant="outlinePrimary"
          click={this.downloadTranslation}
        />
      </Styled.Actions>
    );
  }

  renderEmpty(): JSX.Element {
    return (
      <Styled.Empty>
        <Styled.EmptyImage />
        <Styled.TextGroup>
          <Styled.EmptyTitle>
            {this.$t('no_indicator_list_files_title')}
          </Styled.EmptyTitle>
          <Styled.EmptyText>
            {this.$t('download_translation_template_and_upload_to_begin')}
          </Styled.EmptyText>
        </Styled.TextGroup>
        {this.renderFooterActions()}
      </Styled.Empty>
    );
  }

  renderAllFiles(): JSX.Element {
    if (!this.hasData) {
      return this.renderEmpty();
    }
    return (
      <Styled.FileContainer>
        <perfect-scrollbar>
          <TranslationFiles
            title={this.$t('indicator_list')}
            files={this.indicatorListFiles}
            fileIcon={RESOURCES.ICON_XLS_FILE}
            download={this.downloadFile}
            delete={this.onDeleteFile}
          />
          <TranslationFiles
            title={this.$t('translation_file')}
            files={this.translationsFiles}
            download={this.downloadFile}
            delete={this.onDeleteFile}
          />
        </perfect-scrollbar>
      </Styled.FileContainer>
    );
  }

  renderContent(): JSX.Element {
    if (this.isLoading) {
      return (
        <Styled.Empty>
          <SpinLoading />
        </Styled.Empty>
      );
    }
    return (
      <Styled.Container>
        {this.renderHeader()}
        <Styled.Wrapper>
          {this.renderHeaderActions()}
          {this.renderAllFiles()}
        </Styled.Wrapper>
      </Styled.Container>
    );
  }

  render(): JSX.Element {
    return (
      <SupplierLayout>
        {this.renderContent()}
        <Styled.HiddenInput>
          <ImportFile
            ref="importFile"
            accept={UPLOAD_EXCEL_FILE.EXTENSIONS}
            validateFile={this.onValidateTaxonomy}
            validatedFile={this.showImportTaxonomyExploitationModal}
          />
          <ImportFile
            ref="importTranslation"
            inputId="importTranslation"
            accept={UPLOAD_TRANSLATE.ACCEPTED}
            validateFile={this.onValidateTranslation}
          />
        </Styled.HiddenInput>
      </SupplierLayout>
    );
  }
}
