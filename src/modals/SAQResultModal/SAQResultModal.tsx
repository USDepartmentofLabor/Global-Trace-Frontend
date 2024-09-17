import { Vue, Component } from 'vue-property-decorator';
import SAQ from 'components/SAQ';
import * as Styled from './styled';

@Component
export default class SAQResultModal extends Vue {
  closeModal(): void {
    this.$emit('close');
  }

  render(): JSX.Element {
    return (
      <dashboard-layout>
        <Styled.Wrapper>
          <perfect-scrollbar>
            <Styled.Container>
              <Styled.Logo />
              <Styled.MenuTitle>
                {this.$t('onboardPage.self_assessment_questionnaire')}
              </Styled.MenuTitle>
              <SAQ finishSAQ={this.closeModal} />
              <Styled.CloseButton vOn:click={this.closeModal}>
                <font-icon name="arrow_left" size="22" color="envy" />
              </Styled.CloseButton>
            </Styled.Container>
          </perfect-scrollbar>
        </Styled.Wrapper>
      </dashboard-layout>
    );
  }
}
