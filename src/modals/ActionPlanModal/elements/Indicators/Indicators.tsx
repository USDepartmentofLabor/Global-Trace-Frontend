import { Vue, Component, Prop } from 'vue-property-decorator';
import { map, get } from 'lodash';
import { getCategoryName } from 'utils/translation';
import { formatDate } from 'utils/date';
import { DATE_FORMAT } from 'config/constants';
import RiskLabel from 'components/RiskLabel';
import * as Styled from './styled';

@Component
export default class Indicators extends Vue {
  @Prop({ required: true })
  readonly indicatorRiskData: Auth.IndicatorRiskData[];

  renderSubIndicatorContent(content: Auth.SubIndicatorData): JSX.Element {
    const source = get(content, 'source', '');
    const riskLevel = get(content, ['risk', 'level']);
    const date = formatDate(
      get(content, 'createdAt', '') as number,
      DATE_FORMAT,
    );
    return (
      <Styled.RiskContent key={content.capId}>
        <Styled.RiskItem>
          <Styled.RiskInfo>
            <Styled.Tag level={riskLevel}>{source}</Styled.Tag>
            <Styled.RiskDate>{date}</Styled.RiskDate>
          </Styled.RiskInfo>
          <Styled.ReportContent
            domProps={{ innerHTML: get(content, 'note', '') }}
          />
        </Styled.RiskItem>
      </Styled.RiskContent>
    );
  }

  renderSubIndicator(subIndicator: Auth.SubIndicatorRiskData): JSX.Element {
    const riskLevel = get(subIndicator, ['risk', 'level']);
    const name = get(subIndicator, 'subIndicator.name', '');
    const translation = get(subIndicator, 'subIndicator.translation', '');
    return (
      <Styled.SubIndicator level={riskLevel}>
        <Styled.SubIndicatorTitle level={riskLevel}>
          <RiskLabel level={get(subIndicator, ['risk', 'level'])} hasDot />
          <Styled.RiskTitle>
            {getCategoryName(name, translation)}
          </Styled.RiskTitle>
        </Styled.SubIndicatorTitle>
        <Styled.SubIndicatorContent>
          {map(subIndicator.data, this.renderSubIndicatorContent)}
        </Styled.SubIndicatorContent>
      </Styled.SubIndicator>
    );
  }

  renderIndicatorContent(indicator: Auth.IndicatorRiskData): JSX.Element {
    const riskLevel = get(indicator, ['risk', 'level']);
    return (
      <Styled.IndicatorContent level={riskLevel}>
        {map(indicator.subIndicatorRiskData, this.renderSubIndicator)}
      </Styled.IndicatorContent>
    );
  }

  renderIndicator(indicator: Auth.IndicatorRiskData): JSX.Element {
    const id = get(indicator, ['indicator', 'id']);
    const riskLevel = get(indicator, ['risk', 'level']);
    const name = get(indicator, 'indicator.name', '');
    const translation = get(indicator, 'indicator.translation', '');
    return (
      <Styled.Indicator key={id}>
        <Styled.RiskLabel level={riskLevel} />
        <Styled.IndicatorTitle>
          {getCategoryName(name, translation)}
        </Styled.IndicatorTitle>
        {this.renderIndicatorContent(indicator)}
      </Styled.Indicator>
    );
  }

  render(): JSX.Element {
    return (
      <Styled.Wrapper>
        {map(this.indicatorRiskData, this.renderIndicator)}
      </Styled.Wrapper>
    );
  }
}
