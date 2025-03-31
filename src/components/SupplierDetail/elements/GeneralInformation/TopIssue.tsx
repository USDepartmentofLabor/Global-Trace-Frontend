import { Component, Vue, Prop } from 'vue-property-decorator';
import { get, map } from 'lodash';
import { getCategoryIcons } from 'utils/category-icon-helper';
import { getCategoryName } from 'utils/translation';
import RiskLabel from 'components/RiskLabel';
import resources from 'config/resources';
import * as Styled from './styled';

@Component
export default class TopIssue extends Vue {
  @Prop({ required: true }) private topIssues: Auth.TopIssue[];
  @Prop({ required: true }) private openHistory: (issue: Auth.TopIssue) => void;

  get resourceIcons(): App.DropdownOption[] {
    return getCategoryIcons();
  }

  getIconSrc(iconId: string): string {
    const icon = this.resourceIcons.find(({ id }) => id === iconId);
    if (icon && icon.icon) {
      return get(resources, icon.icon, '');
    }
    return '';
  }

  renderIssue(issue: Auth.TopIssue): JSX.Element {
    const iconSource = this.getIconSrc(
      get(issue, 'indicator.category.icon', null),
    );
    const indicatorName = getCategoryName(
      get(issue, 'indicator.name', ''),
      get(issue, 'indicator.translation'),
    );
    const subIndicatorName = getCategoryName(
      get(issue, 'subIndicator.name', ''),
      get(issue, 'subIndicator.translation'),
    );
    const categoryName = getCategoryName(
      get(issue, 'indicator.category.name', ''),
      get(issue, 'indicator.category.translation'),
    );
    const level = get(issue, 'risk.level', '');
    return (
      <Styled.CardBox variant={level} vOn:click={() => this.openHistory(issue)}>
        <Styled.CardBoxBody>
          {iconSource && (
            <Styled.CategoryIcon
              size="96px"
              domProps={{
                src: iconSource,
              }}
            />
          )}
          {!iconSource && (
            <font-icon name="warning" size="120" color="alizarinCrimson" />
          )}
          <Styled.CardBoxInfo>
            <Styled.IndicatorName>{indicatorName}</Styled.IndicatorName>
            <Styled.SubIndicatorName>
              {subIndicatorName}
            </Styled.SubIndicatorName>
          </Styled.CardBoxInfo>
        </Styled.CardBoxBody>
        <Styled.CardBoxFooter>
          <RiskLabel level={level} hasDot />
          <Styled.CategoryName>{categoryName}</Styled.CategoryName>
          <font-icon name="arrow_right" size="24" color="highland" />
        </Styled.CardBoxFooter>
      </Styled.CardBox>
    );
  }

  render(): JSX.Element {
    return (
      <Styled.Card width="70%">
        <Styled.CardHead>
          <Styled.CardHeadColumn>
            <Styled.TopIssueIcon />
            <Styled.CardTitle>
              {this.topIssues.length < 2
                ? this.$t('top_issue_identified', {
                    value: this.topIssues.length,
                  })
                : this.$t('top_issues_identified', {
                    value: this.topIssues.length,
                  })}
            </Styled.CardTitle>
          </Styled.CardHeadColumn>
        </Styled.CardHead>
        <Styled.CardBody>
          {map(this.topIssues, (issue) => this.renderIssue(issue))}
        </Styled.CardBody>
      </Styled.Card>
    );
  }
}
