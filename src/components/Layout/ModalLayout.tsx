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
    return (
      <Styled.Title>
        {this.renderBackIcon()}
        <Styled.TitleContent domProps={{ innerHTML: this.title }} />
      </Styled.Title>
    );
  }

  renderBackIcon(): JSX.Element {
    if (this.showBack) {
      return (
        <Styled.Back onClick={this.back}>
          <font-icon name="arrow_left" color="highland" size="24" />
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
          {this.title && (
            <Styled.ModalHeader>
              {this.renderCloseIcon()}
              {this.renderTitle()}
              {this.$slots.subTitle}
            </Styled.ModalHeader>
          )}
          {this.$slots.default}
          {this.$slots.footer}
        </Styled.ModalLayout>
      </MasterLayout>
    );
  }
}
