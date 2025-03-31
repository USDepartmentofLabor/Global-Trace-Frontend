import { Vue, Component } from 'vue-property-decorator';
import { getHomeRoute } from 'utils/user';
import { isAuthenticated } from 'utils/cookie';
import auth from 'store/modules/auth';
import Input from 'components/FormUI/Input';
import Button from 'components/FormUI/Button';
import { handleError } from 'components/Toast';
import * as Styled from './styled';

@Component
export default class SignInContainer extends Vue {
  private credentials: Auth.UserCertificate = {
    email: '',
    password: '',
  };
  public isSubmitting: boolean = false;

  onSuccess(allowLogin: boolean): void {
    if (allowLogin) {
      this.$router.push({
        name: getHomeRoute(),
      });
    } else {
      this.$toast.info(this.$t('login_description'));
    }
  }

  handleLoginError(error: App.ResponseError): void {
    handleError(error);
  }

  signIn(): void {
    this.isSubmitting = true;
    auth.signIn({
      data: this.credentials,
      callback: {
        onSuccess: this.onSuccess,
        onFailure: (error: App.ResponseError) => {
          this.handleLoginError(error);
        },
        onFinish: () => {
          this.isSubmitting = false;
        },
      },
    });
  }

  onSubmit(): void {
    if (isAuthenticated()) {
      this.$router.push({
        name: getHomeRoute(),
      });
    } else {
      this.signIn();
    }
  }

  renderEmailField(): JSX.Element {
    return (
      <Styled.Row>
        <Input
          label={this.$t('loginPage.account')}
          name="email"
          validation="bail|required|emailValid"
          disabled={this.isSubmitting}
          validationMessages={{
            required: this.$t('validation.required', {
              field: this.$t('loginPage.account').toLowerCase(),
            }),
            emailValid: this.$t('validation.email'),
          }}
        />
      </Styled.Row>
    );
  }

  renderPasswordField(): JSX.Element {
    return (
      <Styled.Row>
        <Input
          type="password"
          label={this.$t('loginPage.password')}
          name="password"
          disabled={this.isSubmitting}
          validation="bail|required"
          validationMessages={{
            required: this.$t('validation.required', {
              field: this.$t('loginPage.password').toLowerCase(),
            }),
          }}
        />
      </Styled.Row>
    );
  }

  renderFormButtons(hasErrors: boolean): JSX.Element {
    return (
      <Styled.ButtonWrap>
        <Button
          width="240px"
          type="submit"
          variant="primary"
          label={this.$t('loginPage.sign_in')}
          isLoading={this.isSubmitting}
          disabled={this.isSubmitting || hasErrors}
        />
      </Styled.ButtonWrap>
    );
  }

  renderForm(): JSX.Element {
    return (
      <Styled.Wrapper>
        <Styled.Title>{this.$t('sign_in')}</Styled.Title>
        <formulate-form
          v-model={this.credentials}
          scopedSlots={{
            default: ({ hasErrors }: { hasErrors: boolean }) => (
              <fragment>
                {this.renderEmailField()}
                {this.renderPasswordField()}
                {this.renderFormButtons(hasErrors)}
              </fragment>
            ),
          }}
          vOn:submit={this.onSubmit}
        />
        <router-link to="/forgot-password" class="forgot-password-link">
          {this.$t('loginPage.forgot_password')}
        </router-link>
      </Styled.Wrapper>
    );
  }

  render(): JSX.Element {
    return <guest-layout>{this.renderForm()}</guest-layout>;
  }
}
