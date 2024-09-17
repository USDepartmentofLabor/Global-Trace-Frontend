import { map } from 'lodash';
import { Vue, Component, Prop } from 'vue-property-decorator';
import Comment from './Comment';
import * as Styled from './styled';

@Component
export default class CommentList extends Vue {
  @Prop({ default: [] }) comments: CAP.Comment[];
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

  render(): JSX.Element {
    return (
      <Styled.CommentList>
        {map(this.comments, (comment) => (
          <Comment
            comment={comment}
            key={comment.id}
            removeBlobName={(blobName: string) => {
              this.removeBlobName(comment.id, blobName);
            }}
            update={(
              content: string,
              selectedFiles: App.SelectedFile[],
              callback: () => void,
            ) => {
              this.updateComment(comment.id, content, selectedFiles, callback);
            }}
            delete={() => {
              this.deleteComment(comment.id);
            }}
          />
        ))}
      </Styled.CommentList>
    );
  }
}
