import { Vue, Component, Prop } from 'vue-property-decorator';
import { head, isEmpty } from 'lodash';
import VueUploadComponent from 'vue-upload-component';
import { validateFile } from 'utils/helpers';
import { UPLOAD_LOGO } from 'config/constants';
import * as Styled from './styled';

@Component
export default class UploadLogo extends Vue {
  @Prop({ default: false }) disabled: boolean;
  @Prop({ default: '' }) logoUrl: string;
  @Prop({ default: 'uploadFile' }) inputId: string;
  @Prop({ default: '' }) labelUpload: string;
  @Prop({
    type: Function,
    default: () => {
      //
    },
  })
  changeFile: (selectedFile: App.SelectedFile) => void;

  private image: string = null;
  private selectedFiles: App.SelectedFile[] = [];

  get hasSelectedFile(): boolean {
    return this.selectedFiles.length > 0 || !isEmpty(this.logoUrl);
  }

  get hasLogo(): boolean {
    return !isEmpty(this.logoUrl);
  }

  created(): void {
    if (this.hasLogo) {
      this.image = this.logoUrl;
    }
  }

  handleChangeFiles(selectedFiles: App.SelectedFile[]): void {
    if (selectedFiles.length > 0) {
      const selectedFile = head(selectedFiles);
      const { isErrorVolume, isErrorFormat } = validateFile(
        selectedFile.file,
        UPLOAD_LOGO,
      );
      selectedFile.isError = isErrorVolume || isErrorFormat;
      if (isErrorVolume) {
        selectedFile.message = this.$t('file_size_error_message');
      } else if (isErrorFormat) {
        selectedFile.message = this.$t('file_format_error_message');
      }
      this.selectedFiles = selectedFiles;
      this.changeFile(selectedFile);
      const { file } = selectedFile;
      this.image = URL.createObjectURL(file);
    }
  }

  renderUpload(): JSX.Element {
    if (this.hasSelectedFile) {
      return <Styled.PreviewImage img={this.image} />;
    }
    return (
      <Styled.UploadContainer>
        <font-icon name="upload" color="ghost" size="98" />
        <Styled.UploadLabel>
          {this.$t('brandOnboardPage.upload_logo')}
        </Styled.UploadLabel>
      </Styled.UploadContainer>
    );
  }

  renderAction(): JSX.Element {
    return (
      <Styled.Action>
        {this.labelUpload || this.$t('brandOnboardPage.upload_logo')}
      </Styled.Action>
    );
  }

  renderError(): JSX.Element {
    const { isError, message } = head(this.selectedFiles);
    return isError && <Styled.Error>{message}</Styled.Error>;
  }

  render(): JSX.Element {
    return (
      <Styled.Wrapper>
        <Styled.Label>{this.$t('brandOnboardPage.logo')}</Styled.Label>
        <Styled.Container disabled={this.disabled} hasLogo={this.hasLogo}>
          {this.hasLogo && (
            <Styled.EditContainer>
              <Styled.PreviewImage img={this.image} />
            </Styled.EditContainer>
          )}
          <VueUploadComponent
            vModel={this.selectedFiles}
            accept={UPLOAD_LOGO.ACCEPTED}
            drop
            input-id={this.inputId}
            vOn:input={this.handleChangeFiles}
          >
            {this.hasLogo && this.renderAction()}
            {!this.hasLogo && this.renderUpload()}
          </VueUploadComponent>
        </Styled.Container>
        {this.selectedFiles.length > 0 && this.renderError()}
      </Styled.Wrapper>
    );
  }
}
