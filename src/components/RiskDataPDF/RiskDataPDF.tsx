import { Vue, Component, Prop } from 'vue-property-decorator';
import { get } from 'lodash';
import { DEFAULT_LANGUAGE } from 'config/constants';
import AppModule from 'store/modules/app';
import RiskLabel from 'components/RiskLabel';
import IndicatorAndSubIndicator from 'components/IndicatorAndSubIndicator';
import * as Styled from './styled';

@Component
export default class RiskDataPDF extends Vue {
  @Prop({ required: true }) readonly sourceData: Auth.SupplierData[];

  get currentLocale(): string {
    return AppModule.locale;
  }

  getCategoryName(
    name: string,
    translation: {
      [x: string]: string;
    },
  ): string {
    return this.currentLocale === DEFAULT_LANGUAGE
      ? name
      : translation[this.currentLocale] || name;
  }

  renderSources(sourceRiskData: Auth.SourceRiskData[]): JSX.Element {
    return (
      <Styled.Sources>
        {sourceRiskData.map((item) => (
          <RiskLabel level={item.risk.level} text={item.source} />
        ))}
      </Styled.Sources>
    );
  }

  renderContent(): JSX.Element {
    return (
      <fragment>
        {this.sourceData.map((item) => (
          <fragment>
            <Styled.Title
              key={item.category.id}
              level={get(item, 'risk.level', '')}
            >
              {this.getCategoryName(
                get(item, 'category.name', ''),
                get(item, 'category.translation', ''),
              )}
            </Styled.Title>
            {this.renderSources(item.sourceRiskData)}
            <IndicatorAndSubIndicator
              isExpanded
              indicatorRiskData={item.indicatorRiskData}
            />
          </fragment>
        ))}
      </fragment>
    );
  }

  render(): JSX.Element {
    return <Styled.Wrapper>{this.renderContent()}</Styled.Wrapper>;
  }
}
