import { Vue, Component, Prop } from 'vue-property-decorator';
import { chunk, get, isEmpty, map } from 'lodash';
import { getCategoryName } from 'utils/translation';
import RiskLabel from 'components/RiskLabel';
import * as Styled from './styled';

@Component
export default class TopIssues extends Vue {
  @Prop({ default: [] }) topIssues: Auth.TopIssue[];

  renderIssue(issue: Auth.TopIssue): JSX.Element {
    const risk = get(issue, 'risk.level', '');
    const category = getCategoryName(
      get(issue, 'indicator.category.name', ''),
      get(issue, 'indicator.category.translation'),
    );
    const indicatorName = getCategoryName(
      get(issue, 'indicator.name', ''),
      get(issue, 'indicator.translation'),
    );
    const subIndicatorName = getCategoryName(
      get(issue, 'subIndicator.name', ''),
      get(issue, 'subIndicator.translation'),
    );
    return (
      <Styled.TableCell>
        <Styled.Issue>
          <RiskLabel hasDot level={risk} text={category} isUppercase={false} />
          <Styled.Report
            domProps={{
              innerHTML: this.$t('issues_identified_value', {
                name: indicatorName,
                value: subIndicatorName,
              }),
            }}
          ></Styled.Report>
        </Styled.Issue>
      </Styled.TableCell>
    );
  }

  renderTopIssue(issues: Auth.TopIssue[]): JSX.Element {
    return (
      <Styled.TableRow>
        {map(issues, (issue) => this.renderIssue(issue))}
      </Styled.TableRow>
    );
  }

  render(): JSX.Element {
    if (!isEmpty(this.topIssues)) {
      const group = chunk(this.topIssues, 2);
      return (
        <Styled.Group>
          <Styled.Title>
            {this.topIssues.length < 2
              ? this.$t('top_issue_identified', {
                  value: this.topIssues.length,
                })
              : this.$t('top_issues_identified', {
                  value: this.topIssues.length,
                })}
          </Styled.Title>
          <Styled.Table>
            {group.map((issues) => this.renderTopIssue(issues))}
          </Styled.Table>
        </Styled.Group>
      );
    }
  }
}
