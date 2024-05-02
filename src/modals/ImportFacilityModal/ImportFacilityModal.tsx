import { Vue, Component, Prop, Ref } from 'vue-property-decorator';
import facilityManagementModule from 'store/modules/facility-management';
import ImportValidation from 'components/ImportFile/ImportValidation';
import { handleError } from 'components/Toast';
import * as Styled from './styled';

@Component
export default class ImportFacilityModal extends Vue {
  @Prop({
    default: () => {
      //
    },
  })
  validateFile: (file: App.SelectedFile) => Promise<void>;
  @Prop({
    default: () => {
      //
    },
  })
  validatedFile: (file: App.SelectedFile) => void;
  @Prop({
    default: () => {
      //
    },
  })
  import: () => Promise<void>;
  @Ref('modal') readonly modalRef!: Vue;

  private isLoading: boolean = false;

  async onImportFacility(): Promise<void> {
    try {
      this.isLoading = true;
      if (this.import) {
        this.import();
      } else {
        this.$toast.success(this.$t('file_successfully_uploaded'));
      }
    } catch (error) {
      handleError(error as App.ResponseError);
    } finally {
      this.isLoading = false;
      this.closeModal();
    }
  }

  onResetUpload(): void {
    facilityManagementModule.resetFileUpload();
    this.closeModal();
  }

  closeModal(): void {
    this.$emit('close');
  }

  render(): JSX.Element {
    return (
      <modal-layout showCloseIcon={false} title="" ref="modal">
        <Styled.Wrapper>
          <ImportValidation
            response={facilityManagementModule.uploadedResponse}
            fileName={facilityManagementModule.uploadedFile.name}
            validateFile={this.validateFile}
            validatedFile={this.validatedFile}
            uploadFile={this.onImportFacility}
            resetUpload={this.onResetUpload}
            addFile={this.closeModal}
            isLoading={this.isLoading}
            labelUpload="upload_validated_records"
            isMultipleSheets
          />
        </Styled.Wrapper>
      </modal-layout>
    );
  }
}
