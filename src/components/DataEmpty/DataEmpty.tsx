import { Vue, Component, Prop } from 'vue-property-decorator';
import * as Styled from './styled';

@Component
export default class DataEmpty extends Vue {
  @Prop({ default: '' }) readonly title: string;

  render(): JSX.Element {
    return (
      <Styled.Wrapper>
        <Styled.Container>
          <Styled.Information>
            <Styled.Text>{this.title}</Styled.Text>
          </Styled.Information>
          <font-icon name="double_arrow" size="40" color="surfCrest" />
          {this.$slots.default}
        </Styled.Container>
      </Styled.Wrapper>
    );
  }
}
