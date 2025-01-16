import { Vue, Component } from 'vue-property-decorator';
import * as Styled from './styled';

@Component
export default class Unsupported extends Vue {
  render(): JSX.Element {
    return (
      <Styled.Wrapper>
        <Styled.Image />
        <Styled.Body>
          <Styled.Title>
            {this.$t('we_cant_fit_everything_on_your_screen')}
          </Styled.Title>
          <Styled.Description>
            {this.$t('please_use_your_desktop_instead')}
          </Styled.Description>
        </Styled.Body>
      </Styled.Wrapper>
    );
  }
}
