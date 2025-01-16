import { Component, Vue, Prop } from 'vue-property-decorator';
import * as Styled from './styled';
import ExternalRiskIndicatorList from './ExternalRiskIndicatorList';

const ExternalRiskIndicatorModal = () =>
  import('modals/ExternalRiskIndicatorModal');

@Component
export default class ExternalRiskIndicator extends Vue {
  @Prop({ required: true })
  private externalRiskIndicators: Auth.ExternalRiskIndicator[];

  showDetailModal() {
    this.$modal.show(
      ExternalRiskIndicatorModal,
      {
        externalRiskIndicators: this.externalRiskIndicators,
      },
      {
        name: 'ExternalRiskIndicatorModal',
        width: '800px',
        height: 'auto',
        clickToClose: false,
      },
    );
  }

  render(): JSX.Element {
    return (
      <Styled.Card width="30%">
        <Styled.CardHead>
          <Styled.CardHeadColumn>
            <font-icon
              name="warning_outline"
              color="alizarinCrimson"
              size="25"
            />
            <Styled.CardTitle>
              {this.$t('external_risk_indicators')} (
              {this.externalRiskIndicators.length})
            </Styled.CardTitle>
          </Styled.CardHeadColumn>
          <Styled.CardHeadColumn>
            <Styled.ViewDetail vOn:click={this.showDetailModal}>
              {this.$t('view_all')}
            </Styled.ViewDetail>
          </Styled.CardHeadColumn>
        </Styled.CardHead>
        <Styled.CardList>
          <ExternalRiskIndicatorList
            externalRiskIndicators={this.externalRiskIndicators}
          />
        </Styled.CardList>
      </Styled.Card>
    );
  }
}
