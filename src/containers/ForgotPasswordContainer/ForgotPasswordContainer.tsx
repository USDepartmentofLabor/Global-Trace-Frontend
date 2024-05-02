import { Vue, Component } from 'vue-property-decorator';
import { get, isEmpty } from 'lodash';
import { requestPassword } from 'api/forgot-password';
import Input from 'components/FormUI/Input';
import Button from 'components/FormUI/Button';
import MessageError from 'components/FormUI/MessageError';
import * as Styled from './styled';

@Component
export default class ForgotPasswordContainer extends Vue {
  private formInput: ForgotPassword.RequestPassword = {
    email: '',
  };
  public messageErrors: App.MessageError = null;
  private isSubmitting = false;
  private requestPasswordSucceeded = false;

  onClearMessageErrors(): void {
    if (this.messageErrors) {
      this.messageErrors = null;
    }
  }

  redirectToLogin(): void {
    this.$router.push({ name: 'SignIn' });
  }

  onSubmit(): void {
    this.isSubmitting = true;
    requestPassword(this.formInput)
      .then(() => {
        this.requestPasswordSucceeded = true;
      })
      .catch((error: App.ResponseError) => {
        if (isEmpty(get(error, 'errors'))) {
          const errorMessage = get(error, 'message', '');
          this.$toast.error(errorMessage);
        } else {
          this.messageErrors = get(error, 'errors');
        }
      })
      .finally(() => {
        this.isSubmitting = false;
      });
  }

  renderEmail(): JSX.Element {
    return (
      <Styled.Row>
        <Input
          width="312px"
          label={this.$t('forgotPasswordPage.email')}
          name="email"
          placeholder={this.$t('forgotPasswordPage.your_email')}
          changeValue={this.onClearMessageErrors}
          disabled={this.isSubmitting}
          validation="bail|required|emailValid"
          validationMessages={{
            required: this.$t('validation.required', {
              field: this.$t('forgotPasswordPage.email').toLowerCase(),
            }),
            emailValid: this.$t('validation.email'),
          }}
        />
        {this.messageErrors && (
          <MessageError field="email" messageErrors={this.messageErrors} />
        )}
      </Styled.Row>
    );
  }

  renderFormButtons(hasErrors: boolean): JSX.Element {
    return (
      <Styled.ButtonWrapper>
        <Button
          width="240px"
          type="submit"
          variant="primary"
          label={this.$t('common.action.send')}
          isLoading={this.isSubmitting}
          disabled={this.isSubmitting || hasErrors}
        />
      </Styled.ButtonWrapper>
    );
  }

  renderForm(): JSX.Element {
    return (
      <Styled.Wrapper>
        <Styled.Title>{this.$t('forgot_password')}</Styled.Title>
        <Styled.Description>
          {this.$t('forgotPasswordPage.forgot_password_description')}
        </Styled.Description>
        <formulate-form
          v-model={this.formInput}
          scopedSlots={{
            default: ({ hasErrors }: { hasErrors: boolean }) => (
              <fragment>
                {this.renderEmail()}
                {this.renderFormButtons(hasErrors)}
              </fragment>
            ),
          }}
          vOn:submit={this.onSubmit}
        />
        <Styled.ReturnLink>
          {this.$t('forgotPasswordPage.remember_your_password')}
          <router-link to="/sign-in" class="login-link">
            {this.$t('common.action.login')}
          </router-link>
        </Styled.ReturnLink>
      </Styled.Wrapper>
    );
  }

  renderRequestPasswordSucceed(): JSX.Element {
    return (
      <Styled.Wrapper>
        <Styled.Icon>
          <font-icon name="mark_email_read" color="highland" size="65" />
        </Styled.Icon>
        <Styled.Title>
          {this.$t('forgotPasswordPage.check_your_email')}
        </Styled.Title>
        <Styled.Description>
          {this.$t('forgotPasswordPage.check_your_email_detail')}
        </Styled.Description>
        <Styled.ButtonWrapper>
          <Button
            type="button"
            variant="primary"
            label={this.$t('forgotPasswordPage.back_to_login')}
            click={this.redirectToLogin}
          />
        </Styled.ButtonWrapper>
      </Styled.Wrapper>
    );
  }

  render(): JSX.Element {
    return (
      <guest-layout>
        {this.requestPasswordSucceeded
          ? this.renderRequestPasswordSucceed()
          : this.renderForm()}
      </guest-layout>
    );
  }
}
