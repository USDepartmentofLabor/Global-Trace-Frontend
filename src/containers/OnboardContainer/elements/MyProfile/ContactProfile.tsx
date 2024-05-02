import { Vue, Component, Prop } from 'vue-property-decorator';
import { getUserRole } from 'utils/user';
import Input from 'components/FormUI/Input';
import MessageError from 'components/FormUI/MessageError';
import * as Styled from './styled';

@Component
export default class ContactProfile extends Vue {
  @Prop({ required: true }) readonly userInfo: Auth.User;
  @Prop({ default: null }) readonly messageErrors: App.MessageError;
  @Prop({ default: false }) readonly disabled: boolean;
  @Prop({
    default: () => {
      //
    },
  })
  changeInput: () => void;

  get userRole(): RoleAndPermission.Role {
    return getUserRole(this.userInfo);
  }

  renderFirstName(): JSX.Element {
    return (
      <Styled.Column>
        <Input
          width="100%"
          height="48px"
          variant="material"
          label={this.$t('first_name')}
          name="firstName"
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
      </Styled.Column>
    );
  }

  renderLastName(): JSX.Element {
    return (
      <Styled.Column>
        <Input
          width="100%"
          height="48px"
          variant="material"
          label={this.$t('last_name')}
          name="lastName"
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
      </Styled.Column>
    );
  }

  renderPhone(): JSX.Element {
    return (
      <Styled.Column>
        <Input
          width="100%"
          height="48px"
          variant="material"
          label={this.$t('phone_optional')}
          name="phoneNumber"
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
      </Styled.Column>
    );
  }

  renderEmail(): JSX.Element {
    return (
      <Styled.Column>
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
      </Styled.Column>
    );
  }

  render(): JSX.Element {
    return (
      <Styled.Group>
        <Styled.SubTitle>{this.$t('contact')}</Styled.SubTitle>
        <Styled.Row>
          {this.renderFirstName()}
          {this.renderLastName()}
        </Styled.Row>
        <Styled.Row>
          {this.renderEmail()}
          {this.renderPhone()}
        </Styled.Row>
      </Styled.Group>
    );
  }
}
