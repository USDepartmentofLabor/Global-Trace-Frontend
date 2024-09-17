import { Vue, Component, Prop } from 'vue-property-decorator';
import ExternalRiskIndicatorList from './elements/ExternalRiskIndicatorList';
import * as Styled from './styled';

@Component
export default class ExternalRiskIndicatorModal extends Vue {
  @Prop({ required: true })
  readonly externalRiskIndicators: Auth.ExternalRiskIndicator[];

  closeModal(): void {
    this.$emit('close');
  }

  render(): JSX.Element {
    return (
      <modal-layout
        title={this.$t('external_risk_indicators')}
        closeModal={this.closeModal}
      >
        <Styled.Wrapper>
          <perfect-scrollbar>
            <Styled.Container>
              <ExternalRiskIndicatorList
                externalRiskIndicators={this.externalRiskIndicators}
              />
            </Styled.Container>
          </perfect-scrollbar>
        </Styled.Wrapper>
      </modal-layout>
    );
  }
}
