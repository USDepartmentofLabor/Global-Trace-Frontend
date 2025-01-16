import { Vue, Component, Prop } from 'vue-property-decorator';
import * as Styled from './styled';

@Component
export default class ActionModal extends Vue {
  @Prop({ required: true }) readonly title: string;
  @Prop({ default: '' }) readonly icon: string;
  @Prop({ default: '44' }) readonly iconSize: string;

  closeModal() {
    this.$emit('close');
  }

  renderTitle(): JSX.Element {
    return <Styled.Title>{this.title}</Styled.Title>;
  }

  renderIcon(): JSX.Element {
    if (this.icon) {
      return (
        <Styled.Icon>
          <font-icon name={this.icon} size={this.iconSize} color="highland" />
        </Styled.Icon>
      );
    }
    return null;
  }

  render(): JSX.Element {
    return (
      <modal-layout closeModal={this.closeModal} title="">
        <Styled.Wrapper>
          {this.renderTitle()}
          {this.renderIcon()}
        </Styled.Wrapper>
      </modal-layout>
    );
  }
}
