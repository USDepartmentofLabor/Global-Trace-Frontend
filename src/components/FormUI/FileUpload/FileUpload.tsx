import { Vue, Component, Prop } from 'vue-property-decorator';
import VueUploadComponent from 'vue-upload-component';
import Button from 'components/FormUI/Button';
import { validateFile, isImageExtension } from 'utils/helpers';
import { UPLOAD_FILE } from 'config/constants';
import * as Styled from './styled';

@Component
export default class FileUpload extends Vue {
  @Prop({
    default: 'primary',
    validator(this, value) {
      return ['primary', 'secondary'].includes(value);
    },
  })
  readonly variant: string;
  @Prop({ default: false }) disabled: boolean;
  @Prop({ default: true }) multiple: boolean;
  @Prop({ default: null }) label: string;
  @Prop({ type: Object, default: () => UPLOAD_FILE })
  uploadConfig: App.UploadFileConfigType;
  @Prop({ default: 'uploadFile' }) inputId: string;
  @Prop({
    type: Function,
    default: () => {
      //
    },
  })
  changeFiles: (selectedFiles: App.SelectedFile[]) => void;

  private selectedFiles: App.SelectedFile[] = [];

  get isSelectedFile(): boolean {
    return this.selectedFiles.length > 0;
  }

  get selectFileIconName(): string {
    return this.isSelectedFile ? 'plus' : 'cloud_upload';
  }

  get selectFileIconColor(): string {
    return this.isSelectedFile ? 'sandyBrown' : 'envy';
  }

  get selectFileIconSize(): string {
    return this.isSelectedFile ? '14' : '32';
  }

  handleChangeFiles(selectedFiles: App.SelectedFile[]): void {
    selectedFiles.forEach((selectedFile) => {
      const { isErrorVolume, isErrorFormat } = validateFile(
        selectedFile.file,
        this.uploadConfig,
      );
      selectedFile.isError = isErrorVolume || isErrorFormat;
      if (isErrorVolume) {
        selectedFile.message = this.$t('file_size_error_message');
      } else if (isErrorFormat) {
        selectedFile.message = this.$t('file_format_error_message');
      }
    });
    this.selectedFiles = selectedFiles;
    this.changeFiles(this.selectedFiles);
  }

  removeFile(index: number) {
    this.selectedFiles.splice(index, 1);
    this.changeFiles(this.selectedFiles);
  }

  reset() {
    this.selectedFiles = [];
    this.changeFiles([]);
  }

  getFileIcon(fileType: string): string {
    return isImageExtension(fileType) ? 'photo' : 'document';
  }

  renderSelectedFiles(): JSX.Element {
    if (this.isSelectedFile) {
      return (
        <Styled.FileList variant={this.variant}>
          {this.selectedFiles.map((selectedFile, index) => {
            const { isError, message, file } = selectedFile;
            return (
              <Styled.FileBox>
                <Styled.FileItem isError={isError} variant={this.variant}>
                  <font-icon
                    name={this.getFileIcon(file.type)}
                    color="envy"
                    size="18"
                  />
                  <Styled.FileName>{file.name}</Styled.FileName>
                  <Styled.ButtonRemove vOn:click={() => this.removeFile(index)}>
                    <font-icon name="remove" color="ghost" size="14" />
                  </Styled.ButtonRemove>
                </Styled.FileItem>
                {isError && <Styled.Error>{message}</Styled.Error>}
              </Styled.FileBox>
            );
          })}
          {this.isSelectedFile && this.multiple && (
            <Styled.Action>
              <Button
                label={this.$t('remove_all')}
                type="button"
                icon="delete_forever"
                variant="transparentPrimary"
                click={this.reset}
              />
            </Styled.Action>
          )}
        </Styled.FileList>
      );
    }
    return null;
  }

  renderFileUpload(): JSX.Element {
    return (
      <Styled.Container
        variant={this.variant}
        disabled={this.disabled}
        isSelectedFile={this.isSelectedFile}
        multiple={this.multiple}
      >
        <VueUploadComponent
          vModel={this.selectedFiles}
          accept={this.uploadConfig.ACCEPTED}
          size={this.uploadConfig.MAX_SIZE}
          multiple={this.multiple}
          drop
          input-id={this.inputId}
          vOn:input={this.handleChangeFiles}
        >
          <font-icon
            name={this.selectFileIconName}
            color={this.selectFileIconColor}
            size={this.selectFileIconSize}
          />
          <Styled.Label variant={this.variant}>
            {this.isSelectedFile
              ? this.$t('common.action.upload_another')
              : this.label}
          </Styled.Label>
        </VueUploadComponent>
      </Styled.Container>
    );
  }

  render(): JSX.Element {
    return (
      <fragment>
        {this.renderSelectedFiles()}
        {this.renderFileUpload()}
      </fragment>
    );
  }
}
