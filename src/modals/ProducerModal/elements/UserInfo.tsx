import { Vue, Component, Prop } from 'vue-property-decorator';
import { find } from 'lodash';
import { ProducerTypeEnum, UserStatusEnum } from 'enums/user';
import Dropdown from 'components/FormUI/Dropdown';
import Input from 'components/FormUI/Input';
import MessageError from 'components/FormUI/MessageError';
import InputGroup from 'components/FormUI/InputGroup';
import * as Styled from './styled';

@Component
export default class UserInfo extends Vue {
  @Prop({ required: true }) readonly formName: string;
  @Prop({ default: null }) readonly messageErrors: App.MessageError;
  @Prop({ default: false }) readonly disabled: boolean;
  @Prop({ default: null }) readonly statusDefault: number;
  @Prop({ default: null }) readonly typeDefault: ProducerTypeEnum;
  @Prop({
    type: Function,
    default: () => {
      //
    },
  })
  changeInput: () => void;

  private selectedType: App.DropdownOption = null;

  get typeOptions(): App.DropdownOption[] {
    return [
      {
        id: ProducerTypeEnum.ADMIN,
        name: this.$t('admin'),
      },
      {
        id: ProducerTypeEnum.STANDARD,
        name: this.$t('standard'),
      },
    ];
  }

  get statusOptions(): App.DropdownOption[] {
    return [
      {
        id: UserStatusEnum.ACTIVE,
        name: this.$t('active'),
      },
      {
        id: UserStatusEnum.DEACTIVATED,
        name: this.$t('deactivated'),
      },
    ];
  }

  get formData(): ProducerManagement.User {
    return this.$formulate.registry.get(this.formName).proxy;
  }

  get status(): UserStatusEnum {
    return this.formData.status;
  }

  set status(value: UserStatusEnum) {
    this.$formulate.setValues(this.formName, {
      ...this.formData,
      status: value,
    });
  }

  get type(): ProducerTypeEnum {
    return this.formData.userType;
  }

  set type(value: ProducerTypeEnum) {
    this.$formulate.setValues(this.formName, {
      ...this.formData,
      userType: value,
    });
  }

  created(): void {
    if (this.typeDefault) {
      this.selectedType = find(
        this.typeOptions,
        (option) => option.id === this.typeDefault,
      );
    }
  }

  onChangeType(option: App.DropdownOption): void {
    this.type = option ? (option.id as ProducerTypeEnum) : null;
    this.selectedType = option;
  }

  renderFirstName(): JSX.Element {
    return (
      <Styled.Row>
        <Input
          label={this.$t('first_name')}
          name="firstName"
          height="48px"
          placeholder={this.$t('enter_first_name')}
          validation="bail|required|nameValidator"
          disabled={this.disabled}
          changeValue={this.changeInput}
          autoTrim
          maxLength={255}
          validationMessages={{
            required: this.$t('validation.required', {
              field: this.$t('first_name').toLowerCase(),
            }),
          }}
        />
        {this.messageErrors && (
          <MessageError field="firstName" messageErrors={this.messageErrors} />
        )}
      </Styled.Row>
    );
  }

  renderLastName(): JSX.Element {
    return (
      <Styled.Row>
        <Input
          label={this.$t('last_name')}
          name="lastName"
          height="48px"
          placeholder={this.$t('enter_last_name')}
          validation="bail|required|nameValidator"
          disabled={this.disabled}
          changeValue={this.changeInput}
          autoTrim
          maxLength={255}
          validationMessages={{
            required: this.$t('validation.required', {
              field: this.$t('last_name').toLowerCase(),
            }),
          }}
        />
        {this.messageErrors && (
          <MessageError field="lastName" messageErrors={this.messageErrors} />
        )}
      </Styled.Row>
    );
  }

  renderEmail(): JSX.Element {
    return (
      <Styled.Row>
        <Input
          label={this.$t('email')}
          name="email"
          height="48px"
          placeholder={this.$t('enter_email_address')}
          validation="bail|required|emailValid"
          disabled={this.disabled}
          changeValue={this.changeInput}
          autoTrim
          maxLength={255}
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
      </Styled.Row>
    );
  }

  renderUserType(): JSX.Element {
    return (
      <Styled.Row>
        <Dropdown
          title={this.$t('account_type')}
          options={this.typeOptions}
          width="100%"
          height="48px"
          value={this.selectedType}
          changeOptionValue={this.onChangeType}
          placeholder={this.$t('select_account_type')}
          overflow
          allowEmpty={false}
        />
      </Styled.Row>
    );
  }

  render(): JSX.Element {
    return (
      <fragment>
        <InputGroup column={2}>
          {this.renderFirstName()}
          {this.renderLastName()}
        </InputGroup>
        {this.renderEmail()}
        {this.renderUserType()}
      </fragment>
    );
  }
}
