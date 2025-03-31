import { Vue, Component, Prop } from 'vue-property-decorator';
import { get, has, isEmpty } from 'lodash';
import RiskLabel from 'components/RiskLabel';
import { getCategoryName } from 'utils/translation';
import * as Styled from './styled';

@Component
export default class ExternalRiskIndicator extends Vue {
  @Prop({ default: [] }) data: PDFPreview.ExternalRiskIndicatorGroup[];

  renderRiskIndicator(
    group: PDFPreview.ExternalRiskIndicatorGroup,
    riskIndicatorGroup: PDFPreview.RiskIndicatorGroup,
  ): JSX.Element {
    if (!isEmpty(riskIndicatorGroup.riskIndicators)) {
      const countryRiskLevel = get(group, 'countryRisk.risk.level', '');
      const countryName = getCategoryName(
        get(group, 'countryRisk.country.country', ''),
        get(group, 'countryRisk.country.translation'),
      );

      return (
        <fragment>
          {riskIndicatorGroup.riskIndicators.map((riskIndicator) => {
            const level = get(riskIndicator, 'risk.level', '');

            const categoryName = getCategoryName(
              get(riskIndicator, 'category.name', ''),
              get(riskIndicator, 'category.translation'),
            );
            return (
              <Styled.TableRow>
                <Styled.TableCell>
                  <Styled.RiskIndicator>
                    <RiskLabel
                      hasDot
                      text={this.$t('country_based_risk')}
                      level={countryRiskLevel}
                      isUppercase={false}
                    />
                    <Styled.Text>{countryName}</Styled.Text>
                  </Styled.RiskIndicator>
                </Styled.TableCell>
                <Styled.TableCell>
                  <Styled.RiskIndicator>
                    <RiskLabel
                      hasDot
                      text={categoryName}
                      level={level}
                      isUppercase={false}
                    />
                    <Styled.Text>{riskIndicator.good}</Styled.Text>
                  </Styled.RiskIndicator>
                </Styled.TableCell>
              </Styled.TableRow>
            );
          })}
        </fragment>
      );
    }
  }

  renderEmptyRisk(group: PDFPreview.ExternalRiskIndicatorGroup): JSX.Element {
    const countryRiskLevel = get(group, 'countryRisk.risk.level', '');
    const countryName = getCategoryName(
      get(group, 'countryRisk.country.country', ''),
      get(group, 'countryRisk.country.translation'),
    );

    if (has(group, 'countryRisk.country')) {
      return (
        <Styled.Table>
          <Styled.TableRow>
            <Styled.TableCell>
              <Styled.RiskIndicator>
                <RiskLabel
                  hasDot
                  text={this.$t('country_based_risk')}
                  level={countryRiskLevel}
                  isUppercase={false}
                />
                <Styled.Text>{countryName}</Styled.Text>
              </Styled.RiskIndicator>
            </Styled.TableCell>
          </Styled.TableRow>
        </Styled.Table>
      );
    }
  }

  renderContent(group: PDFPreview.ExternalRiskIndicatorGroup): JSX.Element {
    if (isEmpty(group.riskIndicatorGroup)) {
      return this.renderEmptyRisk(group);
    }
    return (
      <Styled.Table isGroup>
        {group.riskIndicatorGroup.map((item) =>
          this.renderRiskIndicator(group, item),
        )}
      </Styled.Table>
    );
  }

  render(): JSX.Element {
    const hasData = this.data.some(
      ({ riskIndicatorGroup }) => !isEmpty(riskIndicatorGroup),
    );
    if (!isEmpty(this.data) && hasData) {
      return (
        <Styled.Group>
          <Styled.Title>{this.$t('external_risk_indicators')}</Styled.Title>
          {this.data.map((group) => this.renderContent(group))}
        </Styled.Group>
      );
    }
  }
}
