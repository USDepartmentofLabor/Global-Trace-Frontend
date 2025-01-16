import { Component, Prop, Vue } from 'vue-property-decorator';
import { get, isEmpty } from 'lodash';
import { formatDate } from 'utils/date';
import { getFileNameFromURL } from 'utils/helpers';
import { downloadFile } from 'utils/download-helper';
import { DATE_TIME_FORMAT } from 'config/constants';
import { ReportStatusEnum } from 'enums/auditor';
import * as Styled from './styled';
import ReasonAudit from '../ReasonAudit';
import IndicatorAndSubIndicator from '../IndicatorAndSubIndicator';

@Component
export default class PanelDetail extends Vue {
  @Prop({ default: false }) isResponded: boolean;
  @Prop({ default: false }) isExpand: boolean;
  @Prop({ default: {} }) data: GrievanceReport.Report;
  @Prop({
    default: () => {
      //
    },
  })
  click: (id: string) => void;

  get id(): string {
    return get(this.data, 'id');
  }

  get createdAt(): number {
    return get(this.data, 'createdAt');
  }

  get recordedAt(): number {
    return get(this.data, 'recordedAt');
  }

  get reason(): string {
    return get(this.data, 'reason');
  }

  get severity(): string {
    return get(this.data, 'severity');
  }

  get indicator(): string {
    return get(this.data, 'indicator');
  }

  get location(): string {
    return get(this.data, 'location');
  }

  get message(): string {
    return get(this.data, 'message');
  }

  get uploadImages(): string[] {
    return get(this.data, 'uploadImages');
  }

  get laborRisks(): GrievanceReport.LaborRisk[] {
    return get(this.data, 'laborRisks');
  }

  get status(): string {
    const status = get(this.data, 'status');
    switch (status) {
      case ReportStatusEnum.NEW:
        return this.$t('new');
      case ReportStatusEnum.VIEWED:
        return this.$t('viewed');
      default:
        return this.$t('response_sent');
    }
  }

  get submissionDate(): string {
    if (this.data) {
      return formatDate(this.data.recordedAt, DATE_TIME_FORMAT);
    }
    const submissionDate = this.isResponded ? this.recordedAt : this.createdAt;
    return formatDate(submissionDate, DATE_TIME_FORMAT);
  }

  getFileExtension(fileName: string): string {
    return fileName.split('.').pop();
  }

  getFileIcon(fileName: string): string {
    const extension = this.getFileExtension(fileName);
    const isImageExtension = /(gif|jpe?g|tiff?|png|webp|bmp)$/i.test(extension);
    return isImageExtension ? 'photo' : 'document';
  }

  renderSubmission(): JSX.Element {
    return (
      <Styled.Row>
        <Styled.Label>{this.$t('requestPage.submission')}</Styled.Label>
        <Styled.Text isBold>{this.submissionDate}</Styled.Text>
      </Styled.Row>
    );
  }

  renderReason(): JSX.Element {
    return (
      <Styled.Row>
        <Styled.Label>{this.$t('reason_for_follow_up')}</Styled.Label>
        <Styled.Text>
          <ReasonAudit reason={this.reason} />
        </Styled.Text>
      </Styled.Row>
    );
  }

  renderStatus(): JSX.Element {
    return (
      <Styled.Row>
        <Styled.Label>{this.$t('status')}</Styled.Label>
        <Styled.Text isBold>{this.status}</Styled.Text>
      </Styled.Row>
    );
  }

  renderIndicatorAndSubIndicator(): JSX.Element {
    return (
      <Styled.Row>
        <Styled.Label>{this.$t('indicator_sub_indicator')}</Styled.Label>
        <Styled.Text>
          <IndicatorAndSubIndicator laborRisks={this.laborRisks} />
        </Styled.Text>
      </Styled.Row>
    );
  }

  renderLocation(): JSX.Element {
    return (
      <Styled.Row>
        <Styled.Label>{this.$t('location')}</Styled.Label>
        <Styled.Text>{this.location}</Styled.Text>
      </Styled.Row>
    );
  }

  renderNotes(): JSX.Element {
    return (
      <Styled.Row isFullWidth>
        <Styled.Label>{this.$t('notes')}</Styled.Label>
        <Styled.Text>{this.message}</Styled.Text>
      </Styled.Row>
    );
  }

  renderFiles(): JSX.Element {
    return (
      <fragment>
        <Styled.Line />
        <Styled.FileList>
          {this.uploadImages.map((file) => (
            <Styled.FileItem onClick={() => downloadFile(file)}>
              <font-icon
                name={this.getFileIcon(getFileNameFromURL(file))}
                color="envy"
                size="24"
              />
              <Styled.FileName>{getFileNameFromURL(file)}</Styled.FileName>
            </Styled.FileItem>
          ))}
        </Styled.FileList>
      </fragment>
    );
  }

  render(): JSX.Element {
    return (
      <Styled.RequestBlock
        isExpand={this.isExpand}
        onClick={() => this.click(this.id)}
      >
        {this.renderSubmission()}
        {this.status && this.renderStatus()}
        {this.renderIndicatorAndSubIndicator()}
        {this.location && this.renderLocation()}
        <Styled.Inner>
          {this.message && this.renderNotes()}
          {!isEmpty(this.uploadImages) && this.renderFiles()}
        </Styled.Inner>
      </Styled.RequestBlock>
    );
  }
}
