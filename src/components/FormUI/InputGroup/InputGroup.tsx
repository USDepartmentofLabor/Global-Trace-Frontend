import { Vue, Component, Prop } from 'vue-property-decorator';
import * as Styled from './styled';

@Component
export default class InputGroup extends Vue {
  @Prop({ default: 1 }) column: number;

  render(): JSX.Element {
    return (
      <Styled.Wrapper column={this.column}>
        {this.$slots.default}
      </Styled.Wrapper>
    );
  }
}
