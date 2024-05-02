import { Vue, Component, Prop } from 'vue-property-decorator';
import IndicatorAndSubIndicator from 'components/IndicatorAndSubIndicator';
import RiskLabel from 'components/RiskLabel';
import * as Styled from './styled';

@Component
export default class TabContent extends Vue {
  @Prop({ required: true })
  readonly indicatorRiskData: Auth.IndicatorRiskData[];
  @Prop({ required: true })
  readonly sourceRiskData: Auth.SourceRiskData[];

  renderSources(): JSX.Element {
    return (
      <Styled.Sources>
        {this.sourceRiskData.map((item) => (
          <RiskLabel level={item.risk.level} text={item.source} />
        ))}
      </Styled.Sources>
    );
  }

  render(): JSX.Element {
    return (
      <Styled.Wrapper>
        <Styled.Content>
          <Styled.ReportSource>{this.$t('report_sources')}</Styled.ReportSource>
          {this.renderSources()}
        </Styled.Content>
        <IndicatorAndSubIndicator indicatorRiskData={this.indicatorRiskData} />
      </Styled.Wrapper>
    );
  }
}
