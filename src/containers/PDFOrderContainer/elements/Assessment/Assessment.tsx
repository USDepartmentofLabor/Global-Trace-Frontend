import { Vue, Component, Prop } from 'vue-property-decorator';
import { get } from 'lodash';
import { currentTimestamp, formatDate } from 'utils/date';
import Header from 'components/PDFHeader';
import { getBusinessLocation } from 'utils/helpers';
import TraceOrderPdfMap from 'components/SupplierMap/TraceOrderPdfMap';
import SupplierMappingDetail from './SupplierMappingDetail';
import IssuesIdentified from './IssuesIdentified';
import * as Styled from './styled';

@Component
export default class Assessment extends Vue {
  @Prop({ default: null }) assessment: PDFPreview.Assessment;
  @Prop({ default: null }) supplierData: Auth.Facility;
  @Prop({ default: [] }) traceMappingSuppliers: BrandSupplier.SupplierItem[];
  @Prop({ default: [] }) traceResultList: BrandSupplier.SupplierItem[];

  get order(): BrandProduct.Order {
    return get(this.assessment, 'order');
  }

  get riskLevels(): PDFPreview.AssessmentRiskLevel[] {
    return get(this.assessment, 'countByRiskLevel', []);
  }

  get supplierName(): string {
    return get(this.supplierData, 'name', '');
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

  renderAssessmentInformation(): JSX.Element {
    return (
      <Styled.AssessmentInformation>
        <Styled.AssessmentContent>
          <Styled.Col width={150}>
            <Styled.Label>
              {this.$t('pdfPreviewPage.prepared_for')}
            </Styled.Label>
            <Styled.Content>{this.supplierName}</Styled.Content>
          </Styled.Col>
          <Styled.Row>
            <Styled.Col width={200}>
              {this.supplierInfo.map((info) => (
                <Styled.Label>{info.label}</Styled.Label>
              ))}
            </Styled.Col>
            <Styled.Col>
              {this.supplierInfo.map((info) => (
                <Styled.Content>{info.value}</Styled.Content>
              ))}
            </Styled.Col>
          </Styled.Row>
        </Styled.AssessmentContent>
        <Styled.AssessmentContent>
          <Styled.Col borderTop width={150}>
            <Styled.Label>
              {this.$t('pdfPreviewPage.date_requested')}
            </Styled.Label>
            <Styled.Content>{this.dateRequested}</Styled.Content>
          </Styled.Col>
          <Styled.Row>
            <Styled.Col borderTop width={200}>
              {this.orderInfo.map((info) => (
                <Styled.Label>{info.label}</Styled.Label>
              ))}
            </Styled.Col>
            <Styled.Col borderTop>
              {this.orderInfo.map((info) => (
                <Styled.Content>{info.value}</Styled.Content>
              ))}
            </Styled.Col>
          </Styled.Row>
        </Styled.AssessmentContent>
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
                  <Styled.LevelTitle level={riskLevel.riskLevel}>
                    {riskLevel.riskLevel}
                  </Styled.LevelTitle>
                  <Styled.Status>
                    <Styled.LevelScore level={riskLevel.riskLevel} />
                  </Styled.Status>
                  <Styled.LevelFacility>
                    {this.$t('value_facilities', {
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
        <Header title={this.$t('assessment')} pageNumber="01" />
        <fragment>
          {this.renderAssessmentInformation()}
          {this.renderDocumentPurpose()}
          <IssuesIdentified topFiveIssues={this.assessment.topFiveIssues} />
          <Styled.MapContainer>
            <Header title={this.$t('assessment')} pageNumber="01" />
            <Styled.Text>
              {this.$t('pdfPreviewPage.assessment_text')}
            </Styled.Text>
            <TraceOrderPdfMap
              direction="left"
              data={this.traceMappingSuppliers}
            />
            <SupplierMappingDetail traceResultList={this.traceResultList} />
          </Styled.MapContainer>
        </fragment>
      </Styled.Wrapper>
    );
  }
}
