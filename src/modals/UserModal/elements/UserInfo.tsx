/* eslint-disable max-lines */
import { Vue, Component, Prop } from 'vue-property-decorator';
import { find, flatMap, head, isEmpty } from 'lodash';
import { UserStatusEnum } from 'enums/user';
import { InputType } from 'enums/app';
import Dropdown from 'components/FormUI/Dropdown';
import { getAllPermissions, hasPermission } from 'utils/user';
import { PermissionActionEnum } from 'enums/role';
import Input from 'components/FormUI/Input';
import MessageError from 'components/FormUI/MessageError';
import * as Styled from './styled';

@Component
export default class UserInfo extends Vue {
  @Prop({ default: false }) readonly isShowBusinessName: boolean;
  @Prop({ default: false }) readonly isShowStatus: boolean;
  @Prop({ default: null }) readonly role: RoleAndPermission.Role;
  @Prop({ default: [] }) readonly riskIndices: GrievanceReport.Category[];
  @Prop({ default: false }) readonly disabledRoleId: boolean;
  @Prop({ default: null }) readonly messageErrors: App.MessageError;
  @Prop({ default: false }) readonly disabled: boolean;
  @Prop({ default: null }) readonly statusDefault: number;
  @Prop({ default: null }) readonly roleIdDefault: number;
  @Prop({
    type: Function,
    default: () => {
      //
    },
  })
  changeInput: () => void;

  private selectedStatus: App.DropdownOption = null;
  private selectedRiskIndices: App.DropdownOption[] = [];

  get allPermission(): RoleAndPermission.Permission[] {
    return getAllPermissions(this.role);
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

  get riskIndicesIds(): string[] {
    return this.formData.editableExternalRiskIndexIds;
  }

  set riskIndicesIds(value: string[]) {
    this.$formulate.setValues(this.formName, {
      ...this.formData,
      editableExternalRiskIndexIds: value,
    });
  }

  get maxRisk(): string {
    return this.formData.maximumCreateExternalRiskIndex;
  }

  set maxRisk(value: string) {
    this.$formulate.setValues(this.formName, {
      ...this.formData,
      maximumCreateExternalRiskIndex: value,
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
    this.initRiskIndicesIds();
    this.formData.editableExternalRiskIndexIds;
  }

  initRiskIndicesIds() {
    if (!isEmpty(this.formData.editableExternalRiskIndexIds)) {
      this.selectedRiskIndices = this.riskIndices.filter(({ id }) =>
        this.formData.editableExternalRiskIndexIds.includes(id),
      );
    }
  }

  setRoleId(type: string): void {
    this.roleId = type;
  }

  onChangeStatus(option: App.DropdownOption): void {
    this.status = option ? (option.id as UserStatusEnum) : null;
    this.selectedStatus = option;
  }

  onChangeRiskIndices(options: App.DropdownOption[]) {
    this.riskIndicesIds = flatMap(options, 'id') as string[];
    this.selectedRiskIndices = options;
  }

  changeMaxRisk(value: string) {
    this.maxRisk = value;
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

  renderRiskIndices(): JSX.Element {
    const show = hasPermission(
      this.allPermission,
      PermissionActionEnum.EDIT_EXISTING_RISK_INDEX,
    );
    if (show) {
      return (
        <Styled.Row>
          <Dropdown
            title={this.$t('risk_indices')}
            options={this.riskIndices}
            width="100%"
            height="48px"
            trackBy="id"
            value={this.selectedRiskIndices}
            changeOptionValue={this.onChangeRiskIndices}
            placeholder={this.$t('select_risk_indices')}
            disabled={this.disabled}
            allowEmpty={false}
            overflow
            isMultiple
            limit={1}
            taggable
          />
        </Styled.Row>
      );
    }
  }

  renderMaxRisk(): JSX.Element {
    const show = hasPermission(
      this.allPermission,
      PermissionActionEnum.CREATE_NEW_RISK_INDEX,
    );
    if (show) {
      return (
        <Styled.Row>
          <Input
            type={InputType.NUMBER}
            min="0"
            label={this.$t('maximum_new_risk_indices')}
            name="maximumCreateExternalRiskIndex"
            height="48px"
            validation="bail|required|min:0"
            disabled={this.disabled}
            changeValue={this.changeMaxRisk}
            autoTrim
            maxLength={255}
            validationMessages={{
              required: this.$t('validation.required', {
                field: this.$t('maximum_new_risk_indices').toLowerCase(),
              }),
              min: this.$t('validation.min', {
                field: this.$t('maximum_new_risk_indices'),
                compare_field: 0,
              }),
            }}
          />
        </Styled.Row>
      );
    }
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
        {this.renderRiskIndices()}
        {this.renderMaxRisk()}
        {this.isShowStatus && this.renderStatus()}
      </fragment>
    );
  }
}
