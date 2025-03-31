import { Component, Prop, Vue } from 'vue-property-decorator';
import { get } from 'lodash';
import { formatDate } from 'utils/date';
import auth from 'store/modules/auth';
import { DATE_TIME_FORMAT } from 'config/constants';
import Button from 'components/FormUI/Button';
import PanelDetail from './PanelDetail';
import * as Styled from './styled';

const RespondToRequestModal = () => import('modals/RespondToRequestModal');

@Component
export default class RequestPanel extends Vue {
  @Prop({ default: false }) isShowDetailPanel: boolean;
  @Prop({ default: {} }) requestInfo: GrievanceReport.Report;
  @Prop({ default: {} }) responsesData: GrievanceReport.Report[];
  @Prop({ default: '' }) expandBlockId: string;
  @Prop() close: () => void;
  @Prop() refreshRequest: () => Promise<void>;
  @Prop() expandBlock: () => void;
  @Prop() expandFirstBlock: () => void;

  get id(): string {
    return get(this.requestInfo, 'id');
  }

  get createdAt(): number {
    return get(this.requestInfo, 'createdAt');
  }

  get submissionDate(): string {
    return formatDate(this.createdAt, DATE_TIME_FORMAT);
  }

  get isResponded(): boolean {
    return get(this.requestInfo, 'responses', []).length > 0;
  }

  get facilityName(): string {
    return get(this.requestInfo, 'facility.name');
  }

  get labelAction(): string {
    if (this.isResponded) {
      return 'submit_further_information';
    }
    return 'respond_to_incident';
  }

  createResponsesSuccess(): void {
    this.refreshRequest().then(() => {
      this.expandFirstBlock();
    });
  }

  openRespondModal(requestId: string): void {
    this.$modal.show(
      RespondToRequestModal,
      {
        id: requestId,
        adaptive: true,
        uploadLabel: this.$t('upload_audit_report'),
        onSuccess: this.createResponsesSuccess,
      },
      { width: '776px', height: 'auto', clickToClose: false, adaptive: true },
    );
  }

  renderAction(): JSX.Element {
    if (auth.hasRespondToRequests) {
      return (
        <Button
          width="100%"
          type="button"
          variant="primary"
          label={this.$t(this.labelAction)}
          click={() => this.openRespondModal(this.id)}
        />
      );
    }
  }

  render(): JSX.Element {
    return (
      <Styled.Wrapper isShow={this.isShowDetailPanel}>
        <Styled.Header>
          <Styled.CloseIcon vOn:click={this.close}>
            <font-icon name="arrow_left" color="envy" size="22" />
          </Styled.CloseIcon>
          <Styled.Title>{this.facilityName}</Styled.Title>
        </Styled.Header>
        <Styled.Content>
          <perfect-scrollbar>
            {this.responsesData.length > 0 &&
              this.responsesData.map((request: GrievanceReport.Report) => (
                <PanelDetail
                  isResponded
                  data={request}
                  isExpand={this.expandBlockId === request.id}
                  click={this.expandBlock}
                />
              ))}
            <PanelDetail
              data={this.requestInfo}
              isExpand={this.expandBlockId === this.id}
              click={this.expandBlock}
            />
          </perfect-scrollbar>
        </Styled.Content>
        <Styled.Footer>{this.renderAction()}</Styled.Footer>
      </Styled.Wrapper>
    );
  }
}
