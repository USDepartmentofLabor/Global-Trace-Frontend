import { Vue, Component, Prop, Ref } from 'vue-property-decorator';
import VueUploadComponent from 'vue-upload-component';
import * as Styled from './styled';

const ActionModal = () => import('modals/ActionModal');

@Component
export default class ImportFile extends Vue {
  @Ref('uploadComponent')
  readonly uploadComponentRef!: Vue;

  @Prop({ default: '.csv,.xlsx' }) readonly accept: string;
  @Prop({ default: false }) readonly isMultipleSheets: boolean;
  @Prop({
    default: 'small',
    validator(this, value) {
      return ['small', 'medium'].includes(value);
    },
  })
  readonly size: string;
  @Prop({ default: 'uploadFile' }) inputId: string;
  @Prop({
    default: () => {
      //
    },
  })
  validateFile: (file: App.SelectedFile) => Promise<Files.UploadedFileResponse>;
  @Prop({
    default: () => {
      //
    },
  })
  validatedFile: (data: Files.UploadedFileResponse) => void;
  @Prop({
    default: () => {
      //
    },
  })
  addFile: (file: App.SelectedFile) => void;

  handleAddFile(newFile: App.SelectedFile, oldFile: App.SelectedFile): void {
    if (newFile && !oldFile) {
      this.handleUploadFile(newFile);
      if (this.addFile) {
        this.addFile(newFile);
      }
    }
  }

  handleUploadFile(file: App.SelectedFile): void {
    this.openProcessingModal();
    this.validateFile(file)
      .then(this.validatedFile)
      .finally(() => {
        this.$modal.hide('actionModal');
      });
  }

  openProcessingModal(): void {
    this.$modal.show(
      ActionModal,
      {
        icon: 'processing',
        iconSize: '53',
        title: this.$t('processing_upload'),
      },
      {
        name: 'actionModal',
        width: '322px',
        height: '144px',
        clickToClose: false,
      },
    );
  }

  render(): JSX.Element {
    return (
      <Styled.Wrapper>
        <VueUploadComponent
          ref="uploadComponent"
          accept={this.accept}
          input-id={this.inputId}
          vOn:input-file={this.handleAddFile}
        >
          {this.$slots.default}
        </VueUploadComponent>
      </Styled.Wrapper>
    );
  }
}
