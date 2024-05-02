import { Vue, Component, Prop } from 'vue-property-decorator';
import moment from 'moment';
import { isEmpty, some } from 'lodash';
import { dateToISOString } from 'utils/date';
import { InputType } from 'enums/app';
import { PriorityEnum } from 'enums/auditor';
import { DATE_TIME_FORMAT } from 'config/constants';
import Button from 'components/FormUI/Button';
import DatePicker from 'components/FormUI/DatePicker';
import FileUpload from 'components/FormUI/FileUpload';
import Dropdown from 'components/FormUI/Dropdown';
import Input from 'components/FormUI/Input';
import * as Styled from './styled';

@Component
export default class Form extends Vue {
  @Prop({ default: true }) readonly showAuditReportNumber: string;
  @Prop({ default: false }) readonly laborRisks: GrievanceReport.LaborRisk[];
  @Prop({ default: false }) readonly hasErrors: boolean;
  @Prop({ default: false }) readonly isSubmitting: boolean;
  @Prop({
    default: () => {
      //
    },
  })
  changeFiles: (files: File[]) => void;
  @Prop({
    default: () => {
      //
    },
  })
  addIndicator: () => void;

  private formName: string = 'respondToRequest';
  private hasErrorUpload: boolean = false;
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

  get isEmptyLaborRisk(): boolean {
    return isEmpty(this.laborRisks);
  }

  get formData(): GrievanceReport.CommunityRiskScanParams {
    return this.$formulate.registry.get(this.formName).proxy;
  }

  get recordedAt(): Date {
    const { recordedAt } = this.formData;
    return recordedAt ? moment(recordedAt).toDate() : null;
  }

  set recordedAt(value: Date) {
    this.$formulate.setValues(this.formName, {
      ...this.formData,
      recordedAt: dateToISOString(value),
    });
  }

  get isDisabledSubmit(): boolean {
    return (
      !this.recordedAt ||
      this.hasErrorUpload ||
      this.isEmptyLaborRisk ||
      isEmpty(this.prioritySelected) ||
      this.hasErrors ||
      this.isSubmitting
    );
  }

  disabledDatetime(date: Date): boolean {
    const validDate = moment().toDate();
    return date > validDate;
  }

  onChangeDateTime(recordedAt: string): void {
    this.recordedAt = moment(recordedAt).toDate();
  }

  onChangePriority(option: App.DropdownOption = null): void {
    this.prioritySelected = option;
    this.$formulate.setValues(this.formName, {
      ...this.formData,
      priority: option.name,
    });
  }

  onChangeFiles(selectedFiles: App.SelectedFile[]): void {
    this.hasErrorUpload = some(selectedFiles, ['isError', true]);
    this.changeFiles(selectedFiles.map(({ file }) => file));
  }

  renderDatetime(): JSX.Element {
    return (
      <Styled.Row>
        <DatePicker
          label={this.$t('date_time')}
          height="48px"
          type="datetime"
          variant="material"
          placeholder={this.$t('date_time')}
          value={this.recordedAt}
          selectDate={this.onChangeDateTime}
          disabled={this.isSubmitting}
          format={DATE_TIME_FORMAT}
          disabledDate={this.disabledDatetime}
          disabledTime={this.disabledDatetime}
        />
      </Styled.Row>
    );
  }

  renderPriority(): JSX.Element {
    return (
      <Styled.Row>
        <Dropdown
          title={this.$t('report_priority')}
          options={this.priorityOptions}
          height="48px"
          variant="material"
          value={this.prioritySelected}
          changeOptionValue={this.onChangePriority}
          placeholder={this.$t('report_priority')}
          overflow
          allowEmpty={false}
        />
      </Styled.Row>
    );
  }

  renderLaborRisk(): JSX.Element {
    return (
      <Styled.Row>
        <Styled.InputGroup vOn:click={this.addIndicator}>
          <Styled.InputGroupResult isActive={!this.isEmptyLaborRisk}>
            {this.indicatorsLabel}
          </Styled.InputGroupResult>
          <font-icon
            name={this.isEmptyLaborRisk ? 'plus' : 'edit'}
            color="highland"
            size="20"
          />
        </Styled.InputGroup>
      </Styled.Row>
    );
  }

  renderNotes(): JSX.Element {
    return (
      <Styled.Row>
        <Input
          type={InputType.TEXTAREA}
          label={this.$t('notes')}
          name="message"
          variant="material"
          height="108px"
          maxlength={255}
          placeholder={this.$t('notes')}
          disabled={this.isSubmitting}
          validation="bail|required"
          validationMessages={{
            required: this.$t('validation.required', {
              field: this.$t('notes').toLowerCase(),
            }),
          }}
        />
      </Styled.Row>
    );
  }

  renderReportNumber(): JSX.Element {
    return (
      <Styled.Row>
        <Input
          label={this.$t('report_number')}
          name="auditReportNumber"
          variant="material"
          height="48px"
          maxlength={255}
          placeholder={this.$t('report_number')}
          disabled={this.isSubmitting}
        />
      </Styled.Row>
    );
  }

  renderUploadImage(): JSX.Element {
    return (
      <Styled.Row>
        <FileUpload
          disabled={this.isSubmitting}
          label={this.$t('upload_file')}
          changeFiles={this.onChangeFiles}
        />
      </Styled.Row>
    );
  }

  renderAction(): JSX.Element {
    return (
      <Styled.Action>
        <Button
          width="100%"
          type="submit"
          label={this.$t('common.action.submit')}
          variant="primary"
          isLoading={this.isSubmitting}
          disabled={this.isDisabledSubmit}
        />
      </Styled.Action>
    );
  }

  render(): JSX.Element {
    return (
      <Styled.Form>
        {this.renderDatetime()}
        {this.renderPriority()}
        {this.renderLaborRisk()}
        {this.renderNotes()}
        <Styled.Line />
        {this.showAuditReportNumber && this.renderReportNumber()}
        {this.renderUploadImage()}
        {this.renderAction()}
      </Styled.Form>
    );
  }
}
