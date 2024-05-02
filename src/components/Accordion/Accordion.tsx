import { Vue, Component, Prop } from 'vue-property-decorator';
import * as Styled from './styled';

@Component
export default class Accordion extends Vue {
  @Prop({ default: '250px' }) maxHeight: string;
  private isShow: boolean = false;

  showContent(): void {
    this.isShow = !this.isShow;
  }

  render(): JSX.Element {
    return (
      <Styled.Wrapper>
        <Styled.Title vOn:click={this.showContent} isShow={this.isShow}>
          {this.$slots.title}
        </Styled.Title>
        <Styled.Content isShow={this.isShow} maxHeight={this.maxHeight}>
          <perfect-scrollbar>{this.$slots.content}</perfect-scrollbar>
        </Styled.Content>
      </Styled.Wrapper>
    );
  }
}
