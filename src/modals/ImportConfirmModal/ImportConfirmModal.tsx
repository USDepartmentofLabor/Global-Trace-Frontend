import { Vue, Component, Prop } from 'vue-property-decorator';
import Button from 'components/FormUI/Button';
import { ImportActionEnum } from 'enums/taxonomy-exploitation';
import * as Styled from './styled';

const ConfirmModal = () => import('modals/ConfirmModal');

@Component
export default class ImportConfirmModal extends Vue {
  @Prop({ default: '' }) readonly title: string;
  @Prop({ default: '' }) readonly icon: string;
  @Prop({ default: '44' }) readonly iconSize: string;
  @Prop({ default: 'highland' }) readonly iconColor: string;
  @Prop({ default: null }) readonly note: string;
  @Prop({ default: '' }) readonly message: string;
  @Prop({
    default: () => {
      //
    },
  })
  onImport: (action: ImportActionEnum) => Promise<void>;
  @Prop({
    type: Function,
    default: () => {
      //
    },
  })
  onClose: () => void;

  public isLoading: boolean = false;

  async confirm(action: ImportActionEnum): Promise<void> {
    if (this.onImport) {
      this.isLoading = true;
      this.onImport(action).finally(() => {
        this.$emit('close');
        this.isLoading = false;
      });
    } else {
      this.$emit('close');
    }
  }

  showConfirmModal(action: ImportActionEnum): void {
    this.$modal.show(
      ConfirmModal,
      {
        icon: 'warning_outline',
        iconSize: '80',
        iconColor: 'alizarinCrimson',
        message: this.$t('confirm_replace_indicator_list'),
        description: this.$t('replace_indicator_description'),
        note: this.$t('this_action_cannot_be_undone'),
        confirmLabel: 'yes_replace',
        cancelLabel: 'common.action.cancel',
        confirmButtonVariant: 'outlineDanger',
        onConfirm: () => this.confirm(action),
      },
      { width: '480px', height: 'auto', clickToClose: false },
    );
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
          width="100%"
          label={this.$t('replace_all_existing_data')}
          isLoading={this.isLoading}
          disabled={this.isLoading}
          click={() => {
            this.showConfirmModal(ImportActionEnum.REPLACE);
          }}
        />
        <Button
          width="100%"
          label={this.$t('add_to_current_data')}
          isLoading={this.isLoading}
          disabled={this.isLoading}
          click={() => {
            this.confirm(ImportActionEnum.ADD);
          }}
        />
        <Button
          width="100%"
          label={this.$t('common.action.cancel')}
          variant="outlinePrimary"
          disabled={this.isLoading}
          click={this.closeModal}
        />
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
          <Styled.Message>{this.$t(this.message)}</Styled.Message>
        </Styled.ModalContent>
      );
    }
    return null;
  }

  render(): JSX.Element {
    return (
      <modal-layout closeModal={this.closeModal} title={this.$t(this.title)}>
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
