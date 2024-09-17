import { Vue, Component, Prop } from 'vue-property-decorator';
import { get } from 'lodash';
import { getRiskAssessmentStatus } from 'utils/risk-assessment';
import * as Styled from './styled';

@Component
export default class RiskAssessment extends Vue {
  @Prop({ required: true }) supplier:
    | BrandSupplier.SupplierItem
    | BrandSupplier.TraceSupplierMapGroup;
  @Prop({ default: false }) isBar: boolean;

  getRiskAssessmentStatus(): string | undefined {
    if (this.supplier.overallRiskLevel) {
      return this.supplier.overallRiskLevel.toLowerCase();
    }
    return getRiskAssessmentStatus(
      get(this.supplier, 'riskData'),
    ).toLowerCase();
  }

  render(): JSX.Element {
    const status = this.getRiskAssessmentStatus();
    if (this.isBar) {
      return (
        <Styled.RiskAssessmentBar>
          <Styled.RiskAssessmentProgress status={status} />
        </Styled.RiskAssessmentBar>
      );
    }
    return <Styled.RiskAssessment status={status} />;
  }
}
