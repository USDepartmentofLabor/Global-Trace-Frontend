import { Component, Prop, Vue } from 'vue-property-decorator';
import { get, isEmpty } from 'lodash';
import { UPLOAD_EXCEL_FILE } from 'config/constants';
import { handleError } from 'components/Toast';
import taxonomyExploitationModule from 'store/modules/taxonomy-exploitation';
import ImportFile from 'components/ImportFile';
import Button from 'components/FormUI/Button';
import SupplierLayout from 'components/Layout/SupplierLayout';
import { getShortToken } from 'api/auth';
import { importTaxonomyExploitations } from 'api/taxonomy-exploitation';
import { ImportActionEnum } from 'enums/taxonomy-exploitation';
import { downloadTaxonomyExploitationTemplate } from 'utils/download-helper';
import * as Styled from './styled';

const ValidationModal = () => import('modals/ValidationModal');
const ImportTaxonomyExploitationModal = () =>
  import('modals/ImportTaxonomyExploitationModal');
const ImportConfirmModal = () => import('modals/ImportConfirmModal');

@Component
export default class UploadTaxonomyModal extends Vue {
  @Prop({
    required: true,
  })
  isEmptyData: boolean;
  @Prop({
    default: () => {
      //
    },
  })
  onSuccess: () => void;

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

  async downloadTemplate(): Promise<void> {
    try {
      const response = await getShortToken();
      const downloadProductsUrl = downloadTaxonomyExploitationTemplate(
        response.shortToken,
      );
      window.open(downloadProductsUrl, '_blank');
    } catch (error) {
      handleError(error as App.ResponseError);
    }
  }

  openImportConfirmModal(): void {
    if (this.isEmptyData) {
      this.onImportTaxonomyExploitation(ImportActionEnum.ADD);
    } else {
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

  renderHeader(): JSX.Element {
    return (
      <Styled.Top>
        <Styled.Back onClick={this.closeModal}>
          <font-icon name="arrow_left" color="black" size="20" />
          {this.$t('define_indicator_list')}
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
          width="248px"
          variant="outlinePrimary"
          click={this.downloadTemplate}
        />
        <ImportFile
          accept={UPLOAD_EXCEL_FILE.EXTENSIONS}
          validateFile={this.onValidateTaxonomy}
          validatedFile={this.showImportTaxonomyExploitationModal}
        >
          <Button
            icon="export"
            width="100%"
            type="submit"
            variant="primary"
            label={this.$t('define_indicator_list')}
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
          {this.$t('define_new_indicator_upload_message')}
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
