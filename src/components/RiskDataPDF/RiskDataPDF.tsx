import { Vue, Component, Prop } from 'vue-property-decorator';
import { get } from 'lodash';
import { DEFAULT_LANGUAGE } from 'config/constants';
import AppModule from 'store/modules/app';
import RiskLabel from 'components/RiskLabel';
import { RiskPreviewTypeEnum } from 'enums/brand';
import IndicatorAndSubIndicator from 'components/IndicatorAndSubIndicator';
import { convertEnumToTranslation } from 'utils/translation';
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

  renderContent(): JSX.Element {
    return (
      <fragment>
        {this.sourceData.map((item) => (
          <fragment>
            <Styled.Content>
              <Styled.Title key={item.category.id}>
                {this.getCategoryName(
                  get(item, 'category.name', ''),
                  get(item, 'category.translation', ''),
                )}
              </Styled.Title>
              <RiskLabel
                hasDot
                level={get(item, 'risk.level', '')}
                text={this.$t(
                  convertEnumToTranslation(get(item, 'risk.level', '')),
                )}
              />
            </Styled.Content>

            <IndicatorAndSubIndicator
              previewType={RiskPreviewTypeEnum.PDF}
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
