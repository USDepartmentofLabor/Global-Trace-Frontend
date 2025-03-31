import { Vue, Component } from 'vue-property-decorator';
import { get } from 'lodash';
import { getUserInvite, signUp } from 'api/auth';
import { revokeUser } from 'utils/cookie';
import Input from 'components/FormUI/Input';
import InformationTooltip from 'components/FormUI/InformationTooltip';
import Button from 'components/FormUI/Button';
import { handleError } from 'components/Toast';
import * as Styled from './styled';

@Component
export default class SignUpContainer extends Vue {
  private formInput: Auth.UserRegistration = {
    password: '',
    token: '',
  };
  private isLoading: boolean = false;
  public messageErrors: App.MessageError = null;

  created(): void {
    this.getUserInfo();
  }

  onClearMessageErrors(): void {
    if (this.messageErrors) {
      this.messageErrors = null;
    }
  }

  getUserInfo(): void {
    const token = get(this.$route, 'query.invite-token');
    if (token) {
      this.isLoading = true;
      revokeUser();
      getUserInvite(token)
        .then(() => {
          this.formInput.token = token;
        })
        .catch((error: App.ResponseError) => {
          handleError(error);
          this.$router.push({ name: 'SignIn' });
        })
        .finally(() => {
          this.isLoading = false;
        });
    } else {
      this.$router.push({ name: 'SignIn' });
    }
  }

  onSubmit() {
    this.isLoading = true;
    signUp(this.formInput)
      .then(() => {
        this.$toast.success(this.$t('signUpPage.register_successfully'));
        this.$router.push({ name: 'SignIn' });
      })
      .catch((error: App.ResponseError) => {
        handleError(error);
      })
      .finally(() => {
        this.isLoading = false;
      });
  }

  renderPassword(): JSX.Element {
    return (
      <Styled.Row>
        <Input
          width="312px"
          type="password"
          label={this.$t('signUpPage.password')}
          name="password"
          disabled={this.isLoading}
          validation="bail|required|passwordValidator"
          validationMessages={{
            required: this.$t('validation.required', {
              field: this.$t('signUpPage.password'),
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
      </Styled.Row>
    );
  }

  renderConfirmPassword(): JSX.Element {
    return (
      <Styled.Row>
        <Input
          width="312px"
          type="password"
          label={this.$t('signUpPage.confirm_password')}
          name="password_confirm"
          disabled={this.isLoading}
          validation="bail|required|confirm"
          validationMessages={{
            required: this.$t('validation.required', {
              field: this.$t('signUpPage.confirm_password'),
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
          width="240px"
          class="submit-button"
          type="submit"
          label={this.$t('sign_up')}
          variant="primary"
          loading={this.isLoading}
          disabled={this.isLoading || hasErrors}
        />
      </Styled.Button>
    );
  }

  renderForm(): JSX.Element {
    if (!this.formInput.token.length) {
      return null;
    }
    return (
      <fragment>
        <Styled.Title>{this.$t('signUpPage.welcome')}</Styled.Title>
        <Styled.Description>
          {this.$t('signUpPage.make_an_account_here')}
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
        <Styled.Wrapper>{this.renderForm()}</Styled.Wrapper>
      </guest-layout>
    );
  }
}
