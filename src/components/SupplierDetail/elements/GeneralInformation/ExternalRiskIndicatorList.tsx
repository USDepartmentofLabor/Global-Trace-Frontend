/* eslint-disable max-lines-per-function */
import { Component, Vue, Prop } from 'vue-property-decorator';
import { get, map } from 'lodash';
import { getCategoryIcons } from 'utils/category-icon-helper';
import { getCategoryName } from 'utils/translation';
import RiskLabel from 'components/RiskLabel';
import resources from 'config/resources';
import * as Styled from './styled';

@Component
export default class ExternalRiskIndicatorList extends Vue {
  @Prop({ required: true })
  private externalRiskIndicators: Auth.ExternalRiskIndicator[];

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

  renderExternalRiskIndicator(
    externalRiskIndicator: Auth.ExternalRiskIndicator,
  ): JSX.Element {
    const iconSource = this.getIconSrc(
      get(externalRiskIndicator, 'category.icon', null),
    );
    const categoryName = getCategoryName(
      get(externalRiskIndicator, 'category.name', ''),
      get(externalRiskIndicator, 'category.translation'),
    );
    const countryName = get(externalRiskIndicator, 'country.country', '');
    const goods = get(externalRiskIndicator, 'good');
    const level = get(externalRiskIndicator, 'risk.level', '');
    return (
      <Styled.ExternalRiskIndicator>
        <Styled.ExternalRiskIndicatorInfo>
          {iconSource && (
            <Styled.CategoryIcon
              size="44px"
              domProps={{
                src: iconSource,
              }}
            />
          )}
          {!iconSource && (
            <font-icon name="warning" size="44" color="alizarinCrimson" />
          )}
          <Styled.ExternalRiskCategory>
            <Styled.SubIndicatorName>{categoryName}</Styled.SubIndicatorName>
            <Styled.IndicatorName>{countryName || goods}</Styled.IndicatorName>
          </Styled.ExternalRiskCategory>
          <RiskLabel level={level} hasDot />
        </Styled.ExternalRiskIndicatorInfo>
      </Styled.ExternalRiskIndicator>
    );
  }

  render(): JSX.Element {
    return (
      <fragment>
        {map(this.externalRiskIndicators, (item) =>
          this.renderExternalRiskIndicator(item),
        )}
      </fragment>
    );
  }
}
