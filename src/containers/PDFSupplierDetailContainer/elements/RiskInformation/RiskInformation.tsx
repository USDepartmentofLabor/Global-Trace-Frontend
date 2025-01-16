import { Component, Vue, Prop } from 'vue-property-decorator';
import { get, isEmpty } from 'lodash';
import RiskLabel from 'components/RiskLabel';
import RiskDataPDF from 'components/RiskDataPDF';
import * as Styled from './styled';

@Component
export default class RiskInformation extends Vue {
  @Prop({ required: true }) readonly supplierData: Auth.Facility;

  get riskData(): Auth.RiskData {
    return get(this.supplierData, 'riskData');
  }

  get sourceData(): Auth.SupplierData[] {
    return get(this.riskData, 'data');
  }

  get overallRisk(): Auth.Risk {
    return get(this.riskData, 'overallRisk');
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
    const overallRisk = get(this.overallRisk, 'level');
    return (
      <Styled.Wrapper>
        {isEmpty(this.sourceData) && this.renderEmptyIndicator()}
        {!isEmpty(this.sourceData) && (
          <fragment>
            <Styled.Header>
              <Styled.Label>{this.$t('overall_risk')}</Styled.Label>
              {overallRisk && (
                <RiskLabel hasDot text={overallRisk} level={overallRisk} />
              )}
            </Styled.Header>
            <RiskDataPDF sourceData={this.sourceData} />
          </fragment>
        )}
      </Styled.Wrapper>
    );
  }
}
