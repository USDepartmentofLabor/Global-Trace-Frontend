import { isEmpty } from 'lodash';
import { Vue, Component, Prop } from 'vue-property-decorator';
import { RESOURCES } from 'config/constants';
import { formatSize } from 'utils/helpers';
import { formatDate } from 'utils/date';
import * as Styled from 'styles/translation-file';

@Component
export default class TranslationFiles extends Vue {
  @Prop({ required: true }) readonly title: string;
  @Prop({ required: true }) readonly files: App.SelectedFile[];
  @Prop({ default: RESOURCES.ICON_JSON_FILE }) readonly fileIcon: string;
  @Prop({
    default: () => {
      //
    },
  })
  download: (fileId: string) => Promise<void>;
  @Prop({
    default: () => {
      //
    },
  })
  delete: (file: App.SelectedFile) => void;

  renderAction(file: App.SelectedFile): JSX.Element {
    return (
      <Styled.EmptyAction>
        {file.createdAt && (
          <font-icon
            name="download"
            color="manatee"
            size="16"
            cursor
            vOn:click_native={() => this.download(file.id)}
          />
        )}
        <font-icon
          name="delete"
          color="manatee"
          size="16"
          cursor
          vOn:click_native={() => this.delete(file)}
        />
      </Styled.EmptyAction>
    );
  }

  renderFile(file: App.SelectedFile): JSX.Element {
    return (
      <Styled.FileItem key={file.id}>
        <Styled.Icon src={this.fileIcon} />
        <Styled.FileInfo>
          <Styled.FileName>
            <span>{file.name}</span>
            {!file.createdAt && (
              <Styled.Tag>{this.$t('not_submitted')}</Styled.Tag>
            )}
          </Styled.FileName>
          <Styled.ExtraInfo>
            <span>{formatSize(file.size)}</span>
            {file.createdAt && (
              <Styled.FileCreatedAt>
                {formatDate(file.createdAt)}
              </Styled.FileCreatedAt>
            )}
          </Styled.ExtraInfo>
        </Styled.FileInfo>
        {this.renderAction(file)}
      </Styled.FileItem>
    );
  }

  render(): JSX.Element {
    if (isEmpty(this.files)) {
      return null;
    }
    return (
      <fragment>
        <Styled.TranslationType>{this.title}</Styled.TranslationType>
        {this.files.map(this.renderFile)}
      </fragment>
    );
  }
}
