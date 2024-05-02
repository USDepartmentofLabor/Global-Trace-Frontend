import { Vue, Component, Prop } from 'vue-property-decorator';
import { formatDate } from 'utils/date';
import { TransformUserRoleEnum } from 'enums/user';
import Dropdown from 'components/FormUI/Dropdown';
import * as Styled from './styled';

@Component
export default class Assignee extends Vue {
  @Prop({ default: null }) selectedAssignee: Auth.User[];
  @Prop({ default: [] }) assignees: Auth.User[];
  @Prop({ required: true }) isSubmitting: boolean;
  @Prop({ required: true }) changeAssignee: (user: Auth.User) => void;

  getAwaitingReportMessage(totalAwaitingReports: number): string {
    if (totalAwaitingReports === 0) {
      return this.$t('no_pending_requests');
    } else if (totalAwaitingReports === 1) {
      return this.$t('one_report_awaiting_response');
    }
    return this.$t('reports_awaiting_response', {
      value: totalAwaitingReports,
    });
  }

  renderOptionAssignee(option: Auth.User): JSX.Element {
    if (!option.role) {
      return (
        <Styled.Assignee>
          <Styled.Content>
            <Styled.Label>{option.name}</Styled.Label>
          </Styled.Content>
        </Styled.Assignee>
      );
    }
    const role = option.role.name;
    return (
      <Styled.Assignee>
        <Styled.Content>
          <Styled.Role>{TransformUserRoleEnum[role]}</Styled.Role>
          <Styled.Value>{option.email}</Styled.Value>
          <Styled.Label>
            <text-direction>
              {this.getAwaitingReportMessage(option.totalAwaitingReports)}
            </text-direction>
          </Styled.Label>
        </Styled.Content>
        <Styled.Content>
          <Styled.Value isBlur>{this.$t('last_activity')}</Styled.Value>
          <Styled.Value>
            {option.latestActivityAt && formatDate(option.latestActivityAt)}
          </Styled.Value>
        </Styled.Content>
      </Styled.Assignee>
    );
  }

  render(): JSX.Element {
    return (
      <Dropdown
        label="email"
        title={this.$t('createReportModal.assign')}
        height="48px"
        options={this.assignees}
        width="100%"
        value={this.selectedAssignee}
        changeOptionValue={this.changeAssignee}
        placeholder={this.$t('createReportModal.assign_placeholder')}
        disabled={this.isSubmitting}
        overflow
        allowEmpty={false}
        scopedSlots={{
          optionBody: this.renderOptionAssignee,
        }}
      />
    );
  }
}
