import { Vue, Component, Prop } from 'vue-property-decorator';
import Button from 'components/FormUI/Button';
import * as Styled from './styled';

@Component
export default class ConfirmModal extends Vue {
  @Prop({ default: '' }) readonly title: string;
  @Prop({ default: '' }) readonly icon: string;
  @Prop({ default: '44' }) readonly iconSize: string;
  @Prop({ default: 'highland' }) readonly iconColor: string;
  @Prop({ default: null }) readonly note: string;
  @Prop({ default: 'confirm' }) readonly confirmLabel: string;
  @Prop({ default: '100%' }) readonly confirmButtonWidth: string;
  @Prop({ default: 'primary' }) readonly confirmButtonVariant: string;
  @Prop({ default: 'cancel' }) readonly cancelLabel: string;
  @Prop({ default: true }) readonly showCancelButton: string;
  @Prop({ default: 'outlinePrimary' }) readonly cancelButtonVariant: string;
  @Prop({ default: '' }) readonly message: string;
  @Prop({
    default: 'left',
    validator(this, value) {
      return ['left', 'right', 'center'].includes(value);
    },
  })
  readonly textAlign: string;
  @Prop({
    default: () => {
      //
    },
  })
  onConfirm: () => Promise<void>;
  @Prop({
    type: Function,
    default: () => {
      //
    },
  })
  onClose: () => void;

  public isLoading: boolean = false;

  confirm(): void {
    if (this.onConfirm) {
      this.isLoading = true;
      this.onConfirm().finally(() => {
        this.$emit('close');
        this.isLoading = false;
      });
    } else {
      this.$emit('close');
    }
  }

  closeModal(): void {
    if (!this.isLoading) {
      this.onClose();
      this.$emit('close');
    }
  }

  renderModalFooter(): JSX.Element {
    return (
      <Styled.ModalFooter>
        <Button
          width={this.confirmButtonWidth}
          label={this.$t(this.confirmLabel)}
          variant={this.confirmButtonVariant}
          isLoading={this.isLoading}
          disabled={this.isLoading}
          click={this.confirm}
        />
        {this.showCancelButton && (
          <Button
            width="100%"
            label={this.$t(this.cancelLabel)}
            variant={this.cancelButtonVariant}
            disabled={this.isLoading}
            click={this.closeModal}
          />
        )}
      </Styled.ModalFooter>
    );
  }

  renderIcon(): JSX.Element {
    if (this.icon) {
      return (
        <Styled.Icon>
          <font-icon
            name={this.icon}
            size={this.iconSize}
            color={this.iconColor}
          />
        </Styled.Icon>
      );
    }
    return null;
  }

  renderNote(): JSX.Element {
    if (this.note) {
      return (
        <text-direction>
          <Styled.Note>
            <Styled.NoteLabel>{this.$t('note')}:</Styled.NoteLabel>
            <Styled.NoteMessage>{this.note}</Styled.NoteMessage>
          </Styled.Note>
        </text-direction>
      );
    }
    return null;
  }

  renderMessage(): JSX.Element {
    if (this.message) {
      return (
        <Styled.ModalContent>
          <Styled.Message textAlign={this.textAlign}>
            {this.$t(this.message)}
          </Styled.Message>
        </Styled.ModalContent>
      );
    }
    return null;
  }

  render(): JSX.Element {
    return (
      <modal-layout showCloseIcon={false} title={this.$t(this.title)}>
        <Styled.Wrapper>
          {this.renderIcon()}
          {this.renderMessage()}
          {this.renderNote()}
          {this.renderModalFooter()}
        </Styled.Wrapper>
      </modal-layout>
    );
  }
}
