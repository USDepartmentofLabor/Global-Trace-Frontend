import { Vue, Component, Prop } from 'vue-property-decorator';
import { chunk, get, isEmpty } from 'lodash';
import { currentTimestamp, formatDate } from 'utils/date';
import PDFHeader from 'components/PDFHeader';
import { RoleTypeEnum } from 'enums/role';
import { getBusinessLocation } from 'utils/helpers';
import { convertEnumToTranslation } from 'utils/translation';
import TraceOrderPdfMap from 'components/SupplierMap/TraceOrderPdfMap';
import TopIssues from 'components/AssessmentPdf/TopIssues';
import ExternalRiskIndicator from 'components/AssessmentPdf/ExternalRiskIndicator';
import RiskLabel from 'components/RiskLabel';
import { LevelRiskCategoryEnum } from 'enums/saq';
import SupplierMappingDetail from './SupplierMappingDetail';
import IssuesIdentified from './IssuesIdentified';
import * as Styled from './styled';

@Component
export default class Assessment extends Vue {
  @Prop({ default: null }) assessment: PDFPreview.Assessment;
  @Prop({ default: null }) supplierData: Auth.Facility;
  @Prop({ default: [] })
  traceMappingSuppliers: BrandSupplier.TraceProductData;
  @Prop({ default: [] }) traceResultList: BrandSupplier.SupplierItem[];
  @Prop({ default: [] }) tiers: SupplyChain.SupplyChainTier[];

  private traceOrderData: BrandSupplier.TraceSupplierMapGroup[] = [];

  get order(): BrandProduct.Order {
    return get(this.assessment, 'order');
  }

  get riskLevels(): PDFPreview.AssessmentRiskLevel[] {
    const riskLevels = get(this.assessment, 'countByRiskLevel', []);

    return riskLevels.filter(
      ({ riskLevel }) => riskLevel !== LevelRiskCategoryEnum.NO_WEIGHT,
    );
  }

  get supplierName(): string {
    return get(this.supplierData, 'name', '');
  }

  get isBrand(): boolean {
    return get(this.supplierData, 'type.type', '') === RoleTypeEnum.BRAND;
  }

  get dateRequested(): string {
    return formatDate(currentTimestamp());
  }

  get orderInfo() {
    return [
      {
        label: this.$t('purchase_order_number'),
        value: get(this.order, 'purchaseOrderNumber', ''),
      },
      {
        label: this.$t('purchase_date'),
        value: formatDate(get(this.order, 'purchasedAt', 0)),
      },
      {
        label: this.$t('brandOrderPage.product_description'),
        value: get(this.order, 'productDescription', ''),
      },
      {
        label: this.$t('brandOrderPage.quantity'),
        value: get(this.order, 'quantity', 0),
      },

      {
        label: this.$t('invoice_number'),
        value: get(this.order, 'invoiceNumber', 0),
      },

      {
        label: this.$t('package_list_number'),
        value: get(this.order, 'packingListNumber', 0),
      },
    ];
  }

  get supplierInfo() {
    return [
      {
        label: this.$t('type'),
        value: get(this.supplierData, 'type.name', ''),
      },
      {
        label: this.$t('brandSupplierPage.register_number'),
        value: get(this.supplierData, 'businessRegisterNumber', ''),
      },
      {
        label: this.$t('pdfPreviewPage.phone_number'),
        value: get(this.supplierData, 'phoneNumber', ''),
      },
      {
        label: this.$t('address'),
        value: getBusinessLocation(this.supplierData),
      },
    ];
  }

  created() {
    this.initTraceOrderData();
  }

  initTraceOrderData() {
    const { name, logo, mappingSuppliers } = this.traceMappingSuppliers;
    if (this.isBrand && !isEmpty(mappingSuppliers)) {
      const rootIndex = mappingSuppliers.findIndex(({ isRoot }) => isRoot);
      mappingSuppliers[rootIndex].isRoot = false;
      (mappingSuppliers[rootIndex].targets as BrandSupplier.Target[]).unshift({
        hasBrokerIcon: false,
        targetId: name,
      });
      mappingSuppliers.unshift({
        name,
        logo,
        id: name,
        isRoot: true,
        isTier: false,
        label: '',
        icon: '',
        orderSupplierId: name,
        targets: [],
        type: null,
      });
    }
    this.traceOrderData = mappingSuppliers;
  }

  renderPreparedFor(): JSX.Element {
    const supplierInfo = chunk(this.supplierInfo, this.supplierInfo.length / 2);
    return (
      <Styled.AssessmentContent>
        <Styled.Col padding isRow background>
          <Styled.Label bold>
            {this.$t('pdfPreviewPage.prepared_for')}
          </Styled.Label>
          <Styled.Content bold>{this.supplierName}</Styled.Content>
        </Styled.Col>
        <Styled.Row borderTop>
          {supplierInfo.map((group, index) => (
            <Styled.Row gap="4px" padding isColumn borderLeft={index % 2 === 1}>
              {group.map((info) => (
                <Styled.Col isRow>
                  <Styled.Label>{info.label}</Styled.Label>
                  <Styled.Content>{info.value}</Styled.Content>
                </Styled.Col>
              ))}
            </Styled.Row>
          ))}
        </Styled.Row>
      </Styled.AssessmentContent>
    );
  }

  renderDateRequested(): JSX.Element {
    const orderInfo = chunk(this.orderInfo, this.orderInfo.length / 2);
    return (
      <Styled.AssessmentContent>
        <Styled.Col padding borderTop isRow background>
          <Styled.Label bold>
            {this.$t('pdfPreviewPage.date_requested')}
          </Styled.Label>
          <Styled.Content bold>{this.dateRequested}</Styled.Content>
        </Styled.Col>
        <Styled.Row borderTop>
          {orderInfo.map((group, index) => (
            <Styled.Row gap="4px" padding isColumn borderLeft={index % 2 === 1}>
              {group.map((info) => (
                <Styled.Col isRow>
                  <Styled.Label>{info.label}</Styled.Label>
                  <Styled.Content>{info.value}</Styled.Content>
                </Styled.Col>
              ))}
            </Styled.Row>
          ))}
        </Styled.Row>
      </Styled.AssessmentContent>
    );
  }

  renderAssessmentInformation(): JSX.Element {
    return (
      <Styled.AssessmentInformation>
        {this.renderPreparedFor()}
        {this.renderDateRequested()}
      </Styled.AssessmentInformation>
    );
  }

  renderDocumentPurpose(): JSX.Element {
    return (
      <Styled.DocumentPurpose>
        <Styled.PurposeInformation>
          <Styled.Heading>
            {this.$t('pdfPreviewPage.document_purpose')}
          </Styled.Heading>
          <Styled.PurposeContent>
            <Styled.PurposeText>
              {this.$t('pdfPreviewPage.document_purpose_desc_first')}
            </Styled.PurposeText>
            <Styled.PurposeText>
              {this.$t('pdfPreviewPage.document_purpose_desc_second')}
            </Styled.PurposeText>
          </Styled.PurposeContent>
        </Styled.PurposeInformation>
        <Styled.PurposeBody>
          <Styled.PurposeText>
            {this.$t('pdfPreviewPage.purpose_sub_desc')}
          </Styled.PurposeText>
          <Styled.RiskLevelResponse>
            {this.riskLevels.map(
              (riskLevel: PDFPreview.AssessmentRiskLevel, index: number) => (
                <Styled.LevelWrapper key={index}>
                  <RiskLabel
                    hasDot
                    level={riskLevel.riskLevel}
                    text={this.$t(
                      convertEnumToTranslation(riskLevel.riskLevel),
                    )}
                  />
                  <Styled.LevelFacility>
                    {riskLevel.count < 2
                      ? this.$t('value_facility', {
                          value: riskLevel.count,
                        })
                      : this.$t('value_facilities', {
                          value: riskLevel.count,
                        })}
                  </Styled.LevelFacility>
                </Styled.LevelWrapper>
              ),
            )}
          </Styled.RiskLevelResponse>
        </Styled.PurposeBody>
      </Styled.DocumentPurpose>
    );
  }

  render(): JSX.Element {
    return (
      <Styled.Wrapper>
        <PDFHeader title={this.$t('assessment')} page="01" />
        <fragment>
          {this.renderAssessmentInformation()}
          {this.renderDocumentPurpose()}
          <IssuesIdentified topFiveIssues={this.assessment.topFiveIssues} />
          <Styled.Group>
            <TopIssues topIssues={this.assessment.topFourIssues} />
          </Styled.Group>
          <Styled.Group>
            <ExternalRiskIndicator
              data={this.assessment.externalRiskIndicators}
            />
          </Styled.Group>
          <Styled.MapContainer>
            <PDFHeader
              title={this.$t('product_tracing_labor_risk')}
              page="02"
            />
            <Styled.Text>
              {this.$t('pdfPreviewPage.assessment_text')}
            </Styled.Text>
            <TraceOrderPdfMap
              direction="left"
              data={this.traceOrderData}
              tiers={this.tiers}
            />
            <SupplierMappingDetail traceResultList={this.traceResultList} />
          </Styled.MapContainer>
        </fragment>
      </Styled.Wrapper>
    );
  }
}
