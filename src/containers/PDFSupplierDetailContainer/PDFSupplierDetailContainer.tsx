import { Vue, Component } from 'vue-property-decorator';
import { get } from 'lodash';
import { getPDFFacilityDetails } from 'api/pdf-preview';
import app from 'store/modules/app';
import { handleError } from 'components/Toast';
import PDFHeader from 'components/PDFHeader';
import RiskLabel from 'components/RiskLabel';
import { LevelRiskCategoryEnum } from 'enums/saq';
import { convertEnumToTranslation } from 'utils/translation';
import * as Styled from './styled';
import RiskInformation from './elements/RiskInformation';
import Assessment from './elements/Assessment';

@Component
export default class PDFSupplierDetailContainer extends Vue {
  private PDFData: Auth.Facility = null;
  private filterParams: FacilityManagement.FilterValues = null;
  private riskCategories: LevelRiskCategoryEnum[] = [
    LevelRiskCategoryEnum.EXTREME,
    LevelRiskCategoryEnum.HIGH,
    LevelRiskCategoryEnum.MEDIUM,
    LevelRiskCategoryEnum.LOW,
  ];

  created(): void {
    this.getPDFFacilityDetails();
  }

  async getPDFFacilityDetails(): Promise<void> {
    try {
      const { pdfData } = await getPDFFacilityDetails({
        token: get(this.$route, 'query.token'),
      });
      this.PDFData = get(pdfData, 'supplierDetail');
      this.filterParams = get(pdfData, 'filterParams');
      app.changeLanguage(pdfData.language);
      this.$nextTick(() => {
        window.isLoadPdfCompleted = true;
      });
    } catch (error) {
      handleError(error as App.ResponseError);
    }
  }

  renderRiskCategory(): JSX.Element {
    return (
      <Styled.RiskCategory>
        <Styled.RiskCategoryContainer>
          <Styled.RiskCategoryLabel>
            {this.$t('risk_category')}
          </Styled.RiskCategoryLabel>
          <Styled.RiskCategoryGroup>
            {this.riskCategories.map((risk) => (
              <RiskLabel
                hasDot
                text={this.$t(convertEnumToTranslation(risk))}
                level={risk}
                isUppercase={false}
              />
            ))}
          </Styled.RiskCategoryGroup>
        </Styled.RiskCategoryContainer>
      </Styled.RiskCategory>
    );
  }

  renderAssessment(): JSX.Element {
    return (
      <Styled.Container>
        <PDFHeader title={this.$t('assessment')} page="01" />
        {this.renderRiskCategory()}
        <Assessment
          filterParams={this.filterParams}
          supplierData={this.PDFData}
        />
      </Styled.Container>
    );
  }

  renderReport(): JSX.Element {
    return (
      <Styled.Container>
        <PDFHeader title={this.$t('sidebar.incident_reports')} page="02" />
        <RiskInformation supplierData={this.PDFData} />
      </Styled.Container>
    );
  }

  render(): JSX.Element {
    return (
      <Styled.Wrapper>
        {this.PDFData && (
          <fragment>
            {this.renderAssessment()}
            {this.renderReport()}
          </fragment>
        )}
      </Styled.Wrapper>
    );
  }
}
