import { Vue, Component, Prop } from 'vue-property-decorator';
import Input from 'components/FormUI/Input';
import MessageError from 'components/FormUI/MessageError';
import * as Styled from './styled';

const ResetPasswordModal = () => import('modals/ResetPasswordModal');

@Component
export default class ContactProfile extends Vue {
  @Prop({ default: null }) readonly messageErrors: App.MessageError;
  @Prop({ default: false }) readonly disabled: boolean;
  @Prop({
    default: () => {
      //
    },
  })
  changeInput: () => void;

  openResetPasswordModal(): void {
    this.$modal.show(
      ResetPasswordModal,
      {},
      {
        width: '776px',
        height: 'auto',
        classes: 'overflow-visible',
        clickToClose: false,
        adaptive: true,
      },
    );
  }

  renderFirstName(): JSX.Element {
    return (
      <Styled.Input>
        <Input
          width="100%"
          height="48px"
          maxlength={255}
          variant="material"
          label={this.$t('first_name')}
          name="firstName"
          placeholder={this.$t('first_name')}
          validation="bail|required|nameValidator"
          disabled={this.disabled}
          changeValue={this.changeInput}
          autoTrim
          validationMessages={{
            required: this.$t('validation.required', {
              field: this.$t('first_name').toLowerCase(),
            }),
          }}
        />
        {this.messageErrors && (
          <MessageError field="firstName" messageErrors={this.messageErrors} />
        )}
      </Styled.Input>
    );
  }

  renderLastName(): JSX.Element {
    return (
      <Styled.Input>
        <Input
          width="100%"
          height="48px"
          maxlength={255}
          variant="material"
          label={this.$t('last_name')}
          name="lastName"
          placeholder={this.$t('last_name')}
          validation="bail|required|nameValidator"
          disabled={this.disabled}
          changeValue={this.changeInput}
          autoTrim
          validationMessages={{
            required: this.$t('validation.required', {
              field: this.$t('last_name').toLowerCase(),
            }),
          }}
        />
        {this.messageErrors && (
          <MessageError field="lastName" messageErrors={this.messageErrors} />
        )}
      </Styled.Input>
    );
  }

  renderPassword(): JSX.Element {
    return (
      <Styled.Password>
        <Input
          width="100%"
          height="48px"
          variant="material"
          label={this.$t('password')}
          name="password"
          value="⦁⦁⦁⦁⦁⦁⦁⦁⦁⦁"
          readonly
          disabled
        />
        <font-icon
          name="edit"
          color="sandyBrown"
          size="24"
          vOn:click_native={this.openResetPasswordModal}
        />
      </Styled.Password>
    );
  }

  renderPhone(): JSX.Element {
    return (
      <Styled.Input>
        <Input
          width="100%"
          height="48px"
          name="phoneNumber"
          variant="material"
          disabled={this.disabled}
          label={this.$t('phone_optional')}
          placeholder={this.$t('phone_optional_placeholder')}
          changeValue={this.changeInput}
        />
        {this.messageErrors && (
          <MessageError
            field="phoneNumber"
            messageErrors={this.messageErrors}
          />
        )}
      </Styled.Input>
    );
  }

  renderEmail(): JSX.Element {
    return (
      <Styled.Input>
        <Input
          width="100%"
          height="48px"
          variant="material"
          label={this.$t('email')}
          name="email"
          placeholder={this.$t('example_email')}
          validation="bail|required|emailValid"
          disabled={this.disabled}
          changeValue={this.changeInput}
          autoTrim
          validationMessages={{
            required: this.$t('validation.required', {
              field: this.$t('email').toLowerCase(),
            }),
            emailValid: this.$t('validation.email'),
          }}
        />
        {this.messageErrors && (
          <MessageError field="email" messageErrors={this.messageErrors} />
        )}
      </Styled.Input>
    );
  }

  render(): JSX.Element {
    return (
      <Styled.FormContactProfile>
        <Styled.FullName>
          {this.renderFirstName()}
          {this.renderLastName()}
        </Styled.FullName>
        {this.renderPhone()}
        {this.renderEmail()}
        {this.renderPassword()}
      </Styled.FormContactProfile>
    );
  }
}
