import { Vue, Component, Prop } from 'vue-property-decorator';
import { formatDate } from 'utils/date';
import DropDown from 'components/FormUI/Dropdown';
import * as Styled from './styled';

@Component
export default class Assignees extends Vue {
  @Prop({ default: false }) isSubmitting: boolean;
  @Prop({ default: false }) isEdit: boolean;
  @Prop({ default: [] }) assignees: Auth.User[];
  @Prop({ default: null }) selectedAssignee: Auth.User;
  @Prop({
    default: () => {
      //
    },
  })
  changeAssignee: (user: Auth.User) => void;

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
    const roleName = option.role.name;
    return (
      <Styled.Assignee>
        <Styled.Content>
          <Styled.Role>{this.$t(roleName)}</Styled.Role>
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
      <DropDown
        label="email"
        title={this.$t('follow_up_actions')}
        height="48px"
        options={this.assignees}
        width="100%"
        value={this.selectedAssignee}
        changeOptionValue={this.changeAssignee}
        placeholder={this.$t('choose_follow_up_actions')}
        disabled={this.isSubmitting || !this.isEdit}
        overflow
        scopedSlots={{
          optionBody: this.renderOptionAssignee,
        }}
      />
    );
  }
}
