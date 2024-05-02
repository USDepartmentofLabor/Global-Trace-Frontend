import { Component, Vue, Prop } from 'vue-property-decorator';
import { get, head, isEmpty } from 'lodash';
import RiskCard from 'components/RiskCard';
import RiskDataPDF from 'components/RiskDataPDF';
import { getBusinessLocation } from 'utils/helpers';
import * as Styled from './styled';

@Component
export default class RiskInformation extends Vue {
  @Prop({ required: true }) readonly supplierData: Auth.Facility;

  get risks(): Auth.ViewRisk[] {
    return [
      {
        title: this.$t('overall_risk'),
        risk: this.overallRisk,
      },
      {
        title: this.$t('country_risk'),
        risk: this.countryRisk,
      },
    ];
  }

  get information(): App.Any[] {
    return [
      {
        title: this.$t('type'),
        value: get(this.supplierDetailType, 'name', ''),
      },
      {
        title: this.$t('pdfPreviewPage.phone_number'),
        value: this.phoneNumber,
      },
      {
        title: this.$t('address'),
        value: this.address,
      },
      {
        title: this.$t('os_id'),
        value: this.osId,
      },
      {
        title: this.$t('business_reg_number'),
        value: this.businessRegisterNumber,
      },
    ];
  }

  get name(): string {
    return get(this.supplierData, 'name', '');
  }

  get riskData(): Auth.RiskData {
    return get(this.supplierData, 'riskData');
  }

  get overallRisk(): Auth.Risk {
    return get(this.riskData, 'overallRisk');
  }

  get countryRisk(): Auth.Risk {
    return get(this.riskData, 'countryRisk');
  }

  get supplierDetailType(): Auth.SupplierType {
    return get(this.supplierData, 'type');
  }

  get businessRegisterNumber(): string {
    return get(this.supplierData, 'businessRegisterNumber', '');
  }

  get address(): string {
    return getBusinessLocation(this.supplierData);
  }

  get osId(): string {
    return get(this.supplierData, 'oarId', '');
  }

  get user(): Auth.User {
    return head(this.supplierData.users);
  }

  get phoneNumber(): string {
    return get(this.user, 'phoneNumber');
  }

  get sourceData(): Auth.SupplierData[] {
    return get(this.riskData, 'data');
  }

  renderName(): JSX.Element {
    return <Styled.Title>{this.name}</Styled.Title>;
  }

  renderInformation(): JSX.Element {
    return (
      <Styled.BreakInside>
        <Styled.InformationTitle>
          {this.$t('general_information')}
        </Styled.InformationTitle>
        <Styled.Information>
          {this.information.map((item, index) =>
            this.renderInfoItem(item, index),
          )}
        </Styled.Information>
      </Styled.BreakInside>
    );
  }

  renderInfoItem(item: App.Any, index: number): JSX.Element {
    return (
      <Styled.InfoItem key={index}>
        <Styled.InfoTitle>{item.title}:</Styled.InfoTitle>
        {item.value}
      </Styled.InfoItem>
    );
  }

  renderEmptyIndicator(): JSX.Element {
    return (
      <Styled.Empty>
        <font-icon name="check_circle" color="highland" size="48" />
        {this.$t('empty_supplier_message')}
      </Styled.Empty>
    );
  }

  render(): JSX.Element {
    return (
      <Styled.Wrapper>
        {this.renderName()}
        {this.renderInformation()}
        <Styled.RiskCard>
          <RiskCard risks={this.risks} isGrid={false} />
        </Styled.RiskCard>
        {isEmpty(this.sourceData) && this.renderEmptyIndicator()}
        {!isEmpty(this.sourceData) && (
          <RiskDataPDF sourceData={this.sourceData} />
        )}
      </Styled.Wrapper>
    );
  }
}
