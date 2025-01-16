import { Vue, Component } from 'vue-property-decorator';
import * as Styled from './styled';

@Component
export default class Filter extends Vue {
  render(): JSX.Element {
    return (
      <Styled.Wrapper>
        <Styled.FilterContainer>
          <Styled.FilterWrapper>
            {this.$t('attribute_name')}{' '}
          </Styled.FilterWrapper>
          <Styled.FilterWrapper>{this.$t('type')}</Styled.FilterWrapper>
        </Styled.FilterContainer>
      </Styled.Wrapper>
    );
  }
}
