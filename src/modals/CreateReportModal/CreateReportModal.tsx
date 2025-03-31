/* eslint-disable max-lines */
import { Vue, Component, Prop } from 'vue-property-decorator';
import { get, isEmpty, isNull, omit } from 'lodash';
import { createReport } from 'api/grievance-report';
import grievanceReportModule from 'store/modules/grievance-report';
import requestModule from 'store/modules/request';
import auth from 'store/modules/auth';
import { getBusinessLocation } from 'utils/helpers';
import { PriorityEnum } from 'enums/auditor';
import { handleError } from 'components/Toast';
import Button from 'components/FormUI/Button';
import Input from 'components/FormUI/Input';
import { SpinLoading } from 'components/Loaders';
import DropDown from 'components/FormUI/Dropdown';
import IndicatorManagement from 'components/IndicatorManagement/IndicatorManagement';
import FacilitySearchBox from 'components/FacilitySearchBox';
import InputGroup from 'components/FormUI/InputGroup';
import Assignee from './elements/Assignee';
import * as Styled from './styled';

@Component
export default class CreateReportModal extends Vue {
  @Prop({ required: true }) onSuccess: () => void;

  private isLoading: boolean = false;
  private isSubmitting: boolean = false;
  private messageErrors: App.MessageError = null;
  private formName: string = 'grievanceReportForm';
  private formInput: GrievanceReport.CreateReportParams = {
    facilityId: '',
    location: '',
    assigneeId: null,
    reason: '',
    message: '',
    isNoFollowUp: false,
    priority: null,
    laborRisks: [],
  };
  private selectedAssignee: Auth.User = null;
  private selectedReason: App.DropdownOption = null;
  private laborRisks: GrievanceReport.LaborRiskParams[] = [];
  private isAddingLaborRisk: boolean = false;
  private prioritySelected: App.DropdownOption = null;
  private priorityOptions: App.DropdownOption[] = [
    {
      name: PriorityEnum.EXTREME.toString(),
    },
    {
      name: PriorityEnum.HIGH.toString(),
    },
    {
      name: PriorityEnum.MEDIUM.toString(),
    },
    {
      name: PriorityEnum.LOW.toString(),
    },
    {
      name: PriorityEnum.REMEDIATION.toString(),
    },
  ];

  get label(): string {
    return this.isAddingLaborRisk
      ? this.$t('indicators')
      : this.$t('createReportModal.title');
  }

  get formData(): GrievanceReport.CreateReportParams {
    return this.$formulate.registry.get(this.formName).proxy;
  }

  get isEmptyFacilityId(): boolean {
    return isEmpty(this.formInput.facilityId);
  }

  get isEmptyAssignee(): boolean {
    return isEmpty(this.selectedAssignee);
  }

  get isEmptyPriority(): boolean {
    return isEmpty(this.prioritySelected);
  }

  get isEmptyLaborRisk(): boolean {
    return isEmpty(this.laborRisks);
  }

  get isEmptyReason(): boolean {
    return isEmpty(this.selectedReason);
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
    return this.$t('choose_indicators');
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

  get isNoFollowUp(): boolean {
    return this.formInput.isNoFollowUp;
  }

  get isDisabledReason(): boolean {
    return !this.isNoFollowUp && this.isEmptyReason;
  }

  get isDisabledSubmit(): boolean {
    const isDisabled =
      this.isSubmitting ||
      this.isEmptyFacilityId ||
      this.isEmptyPriority ||
      this.isEmptyLaborRisk ||
      this.isDisabledReason;

    return auth.hasReferReport
      ? isDisabled || this.isEmptyAssignee
      : isDisabled;
  }

  closeModal(): void {
    if (this.isAddingLaborRisk) {
      this.toggleAddingLaborRisk();
    } else {
      this.$emit('close');
    }
  }

  getPayload(): GrievanceReport.CreateReportParams {
    let payload = this.formData;
    if (isEmpty(payload.reason)) {
      payload = omit(payload, ['reason']);
    }
    if (this.formInput.isNoFollowUp) {
      payload = omit(payload, ['assigneeId']);
    }
    payload.priority = parseInt(this.prioritySelected.name);
    return payload;
  }

  async createReport(): Promise<void> {
    this.isSubmitting = true;
    try {
      await createReport(this.getPayload());
      this.$toast.success(this.$t('createReportModal.success'));
      this.onSuccess();
      this.closeModal();
    } catch (error) {
      handleError(error as App.ResponseError);
    } finally {
      this.isSubmitting = false;
    }
  }

  setFacility(facility: GrievanceReport.Facility): void {
    this.formInput.facilityId = facility.id;
    this.formInput.location = getBusinessLocation(facility);
  }

  changeSearch(): void {
    this.$formulate.resetValidation(this.formName);
  }

  onClearMessageErrors(): void {
    if (this.messageErrors) {
      this.messageErrors = null;
    }
  }

  onSubmit(): void {
    this.createReport();
  }

  onChangeAssignee(user: Auth.User): void {
    const userId = get(user, 'id');
    if (!isNull(userId)) {
      this.setAssigneeId(userId.toString());
    }
    this.selectedAssignee = user;
    this.formInput.isNoFollowUp = userId === null;
  }

  setAssigneeId(assigneeId: string): void {
    this.formInput.assigneeId = assigneeId;
  }

  onChangeReason(option: App.DropdownOption = null): void {
    this.selectedReason = option;
    this.formInput.reason = get(option, 'name');
  }

  onChangePriority(option: App.DropdownOption = null): void {
    this.prioritySelected = option;
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

  getIndicators() {
    if (requestModule.indicators.length === 0) {
      this.isLoading = true;
      requestModule.getIndicators({
        callback: {
          onFailure: (error: App.ResponseError) => {
            handleError(error);
          },
          onFinish: () => {
            this.isLoading = false;
          },
        },
      });
    }
  }

  created(): void {
    this.getIndicators();
  }

  renderFacility(): JSX.Element {
    return (
      <Styled.Col>
        <FacilitySearchBox
          selectedFacility={this.formInput.facilityId}
          changeSearch={this.changeSearch}
          setFacility={this.setFacility}
        />
      </Styled.Col>
    );
  }

  renderLocation(): JSX.Element {
    return (
      <Input
        name="location"
        label={this.$t('location')}
        placeholder={this.$t('createReportModal.location_placeholder')}
        disabled={this.isSubmitting}
        changeValue={this.onClearMessageErrors}
        height="48px"
        validation="bail|required"
        validationMessages={{
          required: this.$t('validation.required', {
            field: this.$t('location').toLowerCase(),
          }),
        }}
      />
    );
  }

  renderAssignees(): JSX.Element {
    return (
      <Assignee
        selectedAssignee={this.selectedAssignee}
        assignees={this.assignees}
        isSubmitting={this.isSubmitting}
        changeAssignee={this.onChangeAssignee}
      />
    );
  }

  renderReason(): JSX.Element {
    return (
      <DropDown
        title={this.$t('reason_for_follow_up')}
        height="48px"
        options={grievanceReportModule.reasons}
        width="100%"
        value={this.selectedReason}
        changeOptionValue={this.onChangeReason}
        placeholder={this.$t('reason_for_follow_up_placeholder')}
        disabled={this.isSubmitting}
        overflow
      />
    );
  }

  renderMessage(): JSX.Element {
    return (
      <Input
        type="textarea"
        name="message"
        label={this.$t('createReportModal.message')}
        placeholder={this.$t('createReportModal.message_placeholder')}
        disabled={this.isSubmitting}
        changeValue={this.onClearMessageErrors}
        height="104px"
        validation="bail|required"
        validationMessages={{
          required: this.$t('validation.required', {
            field: this.$t('createReportModal.message').toLowerCase(),
          }),
        }}
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
          <Button
            type="submit"
            label={this.$t('common.action.create')}
            variant="primary"
            disabled={hasErrors || this.isDisabledSubmit}
          />
        </Styled.ButtonGroupEnd>
      </Styled.Actions>
    );
  }

  renderPriority(): JSX.Element {
    return (
      <DropDown
        title={this.$t('report_priority')}
        options={this.priorityOptions}
        height="48px"
        value={this.prioritySelected}
        changeOptionValue={this.onChangePriority}
        placeholder={this.$t('select_priority')}
        overflow
        allowEmpty={false}
      />
    );
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
                <InputGroup>
                  {this.renderFacility()}
                  {this.renderPriority()}
                  {this.renderLocation()}
                  {this.renderLaborRisk()}
                  {auth.hasReferReport && this.renderAssignees()}
                  {!this.isNoFollowUp && this.renderReason()}
                  {this.renderMessage()}
                </InputGroup>
              </perfect-scrollbar>
              {this.renderActions(hasErrors)}
            </Styled.Wrapper>
          ),
        }}
      />
    );
  }

  render(): JSX.Element {
    return (
      <modal-layout
        title={this.label}
        closeModal={this.closeModal}
        showBack={this.isAddingLaborRisk}
        back={this.toggleAddingLaborRisk}
      >
        {this.isLoading && <SpinLoading isInline={false} />}
        <keep-alive>
          {this.isAddingLaborRisk ? this.renderIndicators() : this.renderForm()}
        </keep-alive>
      </modal-layout>
    );
  }
}
