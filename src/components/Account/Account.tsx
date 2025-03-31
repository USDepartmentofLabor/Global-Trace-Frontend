import { Vue, Component, Prop } from 'vue-property-decorator';
import ConfirmModal from 'modals/ConfirmModal';
import auth from 'store/modules/auth';
import { handleError } from 'components/Toast';
import Button from 'components/FormUI/Button';
import { SignOutTypeEnum } from 'enums/user';
import * as Styled from './styled';

@Component
export default class Account extends Vue {
  @Prop({
    default: false,
  })
  hasBorder: boolean;

  goToSignIn(): void {
    this.$router.push({ name: 'SignIn' });
  }

  async deleteAccount(): Promise<void> {
    try {
      auth.signOut({
        type: SignOutTypeEnum.DELETE_MY_ACCOUNT,
        callback: {
          onSuccess: this.goToSignIn,
        },
      });
    } catch (error) {
      handleError(error as App.ResponseError);
    }
  }

  openConfirmModal(): void {
    this.$modal.show(
      ConfirmModal,
      {
        icon: 'warning_outline',
        iconSize: '60',
        iconColor: 'alizarinCrimson',
        message: this.$t('delete_my_account_title'),
        note: this.$t('this_action_cannot_be_undone'),
        confirmLabel: this.$t('common.action.yes_delete'),
        confirmButtonVariant: 'danger',
        cancelLabel: this.$t('common.action.cancel'),
        onConfirm: () => this.deleteAccount(),
      },
      { width: '480px', height: 'auto', clickToClose: false, adaptive: true },
    );
  }

  render(): JSX.Element {
    return (
      <Styled.Wrapper hasBorder={this.hasBorder}>
        <Styled.Head>
          <font-icon name="warning" color="alizarinCrimson" />
          <Styled.Title>{this.$t('danger_zone')}</Styled.Title>
        </Styled.Head>
        <Styled.Body>
          <Button
            variant="danger"
            label={this.$t('delete_my_account')}
            click={this.openConfirmModal}
          />
          <Styled.Description>
            {this.$t('delete_my_account_message')}
          </Styled.Description>
        </Styled.Body>
      </Styled.Wrapper>
    );
  }
}
