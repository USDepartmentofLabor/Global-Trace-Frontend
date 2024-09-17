import { Vue, Component, Prop } from 'vue-property-decorator';
import { compact, get, join } from 'lodash';
import { getUserAvatarByName } from 'utils/user';
import { formatDate } from 'utils/date';
import { DATE_TIME_FORMAT } from 'config/constants';
import * as Styled from './styled';

@Component
export default class Comment extends Vue {
  @Prop({ required: true }) comment: CAP.Comment;
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
  update: (
    comment: string,
    selectedFiles: App.SelectedFile[],
    callback: () => void,
  ) => void;
  @Prop({
    type: Function,
    default: () => {
      //
    },
  })
  delete: () => void;

  handleSave(
    comment: string,
    selectedFiles: App.SelectedFile[],
    callback: () => void,
  ) {
    this.update(comment, selectedFiles, () => {
      callback();
    });
  }

  downloadFile(downloadUrl: string) {
    window.open(downloadUrl, '_blank');
  }

  render(): JSX.Element {
    const firstName = get(this.comment, 'user.firstName', '');
    const lastName = get(this.comment, 'user.lastName', '');
    const name = join(compact([firstName, lastName]), ' ');
    const avatarChar = getUserAvatarByName(firstName, lastName);
    return (
      <Styled.CommentCard>
        <Styled.CommentAvatar>{avatarChar}</Styled.CommentAvatar>
        <Styled.CommentInfo>
          <Styled.CommentUserName>{name}</Styled.CommentUserName>
          <Styled.CommentAt>
            {formatDate(this.comment.createdAt, DATE_TIME_FORMAT)}
          </Styled.CommentAt>
          <Styled.Comment>{this.comment.content}</Styled.Comment>
          <Styled.CommentFiles>
            {this.comment.files.map(({ fileName, link }) => (
              <Styled.CommentFile>
                <Styled.File
                  vOn:click={() => {
                    this.downloadFile(link);
                  }}
                >
                  <font-icon name="attach_file" color="highland" size="20" />
                  {fileName}
                </Styled.File>
              </Styled.CommentFile>
            ))}
          </Styled.CommentFiles>
        </Styled.CommentInfo>
      </Styled.CommentCard>
    );
  }
}
