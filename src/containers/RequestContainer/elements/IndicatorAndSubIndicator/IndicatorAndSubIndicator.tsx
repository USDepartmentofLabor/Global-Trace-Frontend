import { Component, Prop, Vue } from 'vue-property-decorator';
import { get, isEmpty } from 'lodash';
import { SeverityEnum } from 'enums/auditor';
import * as Styled from './styled';

@Component
export default class IndicatorAndSubIndicator extends Vue {
  @Prop({ required: true }) readonly laborRisks: GrievanceReport.LaborRisk[];

  getSeverityValue(severity: number): string {
    return SeverityEnum[severity].toLowerCase();
  }

  renderIndicators(): JSX.Element {
    return (
      <fragment>
        {!isEmpty(this.laborRisks) &&
          this.laborRisks.map((item, index) => (
            <Styled.List key={index}>
              <Styled.ListItem isBold>
                <Styled.Severity
                  variant={this.getSeverityValue(item.severity)}
                ></Styled.Severity>
                {get(item, 'indicator.name', '')}
              </Styled.ListItem>
              <Styled.ListItem>
                {get(item, 'subIndicator.name', '')}
              </Styled.ListItem>
            </Styled.List>
          ))}
      </fragment>
    );
  }

  render(): JSX.Element {
    return <Styled.List>{this.renderIndicators()}</Styled.List>;
  }
}
