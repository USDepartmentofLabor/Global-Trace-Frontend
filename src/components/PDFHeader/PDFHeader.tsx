import { Vue, Component, Prop } from 'vue-property-decorator';
import * as Styled from './styled';

@Component
export default class Header extends Vue {
  @Prop({ default: '' }) readonly title: string;
  @Prop({ default: '01' }) readonly page: string;

  render(): JSX.Element {
    return (
      <Styled.Wrapper>
        <Styled.Number>{this.page}</Styled.Number>
        <Styled.Header>
          <Styled.Tile />
          <Styled.Title>{this.title}</Styled.Title>
        </Styled.Header>
      </Styled.Wrapper>
    );
  }
}
