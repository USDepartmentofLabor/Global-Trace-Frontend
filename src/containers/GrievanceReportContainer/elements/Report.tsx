import { get, isNull } from 'lodash';
import { Vue, Component, Prop } from 'vue-property-decorator';
import { formatDate } from 'utils/date';
import { getRiskLevel } from 'utils/risk-assessment';
import auth from 'store/modules/auth';
import RiskAssessment from 'components/SupplierMap/RiskAssessment';
import Button from 'components/FormUI/Button';
import * as Styled from './styled';

@Component
export default class Report extends Vue {
  @Prop({ required: true }) report: GrievanceReport.Report;
  @Prop({ required: true }) openEditGrievanceModal: (reportId: string) => void;
  @Prop({ required: true }) openViewGrievanceModal: (reportId: string) => void;

  getFacilityName(report: GrievanceReport.Report): string {
    return get(report, 'facility.name');
  }

  renderAssignee(report: GrievanceReport.Report): JSX.Element | string {
    const firstName = get(report, 'assignee.firstName');
    const lastName = get(report, 'assignee.lastName');
    const organization = get(report, 'assignee.facilities.name', '');
    if (firstName && lastName) {
      return (
        <Styled.Assignee>
          {this.$t('assigned_to')}
          <Styled.Name>
            {`${firstName} ${lastName} (${organization})`}
          </Styled.Name>
        </Styled.Assignee>
      );
    }
    return '-';
  }

  renderSource(report: GrievanceReport.Report): JSX.Element {
    const firstName = get(report, 'creator.firstName');
    const lastName = get(report, 'creator.lastName');
    const organization = get(report, 'creator.facilities.name');
    return (
      <Styled.Source>
        <Styled.Name>{`${firstName} ${lastName}`}</Styled.Name>
        {organization && (
          <Styled.Organization>{organization}</Styled.Organization>
        )}
      </Styled.Source>
    );
  }

  renderActionEdit(reportId: string): JSX.Element {
    return (
      <Button
        underlineLabel
        label={this.$t('edit')}
        icon="edit"
        variant="transparentSecondary"
        size="small"
        iconSize="20"
        click={() => this.openEditGrievanceModal(reportId)}
      />
    );
  }

  renderActionView(reportId: string): JSX.Element {
    return (
      <Button
        underlineLabel
        label={this.$t('common.action.view')}
        icon="eye"
        variant="transparentSecondary"
        size="small"
        iconSize="20"
        click={() => this.openViewGrievanceModal(reportId)}
      />
    );
  }

  render(): JSX.Element {
    const canEdit =
      isNull(this.report.assignee) &&
      !this.report.isNoFollowUp &&
      auth.hasReferReport;
    const status = getRiskLevel(this.report.facility);
    return (
      <Styled.Tr isHighlight={canEdit}>
        <Styled.Td>
          {this.report.latestActivityAt
            ? formatDate(this.report.latestActivityAt)
            : '-'}
        </Styled.Td>
        <Styled.Td>{this.renderSource(this.report)}</Styled.Td>
        <Styled.Td>{this.getFacilityName(this.report)}</Styled.Td>
        <Styled.Td>{this.renderAssignee(this.report)}</Styled.Td>
        <Styled.Td>
          <RiskAssessment status={status} isBar />
        </Styled.Td>
        <Styled.Td>
          <Styled.Actions>
            {canEdit && this.renderActionEdit(this.report.id)}
            {!canEdit && this.renderActionView(this.report.id)}
          </Styled.Actions>
        </Styled.Td>
      </Styled.Tr>
    );
  }
}
