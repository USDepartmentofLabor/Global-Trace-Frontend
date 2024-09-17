import { Vue, Component, Prop } from 'vue-property-decorator';
import { get, head, isEmpty } from 'lodash';
import { SpinLoading } from 'components/Loaders';
import { ActionPlanViewEnum, CapStatusEnum } from 'enums/brand';
import { getCAPDetail, updateCAP } from 'api/cap';
import { handleError } from 'components/Toast';
import { formatDate } from 'utils/date';
import { getUserFacility } from 'utils/user';
import auth from 'store/modules/auth';
import Form from './elements/Form/Form';
import AcceptEvidence from './elements/AcceptEvidence/AcceptEvidence';
import * as Styled from './styled';

@Component
export default class ActionPlanModal extends Vue {
  @Prop({ required: true })
  readonly facility: Auth.Facility;
  @Prop({ default: null }) createdFacility: Auth.Facility;
  @Prop({ default: null })
  readonly capId: string;
  @Prop({ default: [] })
  readonly indicatorRiskData: Auth.IndicatorRiskData[];
  @Prop({
    default: () => {
      // TODO
    },
  })
  onSuccess: (status: CapStatusEnum) => void;
  @Prop({
    default: () => {
      // TODO
    },
  })
  onCloseModal: () => void;

  private isLoading = false;
  private viewType: ActionPlanViewEnum = ActionPlanViewEnum.ACTION_PLAN;
  private CAPDetail: CAP.CAPDetail = null;
  private riskData: Auth.IndicatorRiskData[] = [];
  private issueLabel: string = 'issued_to';
  private issuedDetail: string = null;

  get cap(): CAP.CAP {
    return get(this.CAPDetail, 'indicatorRiskData.subIndicatorRiskData.cap');
  }

  get isNew(): boolean {
    return get(this.cap, 'status') === CapStatusEnum.NEW;
  }

  get isEdit(): boolean {
    return !isEmpty(this.capId);
  }

  get title(): string {
    return this.viewType === ActionPlanViewEnum.ACTION_PLAN
      ? this.$t('corrective_action_plan')
      : this.$t('accept_evidence');
  }

  created() {
    if (this.capId) {
      this.getCAPDetail();
    } else {
      this.riskData = this.indicatorRiskData;
    }
    this.initIssuedDetail();
  }

  initIssuedDetail(): void {
    let { name, createdAt } = this.facility;
    if (this.createdFacility) {
      const userFacility = getUserFacility(auth.user);
      const isAssignee = get(userFacility, 'id') !== this.createdFacility.id;
      if (isAssignee) {
        name = this.createdFacility.name;
        createdAt = this.createdFacility.createdAt;
        this.issueLabel = 'issued_by';
      }
    }
    this.issuedDetail = `${name} - ${formatDate(createdAt)}`;
  }

  setIssueByCAP(): void {
    const createdFacility = get(this.CAPDetail, [
      'indicatorRiskData',
      'subIndicatorRiskData',
      'cap',
      'createdFacility',
    ]);
    const { name, createdAt } = createdFacility;
    this.issuedDetail = `${name} - ${formatDate(createdAt)}`;
    this.issueLabel = 'issued_by';
  }

  async getCAPDetail(): Promise<void> {
    try {
      this.isLoading = true;
      this.CAPDetail = await getCAPDetail(this.facility.id, this.capId);
      const { indicatorRiskData } = this.CAPDetail;
      const { indicator, risk, subIndicatorRiskData } = indicatorRiskData;
      this.riskData = [
        {
          indicator,
          risk,
          subIndicatorRiskData: [subIndicatorRiskData],
        },
      ];
      this.setIssueByCAP();
    } catch (error) {
      handleError(error as App.ResponseError);
    } finally {
      this.isLoading = false;
    }
  }

  async updateCAP(params: CAP.CAPParams = {}) {
    try {
      await updateCAP(this.facility.id, this.capId, params);
    } catch (error) {
      handleError(error as App.ResponseError);
    }
  }

  async resolve(value: string): Promise<void> {
    const indicatorRiskData = head(this.riskData);
    const subIndicatorRiskData = head(
      get(indicatorRiskData, 'subIndicatorRiskData', []),
    );
    const subIndicatorId = get(subIndicatorRiskData, 'subIndicator.id');
    const { action, targetCompletionAt } = this.cap;
    await this.updateCAP({
      action,
      targetCompletionAt,
      subIndicatorId,
      status: CapStatusEnum.RESOLVED,
      riskScoreLevel: value,
    });
    this.handleCloseModal();
    this.onSuccess(CapStatusEnum.RESOLVED);
  }

  closeModal(): void {
    if (this.viewType === ActionPlanViewEnum.ACCEPT_EVIDENCE) {
      this.setViewType(ActionPlanViewEnum.ACTION_PLAN);
    } else {
      this.handleCloseModal();
    }
  }

  handleCloseModal() {
    this.$emit('close');
    this.onCloseModal && this.onCloseModal();
  }

  handleSuccess(status: CapStatusEnum) {
    this.closeModal();
    this.onSuccess(status);
  }

  setViewType(viewType: ActionPlanViewEnum) {
    this.viewType = viewType;
  }

  renderContent(): JSX.Element {
    if (this.viewType === ActionPlanViewEnum.ACTION_PLAN) {
      return (
        <Form
          facility={this.facility}
          capDetail={this.CAPDetail}
          indicatorRiskData={this.riskData}
          success={this.handleSuccess}
          cancel={this.closeModal}
          requestEvidence={() => {
            this.setViewType(ActionPlanViewEnum.ACCEPT_EVIDENCE);
          }}
        />
      );
    }
    return (
      <AcceptEvidence
        facility={this.facility}
        indicatorRiskData={this.riskData}
        cancel={() => {
          this.setViewType(ActionPlanViewEnum.ACTION_PLAN);
        }}
        submit={this.resolve}
      />
    );
  }

  renderSubTitle(): JSX.Element {
    if (this.isLoading && this.capId) {
      return null;
    }

    return (
      <Styled.SubTitle slot="subTitle">
        {this.$t(this.issueLabel)}
        <Styled.IssueDetail>{this.issuedDetail}</Styled.IssueDetail>
      </Styled.SubTitle>
    );
  }

  render(): JSX.Element {
    return (
      <modal-layout title={this.title} closeModal={this.closeModal}>
        {this.renderSubTitle()}
        {this.isLoading && (
          <Styled.Loading>
            <SpinLoading />
          </Styled.Loading>
        )}
        {!this.isLoading && this.renderContent()}
      </modal-layout>
    );
  }
}
