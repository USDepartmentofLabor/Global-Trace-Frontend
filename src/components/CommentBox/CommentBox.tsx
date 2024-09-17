import { Vue, Component, Prop } from 'vue-property-decorator';
import { UPLOAD_FILE } from 'config/constants';
import * as Styled from './styled';
import CommentList from './elements/CommentList/CommentList';
import CommentInput from './elements/CommentInput/CommentInput';

@Component
export default class CommentBox extends Vue {
  @Prop({ default: false }) showInput: boolean;
  @Prop({ default: false }) showCommentList: boolean;
  @Prop({ default: [] }) comments: CAP.Comment[];
  @Prop({ type: Object, default: () => UPLOAD_FILE })
  uploadConfig: App.UploadFileConfigType;
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
  @Prop({
    type: Function,
    default: () => {
      //
    },
  })
  removeBlobName: (id: string, blobName: string) => void;
  @Prop({
    type: Function,
    default: () => {
      //
    },
  })
  updateComment: (
    id: string,
    content: string,
    selectedFiles: App.SelectedFile[],
    callback: () => void,
  ) => void;
  @Prop({
    type: Function,
    default: () => {
      //
    },
  })
  deleteComment: (id: string) => void;

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

  renderInput(): JSX.Element {
    return (
      <CommentInput
        inputId="addComment"
        blobFiles={[]}
        changeFiles={this.changeFiles}
        submit={this.submit}
      />
    );
  }

  renderComments(): JSX.Element {
    return (
      <CommentList
        comments={this.comments}
        removeBlobName={this.removeBlobName}
        updateComment={this.updateComment}
        deleteComment={this.deleteComment}
      />
    );
  }

  render(): JSX.Element {
    return (
      <Styled.Wrapper>
        {this.showInput && this.renderInput()}
        {this.showCommentList && this.renderComments()}
      </Styled.Wrapper>
    );
  }
}
