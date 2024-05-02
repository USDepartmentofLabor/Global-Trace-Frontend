import { Vue, Component, Prop } from 'vue-property-decorator';
import { get } from 'lodash';
import { changePassword } from 'api/user-setting';
import Input from 'components/FormUI/Input';
import PasswordRulesTooltip from 'components/FormUI/PasswordRulesTooltip';
import MessageError from 'components/FormUI/MessageError';
import Button from 'components/FormUI/Button';
import { handleError } from 'components/Toast';
import * as Styled from './styled';

@Component
export default class ResetPasswordModal extends Vue {
  @Prop({ default: true }) showCloseIcon: boolean;
  @Prop({
    default: 'default',
    validator(this, value) {
      return ['default', 'primary'].includes(value);
    },
  })
  readonly variant: string;

  private formInput: AuditorProfile.ChangePasswordParams = {
    oldPassword: '',
    password: '',
    newPassword: '',
  };
  private isSubmitting: boolean = false;
  private messageErrors: App.MessageError = null;

  get hasCancel(): boolean {
    return this.variant == 'primary';
  }

  async onSubmit(): Promise<void> {
    this.isSubmitting = true;
    try {
      await changePassword({
        oldPassword: this.formInput.oldPassword,
        newPassword: this.formInput.password,
      });
      this.closeModal();
      this.$toast.success(this.$t('password_successfully_changed'));
    } catch (error) {
      handleError(error as App.ResponseError);
      this.messageErrors = get(error, 'errors');
    } finally {
      this.isSubmitting = false;
    }
  }

  onClearMessageErrors(): void {
    if (this.messageErrors) {
      this.messageErrors = null;
    }
  }

  closeModal(): void {
    this.$emit('close');
  }

  renderOldPassword(): JSX.Element {
    return (
      <Styled.Row>
        <Input
          type="password"
          label={this.$t('current_password')}
          name="oldPassword"
          disabled={this.isSubmitting}
          validation="bail|required"
          validationMessages={{
            required: this.$t('validation.required', {
              field: this.$t('current_password'),
            }),
          }}
          changeValue={this.onClearMessageErrors}
        />
        {this.messageErrors && (
          <MessageError
            field="oldPassword"
            messageErrors={this.messageErrors}
          />
        )}
      </Styled.Row>
    );
  }

  renderNewPassword(): JSX.Element {
    return (
      <Styled.Row>
        <Input
          type="password"
          label={this.$t('new_password')}
          name="password"
          disabled={this.isSubmitting}
          validation="bail|required|passwordValidator|difference:oldPassword"
          validationMessages={{
            required: this.$t('validation.required', {
              field: this.$t('new_password'),
            }),
            difference: this.$t('validation.difference_password'),
            passwordValidator: this.$t('validation.invalid', {
              field: this.$t('signUpPage.password'),
            }),
          }}
          changeValue={this.onClearMessageErrors}
        >
          <PasswordRulesTooltip slot="labelSuffix">
            <font-icon
              name="circle_warning"
              color="spunPearl"
              size="14"
              slot="content"
            />
          </PasswordRulesTooltip>
        </Input>
        {this.messageErrors && (
          <MessageError
            field="newPassword"
            messageErrors={this.messageErrors}
          />
        )}
      </Styled.Row>
    );
  }

  renderConfirmPassword(): JSX.Element {
    return (
      <Styled.Row>
        <Input
          type="password"
          label={this.$t('confirm_password')}
          name="password_confirm"
          disabled={this.isSubmitting}
          validation="bail|required|confirm"
          validationMessages={{
            required: this.$t('validation.required', {
              field: this.$t('confirm_password'),
            }),
            confirm: this.$t('validation.password_not_match'),
          }}
          changeValue={this.onClearMessageErrors}
        />
      </Styled.Row>
    );
  }

  renderActions(hasErrors: boolean): JSX.Element {
    return (
      <Styled.Actions variant={this.variant}>
        <Button
          width="100%"
          type="submit"
          label={this.$t('save')}
          variant="primary"
          isLoading={this.isSubmitting}
          disabled={this.isSubmitting || hasErrors}
        />
        {this.hasCancel && (
          <Button
            width="100%"
            label={this.$t('common.action.cancel')}
            variant="transparentPrimary"
            disabled={this.isSubmitting}
            click={this.closeModal}
          />
        )}
      </Styled.Actions>
    );
  }

  renderForm(): JSX.Element {
    return (
      <formulate-form
        v-model={this.formInput}
        vOn:submit={this.onSubmit}
        scopedSlots={{
          default: ({ hasErrors }: { hasErrors: boolean }) => (
            <Styled.Form variant={this.variant}>
              {this.renderOldPassword()}
              {this.renderNewPassword()}
              {this.renderConfirmPassword()}
              {this.renderActions(hasErrors)}
            </Styled.Form>
          ),
        }}
      />
    );
  }

  render(): JSX.Element {
    return (
      <modal-layout
        title={this.$t('common.action.reset_password')}
        closeModal={this.closeModal}
        showCloseIcon={this.showCloseIcon}
      >
        {this.renderForm()}
      </modal-layout>
    );
  }
}
