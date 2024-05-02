import { Vue, Component, Prop } from 'vue-property-decorator';
import * as Styled from './styled';

@Component
export default class Tag extends Vue {
  @Prop({ default: 'auto' }) readonly height: string;
  @Prop({ default: '' }) readonly icon: string;

  render(): JSX.Element {
    return (
      <Styled.Wrapper>
        <Styled.Container>
          <Styled.TagContent height={this.height}>
            <font-icon name={this.icon} size="20" color="envy" />
            {this.$slots.title}
            <Styled.SubTitle>{this.$slots.subTitle}</Styled.SubTitle>
            {this.$slots.action}
          </Styled.TagContent>
        </Styled.Container>
      </Styled.Wrapper>
    );
  }
}
