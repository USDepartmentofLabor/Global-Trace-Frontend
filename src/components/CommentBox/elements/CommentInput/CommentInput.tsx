/* eslint-disable max-lines-per-function */
import { get, isEmpty } from 'lodash';
import { Vue, Component, Prop, Ref } from 'vue-property-decorator';
import VueUploadComponent from 'vue-upload-component';
import { ENTER_KEY, ESC_KEY, UPLOAD_FILE } from 'config/constants';
import { validateFile } from 'utils/helpers';
import { getUserInfo } from 'utils/cookie';
import { getUserAvatarByName } from 'utils/user';
import Input from 'components/FormUI/Input';
import { InputType } from 'enums/app';
import Button from 'components/FormUI/Button';
import * as Styled from './styled';

@Component
export default class CommentInput extends Vue {
  @Prop({ default: '' }) value: string;
  @Prop({ default: [] }) blobFiles: App.FileResponse[];
  @Prop({ required: true }) inputId: string;
  @Prop({ type: Object, default: () => UPLOAD_FILE })
  uploadConfig: App.UploadFileConfigType;
  @Prop({
    type: Function,
    default: () => {
      //
    },
  })
  removeBlobName: (name: string) => void;
  @Prop({
    type: Function,
    default: () => {
      //
    },
  })
  changeFiles: (selectedFiles: App.SelectedFile[]) => void;
  @Prop({
    type: Function,
    default: () => {
      //
    },
  })
  exit: () => void;
  @Prop({
    type: Function,
    default: () => {
      //
    },
  })
  submit: (
    message: string,
    selectedFiles: App.SelectedFile[],
    callback: () => void,
  ) => void;

  @Ref('commentInput')
  readonly commentInputComponent!: Vue;

  private selectedFiles: App.SelectedFile[] = [];
  private comment = '';
  private oldComment = '';
  private isSending = false;

  get isSelectedFile(): boolean {
    return !isEmpty(this.selectedFiles);
  }

  get isEdit(): boolean {
    return !isEmpty(this.value);
  }

  get userInfo(): Auth.User {
    return getUserInfo();
  }

  get avatarChar(): string {
    const firstName = get(this.userInfo, 'firstName', '');
    const lastName = get(this.userInfo, 'lastName', '');
    return getUserAvatarByName(firstName, lastName);
  }

  get isDisable(): boolean {
    return (
      this.isSending || (isEmpty(this.comment) && isEmpty(this.selectedFiles))
    );
  }

  created() {
    this.comment = this.value;
    this.oldComment = this.value;
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
  }

  removeFile(index: number) {
    if (!this.isSending) {
      this.selectedFiles.splice(index, 1);
      this.changeFiles(this.selectedFiles);
    }
  }

  removeBlobFile(name: string) {
    const index = this.blobFiles.findIndex(({ blobName }) => blobName === name);
    if (index > -1) {
      this.removeBlobName(name);
    }
  }

  handleKeyDown(event: KeyboardEvent): void {
    switch (event.key) {
      case ENTER_KEY:
        if (!event.shiftKey) {
          this.send();
          event.preventDefault();
        }
        break;
      case ESC_KEY:
        this.revertComment();
        break;
      default:
        break;
    }
  }

  revertComment() {
    this.comment = this.oldComment;
    this.exit();
  }

  send(): void {
    if (
      (!isEmpty(this.comment) || !isEmpty(this.selectedFiles)) &&
      !this.isSending
    ) {
      this.isSending = true;
      this.submit(this.comment, this.selectedFiles, () => {
        this.isSending = false;
        this.reset();
      });
    }
  }

  reset() {
    this.comment = '';
    this.selectedFiles = [];
  }

  mounted() {
    if (this.isEdit) {
      const input = this.commentInputComponent.$el.querySelector('input');
      input.focus();
    }
  }

  renderBlobFiles(): JSX.Element {
    if (!isEmpty(this.blobFiles)) {
      return (
        <Styled.SelectedFiles>
          {this.blobFiles.map((file) => {
            const { fileName, blobName } = file;
            return (
              <Styled.FileBox>
                <font-icon name="attach_file" color="highland" size="20" />
                <Styled.FileName>{fileName}</Styled.FileName>
                <Styled.ButtonRemove
                  vOn:click={() => this.removeBlobFile(blobName)}
                >
                  <font-icon name="remove" color="ghost" size="20" />
                </Styled.ButtonRemove>
              </Styled.FileBox>
            );
          })}
        </Styled.SelectedFiles>
      );
    }
  }

  renderSelectedFiles(): JSX.Element {
    if (this.isSelectedFile) {
      return (
        <Styled.SelectedFiles>
          {this.selectedFiles.map((selectedFile, index) => {
            const { file } = selectedFile;
            return (
              <Styled.FileBox>
                <font-icon name="attach_file" color="highland" size="20" />
                <Styled.FileName>{file.name}</Styled.FileName>
                <Styled.ButtonRemove vOn:click={() => this.removeFile(index)}>
                  <font-icon name="remove" color="ghost" size="20" />
                </Styled.ButtonRemove>
              </Styled.FileBox>
            );
          })}
        </Styled.SelectedFiles>
      );
    }
  }

  render(): JSX.Element {
    return (
      <Styled.InputWrapper>
        <Styled.InputContainer isEdit={this.isEdit}>
          <Input
            ref="commentInput"
            height="44px"
            name="search"
            size="large"
            iconSize="32"
            type={InputType.TEXTAREA}
            maxLength={255}
            value={this.comment}
            placeholder={this.$t('add_a_comment')}
            changeValue={(value: string) => {
              this.comment = value;
            }}
            iconColor={this.isDisable ? 'ghost' : 'highland'}
            suffixIcon={this.isEdit ? null : 'circle_arrow_right'}
            clickSuffixIcon={this.send}
            keyDownInput={this.handleKeyDown}
          />
          <Styled.Avatar>{this.avatarChar}</Styled.Avatar>
          <VueUploadComponent
            vModel={this.selectedFiles}
            accept={this.uploadConfig.ACCEPTED}
            size={this.uploadConfig.MAX_SIZE}
            input-id={this.inputId}
            vOn:input={this.handleChangeFiles}
            multiple
          >
            <font-icon
              name="attach_file"
              color={this.isSending ? 'ghost' : 'highland'}
              size="32"
            />
          </VueUploadComponent>
        </Styled.InputContainer>
        {this.renderBlobFiles()}
        {this.renderSelectedFiles()}
        {this.isEdit && (
          <Styled.Actions>
            <Button
              label={this.$t('common.action.cancel')}
              variant="transparentPrimary"
              size="small"
              disabled={this.isSending}
              click={this.revertComment}
            />
            <Button
              label={this.$t('common.action.save')}
              variant="transparentPrimary"
              size="small"
              disabled={this.isSending}
              click={this.send}
            />
          </Styled.Actions>
        )}
      </Styled.InputWrapper>
    );
  }
}
