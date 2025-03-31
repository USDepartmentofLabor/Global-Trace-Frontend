import { Vue, Component, Prop } from 'vue-property-decorator';
import * as Styled from './styled';

@Component
export default class Accordion extends Vue {
  @Prop({ default: false }) show: boolean;
  @Prop({ default: '250px' }) maxHeight: string;
  @Prop({ default: '' }) className: string;
  @Prop({
    default: () => {
      //TODO
    },
  })
  toggle: () => void;

  render(): JSX.Element {
    return (
      <Styled.Wrapper class={this.className}>
        <Styled.Title vOn:click={this.toggle} isShow={this.show}>
          {this.$slots.title}
        </Styled.Title>
        <Styled.Content isShow={this.show} maxHeight={this.maxHeight}>
          <perfect-scrollbar>{this.$slots.content}</perfect-scrollbar>
        </Styled.Content>
      </Styled.Wrapper>
    );
  }
}
