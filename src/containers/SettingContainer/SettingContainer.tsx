import { Vue, Component } from 'vue-property-decorator';
import auth from 'store/modules/auth';
import Button from 'components/FormUI/Button';
import Account from 'components/Account';
import Input from 'components/FormUI/Input';
import { getUserInfo, setUserInfo } from 'utils/cookie';
import { switchToConfiguration } from 'api/site-setting';
import { handleError } from 'components/Toast';
import ConfirmModal from 'modals/ConfirmModal';
import * as Styled from './styled';

@Component
export default class SettingContainer extends Vue {
  private user: Auth.User = auth.user;
  public messageErrors: App.MessageError = null;

  async switchToConfiguration(): Promise<void> {
    try {
      await switchToConfiguration();
      const userInfo = getUserInfo();
      userInfo.completedConfiguringSystemAt = null;
      setUserInfo(userInfo);
      this.$router.push({ name: 'Configuration' });
    } catch (error) {
      handleError(error as App.ResponseError);
    }
  }

  openConfirmModal() {
    this.$modal.show(
      ConfirmModal,
      {
        icon: 'warning_outline',
        iconSize: '60',
        iconColor: 'alizarinCrimson',
        message: this.$t('switch_to_system_configuration_message'),
        confirmLabel: this.$t('switch_to_configuration_view'),
        confirmButtonVariant: 'primary',
        cancelButtonVariant: 'transparentPrimary',
        cancelLabel: this.$t('common.action.cancel'),
        onConfirm: () => this.switchToConfiguration(),
      },
      { width: '480px', height: 'auto', clickToClose: false, adaptive: true },
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
      <Styled.Box>
        <Styled.Header>
          <Styled.Title>{this.$t('adminSettingPage.profile')}</Styled.Title>
          {auth.isSuperAdmin && (
            <Button
              type="button"
              icon="sync"
              label={this.$t('switch_to_system_configuration')}
              click={this.openConfirmModal}
            />
          )}
        </Styled.Header>
        <Styled.Inputs>
          {this.renderFirstNameField()}
          {this.renderLastNameField()}
          {this.renderEmailField()}
        </Styled.Inputs>
      </Styled.Box>
    );
  }

  render(): JSX.Element {
    return (
      <dashboard-layout>
        <Styled.Wrapper>
          <Styled.Container>
            {this.renderProfile()}
            {!auth.isSuperAdmin && <Account />}
          </Styled.Container>
        </Styled.Wrapper>
      </dashboard-layout>
    );
  }
}
