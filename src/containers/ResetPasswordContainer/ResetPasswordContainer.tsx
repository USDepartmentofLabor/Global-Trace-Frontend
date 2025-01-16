import { Vue, Component } from 'vue-property-decorator';
import { get } from 'lodash';
import { resetPassword, verifyToken } from 'api/forgot-password';
import { SpinLoading } from 'components/Loaders';
import Input from 'components/FormUI/Input';
import Button from 'components/FormUI/Button';
import MessageError from 'components/FormUI/MessageError';
import InformationTooltip from 'components/FormUI/InformationTooltip';
import * as Styled from './styled';

@Component
export default class ResetPasswordContainer extends Vue {
  private formInput: ForgotPassword.ResetPasswordParams = {
    password: '',
    token: '',
  };
  public messageErrors: App.MessageError = null;
  public updatePasswordSucceeded: boolean = false;
  public isVerified: boolean = false;
  public isLoading: boolean = false;
  public isSubmitting: boolean = false;

  created(): void {
    this.verifyResetPasswordLink();
  }

  verifyResetPasswordLink(): void {
    const token = get(this.$route, 'query.token');
    if (token) {
      this.isLoading = true;
      verifyToken({ token })
        .then(() => {
          this.formInput.token = token;
          this.isVerified = true;
        })
        .finally(() => {
          this.isLoading = false;
        });
    } else {
      this.$router.push({ name: 'ForgotPassword' });
    }
  }

  onSubmit(): void {
    this.isSubmitting = true;
    resetPassword(this.formInput)
      .then(() => {
        this.updatePasswordSucceeded = true;
      })
      .catch((error: App.ResponseError) => {
        this.messageErrors = get(error, 'errors');
      })
      .finally(() => {
        this.isSubmitting = false;
      });
  }

  onClearMessageErrors(): void {
    if (this.messageErrors) {
      this.messageErrors = null;
    }
  }

  renderLoading(): JSX.Element {
    return <SpinLoading />;
  }

  renderRecoverySuccess(): JSX.Element {
    return (
      <fragment>
        <Styled.Icon>
          <font-icon name="check_circle" color="highland" size="65" />
        </Styled.Icon>
        <Styled.Title>
          {this.$t('resetPasswordPage.you_are_all_set')}
        </Styled.Title>
        <Styled.Description>
          {this.$t('resetPasswordPage.reset_password_successfully')}
        </Styled.Description>
        <Styled.Button>
          <router-link to="/sign-in" tag="div">
            <Button
              type="button"
              label={this.$t('common.action.login')}
              variant="primary"
            />
          </router-link>
        </Styled.Button>
      </fragment>
    );
  }

  renderLinkExpired(): JSX.Element {
    return (
      <fragment>
        <Styled.Title>
          {this.$t('resetPasswordPage.your_link_has_expired')}
        </Styled.Title>
        <Styled.Description>
          {this.$t('resetPasswordPage.your_link_has_expired_detail')}
        </Styled.Description>
        <Styled.Button>
          <router-link to="/forgot-password" tag="div">
            <Button
              type="button"
              label={this.$t('common.action.reset_password')}
              variant="primary"
            />
          </router-link>
        </Styled.Button>
      </fragment>
    );
  }

  renderPassword(): JSX.Element {
    return (
      <Styled.Row>
        <Input
          width="312px"
          type="password"
          label={this.$t('resetPasswordPage.new_password')}
          name="password"
          disabled={this.isSubmitting}
          validation="bail|required|passwordValidator"
          validationMessages={{
            required: this.$t('validation.required', {
              field: this.$t('resetPasswordPage.new_password'),
            }),
            passwordValidator: this.$t('validation.invalid', {
              field: this.$t('signUpPage.password'),
            }),
          }}
          changeValue={this.onClearMessageErrors}
        >
          <InformationTooltip
            slot="labelSuffix"
            tooltipContent={this.$t('common.password_rules.content')}
          >
            <font-icon
              name="circle_warning"
              color="spunPearl"
              size="14"
              slot="content"
            />
          </InformationTooltip>
        </Input>
        {this.messageErrors && (
          <MessageError field="password" messageErrors={this.messageErrors} />
        )}
      </Styled.Row>
    );
  }

  renderConfirmPassword(): JSX.Element {
    return (
      <Styled.Row>
        <Input
          width="312px"
          type="password"
          label={this.$t('resetPasswordPage.confirm_password')}
          name="password_confirm"
          disabled={this.isSubmitting}
          validation="bail|required|confirm"
          validationMessages={{
            required: this.$t('validation.required', {
              field: this.$t('resetPasswordPage.confirm_password'),
            }),
            confirm: this.$t('validation.password_not_match'),
          }}
          changeValue={this.onClearMessageErrors}
        />
      </Styled.Row>
    );
  }

  renderAction(hasErrors: boolean): JSX.Element {
    return (
      <Styled.Button>
        <Button
          class="submit-button"
          type="submit"
          label={this.$t('common.action.reset_password')}
          variant="primary"
          isLoading={this.isSubmitting}
          disabled={this.isSubmitting || hasErrors}
        />
      </Styled.Button>
    );
  }

  renderForm(): JSX.Element {
    return (
      <fragment>
        <Styled.Title>{this.$t('common.action.reset_password')}</Styled.Title>
        <Styled.Description>
          {this.$t('resetPasswordPage.create_new_password')}
        </Styled.Description>
        <formulate-form
          v-model={this.formInput}
          vOn:submit={this.onSubmit}
          scopedSlots={{
            default: ({ hasErrors }: { hasErrors: boolean }) => (
              <fragment>
                {this.renderPassword()}
                {this.renderConfirmPassword()}
                {this.renderAction(hasErrors)}
              </fragment>
            ),
          }}
        />
      </fragment>
    );
  }

  render(): JSX.Element {
    return (
      <guest-layout>
        <Styled.Wrapper>
          {this.isLoading && this.renderLoading()}
          {!this.updatePasswordSucceeded &&
            this.isVerified &&
            !this.isLoading &&
            this.renderForm()}
          {!this.isVerified && !this.isLoading && this.renderLinkExpired()}
          {this.updatePasswordSucceeded &&
            this.isVerified &&
            !this.isLoading &&
            this.renderRecoverySuccess()}
        </Styled.Wrapper>
      </guest-layout>
    );
  }
}
