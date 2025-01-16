import { Vue, Component } from 'vue-property-decorator';
import { get } from 'lodash';
import { getPDF } from 'api/pdf-preview';
import app from 'store/modules/app';
import { handleError } from 'components/Toast';
import * as Styled from './styled';
import RiskInformation from './elements/RiskInformation';
import Assessment from './elements/Assessment';

@Component
export default class PDFOrderContainer extends Vue {
  private PDFData: PDFPreview.PDFData = null;

  created(): void {
    this.getPDF();
  }

  async getPDF(): Promise<void> {
    try {
      const { pdfData } = await getPDF({
        token: get(this.$route, 'query.token'),
      });
      this.PDFData = pdfData;
      app.changeLanguage(pdfData.language);
    } catch (error) {
      handleError(error as App.ResponseError);
    }
  }

  onLoaded() {
    window.isLoadPdfCompleted = true;
  }

  renderContent(): JSX.Element {
    const {
      homePage,
      assessment,
      overallRiskScore,
      language,
      supplierMapping: { traceResultList, traceMappingSuppliers },
      tracingObjects,
      tiers,
    } = this.PDFData;
    return (
      <fragment>
        <Assessment
          supplierData={homePage}
          assessment={assessment}
          overallRiskScore={overallRiskScore}
          traceResultList={traceResultList}
          traceMappingSuppliers={traceMappingSuppliers}
          tiers={tiers}
          loadedMap={this.onLoaded}
        />
        {tracingObjects.map((trace) => {
          return <RiskInformation data={trace} language={language} />;
        })}
      </fragment>
    );
  }

  render(): JSX.Element {
    return (
      <Styled.Wrapper>{this.PDFData && this.renderContent()}</Styled.Wrapper>
    );
  }
}
