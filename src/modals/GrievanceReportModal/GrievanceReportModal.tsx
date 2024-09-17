/* eslint-disable max-lines */
import { Vue, Component, Prop } from 'vue-property-decorator';
import { find, get, head, isEmpty, isNull } from 'lodash';
import { updateReport, getGrievanceReportDetail } from 'api/grievance-report';
import grievanceReportModule from 'store/modules/grievance-report';
import { SeverityEnum } from 'enums/auditor';
import requestModule from 'store/modules/request';
import { handleError } from 'components/Toast';
import Button from 'components/FormUI/Button';
import { SpinLoading } from 'components/Loaders';
import Input from 'components/FormUI/Input';
import InputGroup from 'components/FormUI/InputGroup';
import IndicatorManagement from 'components/IndicatorManagement/IndicatorManagement';
import ReportInfo from './ReportInfo';
import Assignees from './elements/Assignees';
import Reason from './elements/Reason';
import * as Styled from './styled';

@Component
export default class GrievanceReportModal extends Vue {
  @Prop({ default: true }) isEdit: boolean;
  @Prop({ default: '' }) title: string;
  @Prop({ required: true }) reportId: string;
  @Prop({
    type: Function,
    default: () => {
      //
    },
  })
  onSuccess: () => void;

  private isLoading: boolean = false;
  private isSubmitting: boolean = false;
  private formName: string = 'editGrievanceReport';
  private formInput: GrievanceReport.EditReportParams = {
    indicator: '',
    assigneeId: null,
    reason: null,
    isNoFollowUp: false,
    priority: null,
    laborRisks: [],
  };
  private reportData: GrievanceReport.Report = {
    id: '',
    facilityId: '',
    facility: null,
    assigneeId: null,
    assignee: null,
    indicator: '',
    location: '',
    isResponded: false,
    reason: null,
    priority: null,
    createdAt: 0,
  };
  private selectedAssignee: Auth.User = null;
  private selectedReason: App.DropdownOption = null;
  private laborRisks: GrievanceReport.LaborRiskParams[] = [];
  private isAddingLaborRisk: boolean = false;
  private severityOptions: App.DropdownOption[] = [
    {
      name: this.$t('high'),
      value: SeverityEnum.HIGH.toString(),
    },
    {
      name: this.$t('medium'),
      value: SeverityEnum.MEDIUM.toString(),
    },
    {
      name: this.$t('low'),
      value: SeverityEnum.LOW.toString(),
    },
  ];

  get label(): string {
    return this.isAddingLaborRisk ? this.$t('indicators') : this.title;
  }

  get isEmptyLaborRisk(): boolean {
    return isEmpty(this.laborRisks);
  }

  get indicatorsLabel(): string {
    if (this.laborRisks.length > 1) {
      return this.$t('number_indicators_selected', {
        number: this.laborRisks.length,
      });
    } else if (this.laborRisks.length === 1) {
      return this.$t('number_indicator_selected', {
        number: this.laborRisks.length,
      });
    }
    return this.$t('indicators');
  }

  get isNoFollowUpAssignee(): boolean {
    return this.selectedAssignee && this.selectedAssignee.id === null;
  }

  get hasAssignee(): boolean {
    if (this.isNoFollowUpAssignee) {
      return false;
    }
    return !isEmpty(this.selectedAssignee);
  }

  get assignees(): Auth.User[] {
    return [
      {
        id: null,
        name: this.$t('createReportModal.no_follow_up'),
        email: this.$t('createReportModal.no_follow_up'),
      },
      ...grievanceReportModule.assignees,
    ];
  }

  get isRequiredReason(): boolean {
    if (!this.hasAssignee) {
      return false;
    }
    if (!isNull(this.selectedAssignee.id)) {
      return isEmpty(this.selectedReason);
    }
    return false;
  }

  get isRequiredAssignee(): boolean {
    return !this.selectedAssignee;
  }

  created(): void {
    this.initData(this.reportId);
  }

  closeModal(): void {
    this.$emit('close');
  }

  async initData(id: string): Promise<void> {
    try {
      this.isLoading = true;
      await this.getIndicators();
      this.reportData = await getGrievanceReportDetail(id);
      this.initAssignee();
      this.initReason();
      this.initLaborRisks();
      this.initPriority();
    } catch (error) {
      handleError(error as App.ResponseError);
    } finally {
      this.isLoading = false;
    }
  }

  initReason(): void {
    if (this.reportData.reason) {
      this.selectedReason = find(
        grievanceReportModule.reasons,
        (reason) => reason.name === this.reportData.reason,
      );
      this.formInput.reason = this.selectedReason?.name.toString() || null;
    }
  }

  initAssignee(): void {
    if (this.reportData.assigneeId) {
      this.selectedAssignee = find(
        grievanceReportModule.assignees,
        (assignee) => assignee.id === this.reportData.assigneeId,
      );
      this.formInput.assigneeId = this.selectedAssignee?.id.toString() || null;
    } else if (this.reportData.isNoFollowUp) {
      this.selectedAssignee = head(this.assignees);
    }
  }

  initLaborRisks(): void {
    const laborRisks = this.reportData
      .laborRisks as GrievanceReport.LaborRisk[];
    this.laborRisks = laborRisks.map(
      ({ indicator, subIndicator, severity }) => {
        const severityValue = this.severityOptions.find(
          ({ value }) => value == severity.toString(),
        );
        return {
          indicator: indicator,
          subIndicator: subIndicator,
          severity: severityValue,
        };
      },
    );
    this.formInput.laborRisks = this.laborRisks.map(
      ({ indicator, subIndicator, severity }) => ({
        indicatorId: indicator.id as string,
        subIndicatorId: subIndicator.id as string,
        severity: parseInt(severity.value),
      }),
    );
  }

  initPriority(): void {
    this.formInput.priority = this.reportData.priority;
  }

  async onSubmit(): Promise<void> {
    this.isSubmitting = true;
    try {
      await updateReport(this.reportId, this.formInput);
      this.$toast.success(this.$t('userModal.successfully_saved'));
      this.onSuccess();
      this.closeModal();
    } catch (error) {
      handleError(error as App.ResponseError);
    } finally {
      this.isSubmitting = false;
    }
  }

  onChangeLaborRisks(data: GrievanceReport.LaborRiskParams[]): void {
    this.formInput.laborRisks = data.map(
      ({ indicator, subIndicator, severity }) => ({
        indicatorId: indicator.id as string,
        subIndicatorId: subIndicator.id as string,
        severity: parseInt(severity.value),
      }),
    );
    this.laborRisks = data;
    this.toggleAddingLaborRisk();
  }

  toggleAddingLaborRisk(): void {
    this.isAddingLaborRisk = !this.isAddingLaborRisk;
  }

  getIndicators(): Promise<void> {
    return new Promise((resolve) => {
      if (requestModule.indicators.length === 0) {
        requestModule.getIndicators({
          callback: {
            onFailure: (error: App.ResponseError) => {
              handleError(error);
            },
            onFinish: () => {
              resolve();
            },
          },
        });
      }
      resolve();
    });
  }

  onChangeAssignee(user: Auth.User): void {
    const userId = get(user, 'id');
    if (!isNull(userId)) {
      this.formInput.assigneeId = user.id.toString();
    }
    this.selectedAssignee = user;
    this.formInput.isNoFollowUp = userId === null;
    if (!this.hasAssignee) {
      this.selectedReason = null;
      this.formInput.reason = null;
    }
  }

  onChangeReason(option: App.DropdownOption): void {
    this.selectedReason = option;
    this.formInput.reason = option.name;
  }

  renderIndicators(): JSX.Element {
    return (
      <IndicatorManagement
        data={this.laborRisks}
        back={this.toggleAddingLaborRisk}
        change={this.onChangeLaborRisks}
      />
    );
  }

  renderLaborRisk(): JSX.Element {
    return (
      <Styled.Col>
        <Styled.Label>{this.$t('indicators')}</Styled.Label>
        <Styled.InputGroup vOn:click={this.toggleAddingLaborRisk}>
          <Styled.InputGroupResult isActive={!this.isEmptyLaborRisk}>
            {this.indicatorsLabel}
          </Styled.InputGroupResult>
          <font-icon
            name={this.isEmptyLaborRisk ? 'plus' : 'edit'}
            color="highland"
            size="20"
          />
        </Styled.InputGroup>
      </Styled.Col>
    );
  }

  renderMessage(): JSX.Element {
    return (
      <Input
        type="textarea"
        name="message"
        label={this.$t('createReportModal.message')}
        disabled
        height={this.isEdit ? '66px' : '104px'}
        value={this.reportData.message}
      />
    );
  }

  renderActions(hasErrors: boolean): JSX.Element {
    return (
      <Styled.Actions>
        <Styled.ButtonGroupEnd>
          <Button
            label={this.$t('common.action.cancel')}
            variant="transparentPrimary"
            click={this.closeModal}
          />
          {this.isEdit && (
            <Button
              type="submit"
              label={this.$t('common.action.save_changes')}
              variant="primary"
              disabled={
                hasErrors ||
                this.isSubmitting ||
                this.isRequiredReason ||
                this.isRequiredAssignee
              }
            />
          )}
        </Styled.ButtonGroupEnd>
      </Styled.Actions>
    );
  }

  renderForm(): JSX.Element {
    return (
      <formulate-form
        name={this.formName}
        v-model={this.formInput}
        vOn:submit={this.onSubmit}
        scopedSlots={{
          default: ({ hasErrors }: { hasErrors: boolean }) => (
            <Styled.Wrapper>
              <perfect-scrollbar>
                <Styled.Form>
                  <InputGroup>
                    <ReportInfo report={this.reportData} isEdit={this.isEdit} />
                    {this.isEdit && this.renderMessage()}
                    {this.isEdit && this.renderLaborRisk()}
                    <Assignees
                      isSubmitting={this.isSubmitting}
                      isEdit={this.isEdit}
                      hasAssignee={this.hasAssignee}
                      assignees={this.assignees}
                      selectedAssignee={this.selectedAssignee}
                      changeAssignee={this.onChangeAssignee}
                    />
                    {this.hasAssignee && (
                      <Reason
                        isSubmitting={this.isSubmitting}
                        isEdit={this.isEdit}
                        selectedReason={this.selectedReason}
                        changeReason={this.onChangeReason}
                      />
                    )}
                    {!this.isEdit && this.renderMessage()}
                    {this.renderActions(hasErrors)}
                  </InputGroup>
                </Styled.Form>
              </perfect-scrollbar>
            </Styled.Wrapper>
          ),
        }}
      />
    );
  }

  render(): JSX.Element {
    return (
      <modal-layout title={this.label} closeModal={this.closeModal}>
        {this.isLoading && <SpinLoading isInline={false} />}
        {!this.isLoading && (
          <keep-alive>
            {this.isAddingLaborRisk
              ? this.renderIndicators()
              : this.renderForm()}
          </keep-alive>
        )}
      </modal-layout>
    );
  }
}
