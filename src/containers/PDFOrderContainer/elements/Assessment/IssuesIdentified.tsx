import { Vue, Component, Prop } from 'vue-property-decorator';
import { get, isEmpty } from 'lodash';
import { getCategoryName } from 'utils/translation';
import * as Styled from './styled';

@Component
export default class IssuesIdentified extends Vue {
  @Prop({ required: true }) topFiveIssues: PDFPreview.TopFiveIssue[];

  renderIssue(issue: PDFPreview.TopFiveIssue, key: number): JSX.Element {
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
      <Styled.Issue>
        <Styled.Order level={issue.risk.level}>{key + 1}</Styled.Order>
        <Styled.IssueContent>
          <Styled.Type>{category}</Styled.Type>
          <Styled.Label
            domProps={{
              innerHTML: this.$t('issues_identified_value', {
                name: indicatorName,
                value: subIndicatorName,
              }),
            }}
          />
        </Styled.IssueContent>
      </Styled.Issue>
    );
  }
  render(): JSX.Element {
    if (!isEmpty(this.topFiveIssues)) {
      return (
        <Styled.Issues>
          <Styled.Heading>
            {this.$t('issues_identified', { value: this.topFiveIssues.length })}
          </Styled.Heading>
          <Styled.IssuesBody>
            {this.topFiveIssues.map((issue, key) =>
              this.renderIssue(issue, key),
            )}
          </Styled.IssuesBody>
        </Styled.Issues>
      );
    }
  }
}
