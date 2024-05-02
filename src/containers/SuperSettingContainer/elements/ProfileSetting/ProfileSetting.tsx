import { Vue, Component } from 'vue-property-decorator';
import { get } from 'lodash';
import auth from 'store/modules/auth';
import { updateProfile } from 'api/user-setting';
import { getUserInfo, setUserInfo } from 'utils/cookie';
import Button from 'components/FormUI/Button';
import Input from 'components/FormUI/Input';
import { handleError } from 'components/Toast';
import * as Styled from './styled';

const ResetPasswordModal = () => import('modals/ResetPasswordModal');

@Component
export default class ProfileSetting extends Vue {
  public messageErrors: App.MessageError = null;
  private isSubmitting = false;
  private formInput: Auth.User = {
    firstName: auth.user.firstName,
    lastName: auth.user.lastName,
    email: auth.user.email,
  };

  async onSubmit(): Promise<void> {
    try {
      this.isSubmitting = true;
      await updateProfile({ user: this.formInput });
      const userInfo = getUserInfo();
      setUserInfo({
        ...userInfo,
        ...this.formInput,
      });
      this.$toast.success(this.$t('onboardPage.profile_updated'));
    } catch (error) {
      this.messageErrors = get(error, 'errors');
      if (error) {
        handleError(error as App.ResponseError);
      }
    } finally {
      this.isSubmitting = false;
    }
  }

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
          name="firstName"
          maxlength={255}
          validation="bail|required|nameValidator"
          changeValue={this.onClearMessageErrors}
          validationMessages={{
            required: this.$t('validation.required', {
              field: this.$t('first_name').toLowerCase(),
            }),
          }}
          autoTrim
        />
      </Styled.Row>
    );
  }

  renderLastNameField(): JSX.Element {
    return (
      <Styled.Row>
        <Input
          label={this.$t('last_name')}
          name="lastName"
          maxlength={255}
          validation="bail|required|nameValidator"
          changeValue={this.onClearMessageErrors}
          validationMessages={{
            required: this.$t('validation.required', {
              field: this.$t('last_name').toLowerCase(),
            }),
          }}
          autoTrim
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
          maxlength={255}
          validation="bail|required|emailValid"
          changeValue={this.onClearMessageErrors}
          validationMessages={{
            required: this.$t('validation.required', {
              field: this.$t('email').toLowerCase(),
            }),
            emailValid: this.$t('validation.email'),
          }}
          autoTrim
        />
      </Styled.Row>
    );
  }

  renderProfile(): JSX.Element {
    return (
      <fragment>
        <Styled.Title>{this.$t('adminSettingPage.profile')}</Styled.Title>
        <formulate-form
          v-model={this.formInput}
          name="profileSetting"
          scopedSlots={{
            default: ({ hasErrors }: { hasErrors: boolean }) => {
              return (
                <Styled.Inputs>
                  {this.renderFirstNameField()}
                  {this.renderLastNameField()}
                  {this.renderEmailField()}
                  <Button
                    width="140px"
                    label={this.$t('common.action.save_changes')}
                    variant="primary"
                    disabled={hasErrors || this.isSubmitting}
                    click={this.onSubmit}
                  />
                </Styled.Inputs>
              );
            },
          }}
        />
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
      <Styled.Wrapper>
        {this.renderProfile()}
        {this.renderPassword()}
      </Styled.Wrapper>
    );
  }
}
