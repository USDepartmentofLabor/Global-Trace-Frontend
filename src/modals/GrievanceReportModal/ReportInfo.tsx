import { Vue, Component, Prop } from 'vue-property-decorator';
import { get } from 'lodash';
import { formatDate } from 'utils/date';
import { PriorityEnum } from 'enums/auditor';
import Input from 'components/FormUI/Input';
import Dropdown from 'components/FormUI/Dropdown';
import * as Styled from './styled';

@Component
export default class ReportInfo extends Vue {
  @Prop({ default: false }) readonly isEdit: boolean;
  @Prop({ default: {}, required: true }) report: GrievanceReport.Report;
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

  get reportCreatedAt(): string {
    return formatDate(this.report.createdAt);
  }

  get facilityName(): string {
    return get(this.report, 'facility.name');
  }

  created() {
    this.initPriority();
  }

  initPriority(): void {
    this.prioritySelected = this.priorityOptions.find(
      ({ name }) => name === this.report.priority?.toString(),
    );
  }

  getSource(): string {
    const firstName = get(this.report, 'creator.firstName');
    const lastName = get(this.report, 'creator.lastName');
    const organization = get(this.report, 'creator.facilities.name');
    if (organization) {
      return `${firstName} ${lastName} (${organization})`;
    }
    return `${firstName} ${lastName}`;
  }

  renderFacility(): JSX.Element {
    return (
      <Input
        name="facility_name"
        label={this.$t('grievanceReportPage.facility')}
        disabled
        height="48px"
        value={this.facilityName}
      />
    );
  }

  renderLocation(): JSX.Element {
    return (
      <Input
        name="location"
        label={this.$t('location')}
        disabled
        height="48px"
        value={this.report.location}
      />
    );
  }

  render(): JSX.Element {
    return (
      <fragment>
        {this.isEdit && (
          <fragment>
            <Styled.Row>
              <Input
                name="source"
                label={this.$t('source')}
                disabled
                height="48px"
                value={this.getSource()}
              />
              <Input
                name="createdAt"
                label={this.$t('last_updated')}
                disabled
                height="48px"
                value={this.reportCreatedAt}
              />
            </Styled.Row>
            <Dropdown
              title={this.$t('report_priority')}
              options={this.priorityOptions}
              height="48px"
              value={this.prioritySelected}
              overflow
              allowEmpty={false}
              disabled
            />
          </fragment>
        )}
        <Styled.Row>
          {this.renderFacility()}
          {this.renderLocation()}
        </Styled.Row>
      </fragment>
    );
  }
}
