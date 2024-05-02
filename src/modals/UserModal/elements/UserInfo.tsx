import { Vue, Component, Prop } from 'vue-property-decorator';
import { find, head } from 'lodash';
import { UserStatusEnum } from 'enums/user';
import Dropdown from 'components/FormUI/Dropdown';
import Input from 'components/FormUI/Input';
import MessageError from 'components/FormUI/MessageError';
import * as Styled from './styled';

@Component
export default class UserInfo extends Vue {
  @Prop({ default: false }) readonly isShowBusinessName: boolean;
  @Prop({ default: false }) readonly isSupplier: boolean;
  @Prop({ default: false }) readonly isShowStatus: boolean;
  @Prop({ default: false }) readonly disabledTier: boolean;
  @Prop({ default: [] }) readonly roles: RoleAndPermission.Role[];
  @Prop({ default: false }) readonly disabledRoleId: boolean;
  @Prop({ default: null }) readonly messageErrors: App.MessageError;
  @Prop({ default: false }) readonly disabled: boolean;
  @Prop({ default: null }) readonly statusDefault: number;
  @Prop({ default: null }) readonly tierDefault: string;
  @Prop({ default: null }) readonly roleIdDefault: number;
  @Prop({
    type: Function,
    default: () => {
      //
    },
  })
  changeInput: () => void;

  private selectedStatus: App.DropdownOption = null;

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

  get formName(): string {
    return this.$formulate.registry.keys().next().value;
  }

  get formData(): UserManagement.User {
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

  get tier(): string {
    return this.formData.tier;
  }

  set tier(value: string) {
    this.$formulate.setValues(this.formName, {
      ...this.formData,
      tier: value,
    });
  }

  get roleId(): string {
    return this.formData.roleId;
  }

  set roleId(value: string) {
    this.$formulate.setValues(this.formName, {
      ...this.formData,
      roleId: value,
    });
  }

  created(): void {
    this.selectedStatus =
      find(this.statusOptions, (option) => option.id === this.statusDefault) ||
      head(this.statusOptions);
  }

  setRoleId(type: string): void {
    this.roleId = type;
  }

  onChangeStatus(option: App.DropdownOption): void {
    this.status = option ? (option.id as UserStatusEnum) : null;
    this.selectedStatus = option;
  }

  onChangeRoleId(option: App.DropdownOption): void {
    this.roleId = option ? (option.id as string) : null;
  }

  renderBusinessName(): JSX.Element {
    return (
      <Styled.Row>
        <Input
          label={this.$t('business_name')}
          name="businessName"
          height="48px"
          placeholder={this.$t('business_name')}
          validation="bail|required"
          disabled={this.disabled}
          changeValue={this.changeInput}
          autoTrim
          maxLength={255}
          validationMessages={{
            required: this.$t('validation.required', {
              field: this.$t('business_name').toLowerCase(),
            }),
          }}
        />
        {this.messageErrors && (
          <MessageError
            field="businessName"
            messageErrors={this.messageErrors}
          />
        )}
      </Styled.Row>
    );
  }

  renderFirstName(): JSX.Element {
    return (
      <Styled.Row>
        <Input
          label={this.$t('first_name')}
          name="firstName"
          height="48px"
          placeholder={this.$t('first_name')}
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
          placeholder={this.$t('last_name')}
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
          placeholder={this.$t('example_email')}
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

  renderStatus(): JSX.Element {
    return (
      <Styled.Row>
        <Dropdown
          title={this.$t('status')}
          options={this.statusOptions}
          width="100%"
          height="48px"
          value={this.selectedStatus}
          changeOptionValue={this.onChangeStatus}
          placeholder={this.$t('status_placeholder')}
          overflow
          allowEmpty={false}
        />
      </Styled.Row>
    );
  }

  render(): JSX.Element {
    return (
      <fragment>
        {this.isShowBusinessName && this.renderBusinessName()}
        {this.renderFirstName()}
        {this.renderLastName()}
        {this.renderEmail()}
        {this.isShowStatus && this.renderStatus()}
      </fragment>
    );
  }
}
