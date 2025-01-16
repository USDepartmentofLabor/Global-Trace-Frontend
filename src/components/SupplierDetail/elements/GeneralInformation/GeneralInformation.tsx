import { Component, Vue, Prop } from 'vue-property-decorator';
import { get, isEmpty } from 'lodash';
import { getBusinessLocation } from 'utils/helpers';
import { convertEnumToTranslation } from 'utils/translation';
import { DEFAULT_LANGUAGE } from 'config/constants';
import AppModule from 'store/modules/app';
import * as Styled from './styled';
import TopIssue from './TopIssue';
import ExternalRiskIndicator from './ExternalRiskIndicator';

@Component
export default class GeneralInformation extends Vue {
  @Prop({ required: true }) private supplierData: Auth.Facility;
  @Prop({ required: true }) private openHistory: (issue: Auth.TopIssue) => void;

  get information(): App.Any[] {
    return [
      {
        icon: 'note',
        title: this.$t('business_reg_no'),
        value: this.businessRegisterNumber,
      },
      {
        icon: 'buildings',
        title: this.$t('type'),
        value: get(this.supplierDetailType, 'name', ''),
      },
      {
        icon: 'globe',
        title: this.$t('country'),
        value: this.country,
      },
      {
        icon: 'phone_call',
        title: this.$t('managePartnerPage.phone'),
        value: this.phone,
      },
      {
        icon: 'clipping',
        title: this.$t('certification'),
        value: this.certification,
      },
      {
        icon: 'map_pin',
        title: this.$t('address'),
        value: this.address,
      },
    ];
  }

  get currentLocale(): string {
    return AppModule.locale;
  }

  get riskData(): Auth.RiskData {
    return get(this.supplierData, 'riskData');
  }

  get overallRisk(): Auth.Risk {
    return get(this.riskData, 'overallRisk');
  }

  get supplierDetailType(): Auth.SupplierType {
    return get(this.supplierData, 'type');
  }

  get supplierUsers(): Auth.User[] {
    return get(this.supplierData, 'users');
  }

  get phone(): string {
    return get(this.supplierData, 'firstAdmin.phoneNumber');
  }

  get businessRegisterNumber(): string {
    return get(this.supplierData, 'businessRegisterNumber', '');
  }

  get certification(): string {
    return get(this.supplierData, 'certification', '');
  }

  get address(): string {
    return getBusinessLocation(this.supplierData);
  }

  get country(): string {
    const translation = get(this.supplierData, 'country.translation');
    const countryName = get(this.supplierData, 'country.country', '');

    return this.currentLocale === DEFAULT_LANGUAGE
      ? countryName
      : translation?.[this.currentLocale] || countryName;
  }

  get showTopIssue(): boolean {
    return !isEmpty(this.supplierData.topIssues);
  }

  get showExternalRiskIndicator(): boolean {
    return !isEmpty(this.supplierData.externalRiskIndicators);
  }

  renderOverallRisk(): JSX.Element {
    return (
      <Styled.OverallRisk>
        <Styled.OverallRiskTitle>
          {this.$t('overall_risk')}
        </Styled.OverallRiskTitle>
        <Styled.OverallRiskChartWrapper>
          <Styled.OverallRiskChartDonut />
          <Styled.OverallRiskStickContainer variant={this.overallRisk.level}>
            <Styled.OverallRiskStick />
          </Styled.OverallRiskStickContainer>
        </Styled.OverallRiskChartWrapper>
        <Styled.OverallRiskName>
          {this.$t(convertEnumToTranslation(this.overallRisk.level))}
        </Styled.OverallRiskName>
      </Styled.OverallRisk>
    );
  }

  renderInformation(): JSX.Element {
    return (
      <Styled.Information>
        {this.information.map((item, index) =>
          this.renderInfoItem(item, index),
        )}
      </Styled.Information>
    );
  }

  renderInfoItem(item: App.Any, index: number): JSX.Element {
    return (
      <fragment key={index}>
        {item.value && (
          <Styled.InfoItem>
            {item.icon && (
              <Styled.Icon>
                <font-icon name={item.icon} size="18" color="highland" />
              </Styled.Icon>
            )}
            {item.title && <Styled.InfoTitle>{item.title}</Styled.InfoTitle>}
            <Styled.InfoTitle isBig>{item.value}</Styled.InfoTitle>
          </Styled.InfoItem>
        )}
      </fragment>
    );
  }

  render(): JSX.Element {
    return (
      <Styled.Wrapper>
        <Styled.RiskInformation>
          {this.renderOverallRisk()}
          {this.renderInformation()}
        </Styled.RiskInformation>
        <Styled.CategoryInformation>
          {this.showTopIssue && (
            <TopIssue
              topIssues={this.supplierData.topIssues}
              openHistory={this.openHistory}
            />
          )}
          {this.showExternalRiskIndicator && (
            <ExternalRiskIndicator
              externalRiskIndicators={this.supplierData.externalRiskIndicators}
            />
          )}
        </Styled.CategoryInformation>
      </Styled.Wrapper>
    );
  }
}
