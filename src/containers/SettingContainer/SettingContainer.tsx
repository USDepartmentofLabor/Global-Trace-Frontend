import { Vue, Component } from 'vue-property-decorator';
import auth from 'store/modules/auth';
import Account from 'components/Account';
import Button from 'components/FormUI/Button';
import Input from 'components/FormUI/Input';
import * as Styled from './styled';

const ResetPasswordModal = () => import('modals/ResetPasswordModal');

@Component
export default class SettingContainer extends Vue {
  private user: Auth.User = auth.user;
  public messageErrors: App.MessageError = null;

  onClearMessageErrors(): void {
    if (this.messageErrors) {
      this.messageErrors = null;
    }
  }

  openResetPasswordModal(): void {
    this.$modal.show(
      ResetPasswordModal,
      {},
      {
        width: '360px',
        height: 'auto',
        classes: 'overflow-visible',
        clickToClose: false,
        adaptive: true,
      },
    );
  }

  renderFirstNameField(): JSX.Element {
    return (
      <Styled.Row>
        <Input
          label={this.$t('first_name')}
          name="first_name"
          value={this.user.firstName}
          disabled
        />
      </Styled.Row>
    );
  }

  renderLastNameField(): JSX.Element {
    return (
      <Styled.Row>
        <Input
          label={this.$t('last_name')}
          name="last_name"
          value={this.user.lastName}
          disabled
        />
      </Styled.Row>
    );
  }

  renderEmailField(): JSX.Element {
    return (
      <Styled.Row>
        <Input
          label={this.$t('email')}
          name="email"
          disabled
          value={this.user.email}
        />
      </Styled.Row>
    );
  }

  renderProfile(): JSX.Element {
    return (
      <fragment>
        <Styled.Title>{this.$t('adminSettingPage.profile')}</Styled.Title>
        <Styled.Inputs>
          {this.renderFirstNameField()}
          {this.renderLastNameField()}
          {this.renderEmailField()}
        </Styled.Inputs>
      </fragment>
    );
  }

  renderPassword(): JSX.Element {
    return (
      <Styled.Form>
        <Styled.Title>{this.$t('adminSettingPage.password')}</Styled.Title>
        <Button
          width="240px"
          label={this.$t('common.action.reset_password')}
          variant="primary"
          click={this.openResetPasswordModal}
        />
      </Styled.Form>
    );
  }

  render(): JSX.Element {
    return (
      <dashboard-layout>
        <Styled.Wrapper>
          {this.renderProfile()}
          {this.renderPassword()}
          <Styled.Account>
            <Account hasBorder />
          </Styled.Account>
        </Styled.Wrapper>
      </dashboard-layout>
    );
  }
}
