import { Component, Vue, Prop } from 'vue-property-decorator';
import { filter, get, has, head, isEmpty, isNull, values } from 'lodash';
import {
  CIDAttributesEnum,
  OSIDAttributesEnum,
  RoleAttributeTypeEnum,
} from 'enums/role';
import { getBusinessLocation } from 'utils/helpers';
import TopIssues from 'components/AssessmentPdf/TopIssues';
import ExternalRiskIndicator from 'components/AssessmentPdf/ExternalRiskIndicator';
import FilterInformation from 'components/FilterInformation';
import * as Styled from './styled';

@Component
export default class Assessment extends Vue {
  @Prop({ required: true }) readonly supplierData: Auth.Facility;
  @Prop({ required: true })
  readonly filterParams: FacilityManagement.FilterValues;

  get hasFilter(): boolean {
    return values(this.filterParams).some((value) => !isEmpty(value));
  }

  get information(): App.Any[] {
    return filter(
      [
        {
          title: this.$t('type'),
          value: get(this.supplierDetailType, 'name', ''),
        },
        {
          title: this.$t('pdfPreviewPage.phone'),
          value: this.phoneNumber,
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
    return get(this.supplierData, 'name', '');
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
    return getBusinessLocation(this.supplierData);
  }

  get user(): Auth.User {
    return head(this.supplierData.users);
  }

  get phoneNumber(): string {
    return get(this.supplierData, 'firstAdmin.phoneNumber');
  }

  get topIssues(): Auth.TopIssue[] {
    return this.supplierData.topIssues;
  }

  getExternalRiskIndicatorData(): PDFPreview.ExternalRiskIndicatorGroup[] {
    const countryRisk = this.supplierData.externalRiskIndicators.find((item) =>
      has(item, 'country'),
    );
    const internalRisks = this.supplierData.externalRiskIndicators.filter(
      (item) => has(item, 'good'),
    );
    if (!isEmpty(internalRisks)) {
      return [
        {
          countryRisk,
          riskIndicatorGroup: [
            {
              good: get(head(internalRisks), 'good', ''),
              riskIndicators: internalRisks,
            },
          ],
        },
      ];
    }
    return [];
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

  renderInformation(): JSX.Element {
    return (
      <Styled.BreakInside>
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
        <Styled.InfoTitle>{item.title}</Styled.InfoTitle>
        {item.value}
      </Styled.InfoItem>
    );
  }

  renderExternalRiskIndicator() {
    const previewData = this.getExternalRiskIndicatorData();
    return <ExternalRiskIndicator data={previewData} />;
  }

  renderFilter() {
    if (this.hasFilter) {
      return (
        <Styled.Container>
          <Styled.Header>
            <Styled.Label>{this.$t('filter')}</Styled.Label>
          </Styled.Header>
          <Styled.Information>
            <FilterInformation filterParams={this.filterParams} />
          </Styled.Information>
        </Styled.Container>
      );
    }
  }

  render(): JSX.Element {
    return (
      <Styled.Wrapper>
        <Styled.Container>
          <Styled.Header>
            <Styled.Label>{this.$t('general_information')}</Styled.Label>
            <Styled.Name>{this.name}</Styled.Name>
          </Styled.Header>
          {this.renderInformation()}
        </Styled.Container>
        {this.renderFilter()}
        <TopIssues topIssues={this.topIssues} />
        {this.renderExternalRiskIndicator()}
      </Styled.Wrapper>
    );
  }
}
