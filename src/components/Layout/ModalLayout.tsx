import { Vue, Component, Prop } from 'vue-property-decorator';
import MasterLayout from './MasterLayout';
import * as Styled from './styled';

@Component
export default class ModalLayout extends Vue {
  @Prop({ default: '' }) readonly title: string;
  @Prop({ default: true }) showCloseIcon: boolean;
  @Prop({ default: false }) readonly showBack: boolean;
  @Prop({
    type: Function,
    default: () => {
      //
    },
  })
  closeModal: () => void;
  @Prop({
    type: Function,
    default: () => {
      //
    },
  })
  readonly back: () => void;

  renderTitle(): JSX.Element {
    if (this.title) {
      return <Styled.Title>{this.title}</Styled.Title>;
    }
  }

  renderBackIcon(): JSX.Element {
    if (this.showBack) {
      return (
        <Styled.Back onClick={this.back}>
          <font-icon name="arrow_left" color="spunPearl" size="20" />
        </Styled.Back>
      );
    }
  }

  renderCloseIcon(): JSX.Element {
    if (this.showCloseIcon) {
      return (
        <Styled.CloseIcon vOn:click={this.closeModal}>
          <font-icon name="remove" color="spunPearl" size="20" />
        </Styled.CloseIcon>
      );
    }
  }

  render(): JSX.Element {
    return (
      <MasterLayout>
        <Styled.ModalLayout>
          {this.renderBackIcon()}
          {this.renderCloseIcon()}
          {this.renderTitle()}
          {this.$slots.default}
          {this.$slots.footer}
        </Styled.ModalLayout>
      </MasterLayout>
    );
  }
}
