import { Vue, Component, Prop } from 'vue-property-decorator';
import { get } from 'lodash';
import { getRiskAssessmentStatus } from 'utils/risk-assessment';
import * as Styled from './styled';

@Component
export default class RiskAssessment extends Vue {
  @Prop({ required: true }) supplier: BrandSupplier.SupplierItem;

  getRiskAssessmentStatus(): string | undefined {
    return getRiskAssessmentStatus(
      get(this.supplier, 'riskData'),
    ).toLowerCase();
  }

  render(): JSX.Element {
    const status = this.getRiskAssessmentStatus();

    return (
      <Styled.RiskAssessmentBar>
        <Styled.RiskAssessment status={status} />
      </Styled.RiskAssessmentBar>
    );
  }
}
