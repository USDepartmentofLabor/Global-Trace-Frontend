import { Vue, Component } from 'vue-property-decorator';
import { get, isEmpty, values } from 'lodash';
import { getPDFFacilityDetails } from 'api/pdf-preview';
import app from 'store/modules/app';
import { handleError } from 'components/Toast';
import PDFHeader from 'components/PDFHeader';
import FilterInformation from 'components/FilterInformation';
import * as Styled from './styled';
import RiskInformation from './elements/RiskInformation';

@Component
export default class PDFSupplierDetailContainer extends Vue {
  private PDFData: Auth.Facility = null;
  private filterParams: FacilityManagement.FilterValues = null;

  get hasFilter(): boolean {
    return values(this.filterParams).some((value) => !isEmpty(value));
  }

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

  renderContent(): JSX.Element {
    return (
      <Styled.Container>
        <PDFHeader
          title={this.$t('product_tracing_labor_risk')}
          pageNumber="01"
        />
        {this.hasFilter && (
          <FilterInformation filterParams={this.filterParams} />
        )}
        <RiskInformation supplierData={this.PDFData} />
      </Styled.Container>
    );
  }

  render(): JSX.Element {
    return (
      <Styled.Wrapper>{this.PDFData && this.renderContent()}</Styled.Wrapper>
    );
  }
}
