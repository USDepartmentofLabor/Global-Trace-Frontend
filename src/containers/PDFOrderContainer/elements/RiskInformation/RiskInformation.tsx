import { Component, Vue, Prop } from 'vue-property-decorator';
import { filter, get, isEmpty, isNull } from 'lodash';
import RiskCard from 'components/RiskCard';
import PDFHeader from 'components/PDFHeader';
import RiskDataPDF from 'components/RiskDataPDF';
import {
  CIDAttributesEnum,
  OSIDAttributesEnum,
  RoleAttributeTypeEnum,
} from 'enums/role';
import * as Styled from './styled';
import Transaction from '../Transaction';

@Component
export default class RiskInformation extends Vue {
  @Prop({ default: null }) data: PDFPreview.TracingObject;
  @Prop({ default: null }) language: string;

  get supplierData(): Auth.Facility {
    return get(this.data, 'supplier', null);
  }

  get roleSupplierData(): Auth.Facility {
    return get(this.data, 'role', null);
  }

  get supplierName(): string {
    return get(this.supplierData, 'name');
  }

  get roleSupplierName(): string {
    return get(this.roleSupplierData, 'name');
  }

  get notLoggedTransactions(): PDFPreview.NotLoggedTransaction[] {
    return get(this.data, 'notLoggedTransactions', []);
  }

  get transactions(): PDFPreview.Transaction[] {
    return get(this.data, 'transactions', []);
  }

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

  get generalInformation(): Array<{ title: string; value: string }> {
    return filter(
      [
        {
          title: this.$t('type'),
          value: get(this.supplierDetailType, 'name', ''),
        },
        {
          title: this.$t('address'),
          value: this.address,
        },
        ...this.getIdentifierSystems(),
        {
          title: this.$t('business_reg_number'),
          value: this.businessRegisterNumber,
        },
      ],
      (item) => !isNull(item),
    );
  }

  get name(): string {
    return (
      this.supplierName ||
      this.$t('non_participating_role', { role: this.roleSupplierName })
    );
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
    const RMAP_ID = get(
      this.supplierData,
      `identifierSystem.${RoleAttributeTypeEnum.RMI_CID}`,
    );
    if (RMAP_ID) {
      const RMAPData = RMAP_ID.find(
        ({ name }: { name: CIDAttributesEnum }) =>
          name === CIDAttributesEnum.ADDRESS,
      );
      if (RMAPData && RMAPData.value) {
        return RMAPData.value;
      }
    }
    return get(this.supplierData, 'address');
  }

  get osId(): string {
    return get(this.supplierData, 'oarId', '');
  }

  get sourceData(): Auth.SupplierData[] {
    return get(this.riskData, 'data');
  }

  getIdentifierSystems(): Array<{ title: string; value: string }> {
    return filter(
      [this.getRMAPIDData(), this.getOSIDData()],
      (item) => !isNull(item),
    );
  }

  getRMAPIDData(): { title: string; value: string } {
    const RMAP_ID = get(
      this.supplierData,
      `identifierSystem.${RoleAttributeTypeEnum.RMI_CID}`,
    );
    if (RMAP_ID) {
      const RMAPData = RMAP_ID.find(
        ({ name }: { name: CIDAttributesEnum }) =>
          name === CIDAttributesEnum.FACILITY_ID,
      );
      if (RMAPData) {
        return {
          title: RMAPData.name,
          value: RMAPData.value,
        };
      }
    }
    return null;
  }

  getOSIDData(): { title: string; value: string } {
    const OSID = get(
      this.supplierData,
      `identifierSystem.${RoleAttributeTypeEnum.OPEN_SUPPLY_HUB_ID}`,
    );
    if (OSID) {
      const OSIDData = OSID.find(
        ({ name }: { name: OSIDAttributesEnum }) =>
          name === OSIDAttributesEnum.OS_ID,
      );
      if (OSIDData) {
        return {
          title: OSIDData.name,
          value: OSIDData.value,
        };
      }
    }
    return null;
  }

  renderName(): JSX.Element {
    return <Styled.Title>{this.name}</Styled.Title>;
  }

  renderInformation(): JSX.Element {
    return (
      <Styled.InformationList>
        <Styled.GeneralInformation>
          <Styled.InformationTitle>
            {this.$t('general_information')}
          </Styled.InformationTitle>
          <Styled.Information>
            {this.generalInformation.map((item, index) =>
              this.renderInfoItem(item, index),
            )}
          </Styled.Information>
        </Styled.GeneralInformation>
        <Styled.OtherInformation>
          <Transaction
            facility={this.supplierData}
            notLoggedTransactions={this.notLoggedTransactions}
            transactions={this.transactions}
          />
        </Styled.OtherInformation>
      </Styled.InformationList>
    );
  }

  renderInfoItem(item: App.Any, index: number): JSX.Element {
    if (item) {
      return (
        <Styled.InfoItem key={index}>
          <Styled.InfoTitle>{item.title}:</Styled.InfoTitle>
          {item.value}
        </Styled.InfoItem>
      );
    }
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
        <PDFHeader title={this.$t('product_tracing_labor_risk')} page="02" />
        <Styled.Container>
          <Styled.Inner>
            {this.renderName()}
            {this.renderInformation()}
            <Styled.RiskCard>
              <RiskCard risks={this.risks} isGrid={false} />
            </Styled.RiskCard>
            {isEmpty(this.sourceData) && this.renderEmptyIndicator()}
            {!isEmpty(this.sourceData) && (
              <RiskDataPDF sourceData={this.sourceData} />
            )}
          </Styled.Inner>
        </Styled.Container>
      </Styled.Wrapper>
    );
  }
}
