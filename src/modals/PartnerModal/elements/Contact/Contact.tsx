import { Vue, Component, Prop } from 'vue-property-decorator';
import auth from 'store/modules/auth';
import { getPartnerTypeShortName, getUserRole } from 'utils/user';
import { PartnerTypeEnum } from 'enums/onboard';
import MessageError from 'components/FormUI/MessageError';
import Input from 'components/FormUI/Input';
import * as Styled from '../styled';

@Component
export default class Contact extends Vue {
  @Prop({ required: true }) type: PartnerTypeEnum;
  @Prop({ default: null }) facility: Auth.Facility;
  @Prop({ default: null }) readonly messageErrors: App.MessageError;
  @Prop({ default: false }) readonly disabled: boolean;
  @Prop() changeInput: () => void;

  get userInfo(): Auth.User {
    return auth.user;
  }

  get userRole(): RoleAndPermission.Role {
    return getUserRole(this.userInfo);
  }

  get contactTitle(): string {
    return this.$t('user_contact', {
      field: this.$t(getPartnerTypeShortName(this.type)),
    });
  }

  renderFirstName(): JSX.Element {
    return (
      <Styled.Container>
        <Input
          label={this.$t('first_name')}
          name="firstName"
          height="48px"
          maxlength={255}
          placeholder={this.$t('first_name')}
          validation="bail|required|nameValidator"
          disabled={this.disabled}
          changeValue={this.changeInput}
          validationMessages={{
            required: this.$t('validation.required', {
              field: this.$t('first_name').toLowerCase(),
            }),
          }}
        />
        {this.messageErrors && (
          <MessageError field="firstName" messageErrors={this.messageErrors} />
        )}
      </Styled.Container>
    );
  }

  renderLastName(): JSX.Element {
    return (
      <Styled.Container>
        <Input
          label={this.$t('last_name')}
          name="lastName"
          height="48px"
          maxlength={255}
          placeholder={this.$t('last_name')}
          validation="bail|required|nameValidator"
          disabled={this.disabled}
          changeValue={this.changeInput}
          validationMessages={{
            required: this.$t('validation.required', {
              field: this.$t('last_name').toLowerCase(),
            }),
          }}
        />
        {this.messageErrors && (
          <MessageError field="lastName" messageErrors={this.messageErrors} />
        )}
      </Styled.Container>
    );
  }

  renderEmail(): JSX.Element {
    return (
      <Styled.Container>
        <Input
          label={this.$t('email')}
          name="email"
          height="48px"
          placeholder={this.$t('example_email')}
          validation="bail|required|emailValid"
          disabled={this.disabled}
          changeValue={this.changeInput}
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
      </Styled.Container>
    );
  }

  renderPhone(): JSX.Element {
    return (
      <Styled.Container>
        <Input
          label={this.$t('phone_optional')}
          name="phoneNumber"
          height="48px"
          placeholder={this.$t('phone_optional_placeholder')}
          disabled={this.disabled}
          changeValue={this.changeInput}
        />
        {this.messageErrors && (
          <MessageError
            field="phoneNumber"
            messageErrors={this.messageErrors}
          />
        )}
      </Styled.Container>
    );
  }

  render(): JSX.Element {
    return (
      <fragment>
        <Styled.BusinessContainer>
          <Styled.Box>
            <Styled.Container>
              <Styled.Title>{this.contactTitle}</Styled.Title>
              <Styled.ContactLayout>
                {this.renderFirstName()}
                {this.renderLastName()}
                {this.renderEmail()}
                {this.renderPhone()}
              </Styled.ContactLayout>
            </Styled.Container>
          </Styled.Box>
        </Styled.BusinessContainer>
      </fragment>
    );
  }
}
