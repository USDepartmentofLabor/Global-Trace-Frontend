/* eslint-disable max-lines, max-lines-per-function */
import { Component, Prop, Vue } from 'vue-property-decorator';
import {
  filter,
  flatMap,
  forOwn,
  get,
  isEmpty,
  isNull,
  pick,
  values,
} from 'lodash';
import { createRole, editRole, validateRoles } from 'api/permission';
import {
  GroupTypeEnum,
  RoleAttributeTypeEnum,
  RoleStepEnum,
  RoleTypeEnum,
} from 'enums/role';
import { handleError } from 'components/Toast';
import { getIdentifierTypes } from 'api/role';
import { SpinLoading } from 'components/Loaders';
import { updateModalWidth } from 'utils/helpers';
import { DEFAULT_ROLE_ICON } from 'config/constants';
import Info from './elements/Info';
import PermissionsList from './elements/PermissionsList';
import Attribute from './elements/Attribute';
import * as Styled from './styled';
import AttributeList from './elements/AdditionalAttribute';
import AttributeSetting from './elements/AttributeSetting';

@Component
export default class RoleModal extends Vue {
  @Prop({ default: null })
  readonly role: RoleAndPermission.Role;
  @Prop() onSuccess: () => void;

  private isSubmitting: boolean = false;
  private isLoading: boolean = true;

  private step: RoleStepEnum = RoleStepEnum.INFO;
  private formInput: RoleAndPermission.RoleParams = {
    isRawMaterialExtractor: false,
    seasonStartDate: '',
    seasonDuration: null,
    name: '',
    type: null,
    chainOfCustody: null,
    assignedPermissionIds: [],
    icon: DEFAULT_ROLE_ICON,
  };
  private messageErrors: App.MessageError = null;
  private selectedIdentifierTypes: App.DropdownOption[] = [];
  private identityTypesOptions: App.DropdownOption[] = [];
  private additionalAttributes: RoleAndPermission.AttributeParams[] = [];
  private currentAttribute: RoleAndPermission.RoleAttribute = null;

  get isEdit(): boolean {
    return !isNull(this.role);
  }

  get messageSuccess(): string {
    return this.isEdit ? 'updated_role_successfully' : 'add_success';
  }

  get isInfoStep(): boolean {
    return this.step === RoleStepEnum.INFO;
  }

  get isPermissionStep(): boolean {
    return this.step === RoleStepEnum.PERMISSION;
  }

  get isAttributeStep(): boolean {
    return this.step === RoleStepEnum.ATTRIBUTE;
  }

  get isAddAdditionalAttributeStep(): boolean {
    return this.step === RoleStepEnum.ADD_ADDITIONAL_ATTRIBUTE;
  }

  get isAttributeSettingStep(): boolean {
    return this.step === RoleStepEnum.ATTRIBUTE_SETTING;
  }

  get isDisabled(): boolean {
    return isEmpty(this.formInput.assignedPermissionIds);
  }

  get title(): string {
    switch (this.step) {
      case RoleStepEnum.PERMISSION:
        return this.$t('role_permissions');
      case RoleStepEnum.ATTRIBUTE:
        return this.$t('role_attributes');
      case RoleStepEnum.ADD_ADDITIONAL_ATTRIBUTE:
        return this.$t('add_additional_attributes');
      case RoleStepEnum.ATTRIBUTE_SETTING:
        return this.$t('create_new_attribute');
    }
    if (this.isEdit) {
      return this.$t('edit_role');
    }
    return this.$t('add_new_role');
  }

  created() {
    this.initData();
  }

  async initData() {
    try {
      await this.getIdentifierTypes();
      if (this.isEdit) {
        const {
          name,
          chainOfCustody,
          isRawMaterialExtractor,
          seasonDuration,
          seasonStartDate,
          permissions,
          type,
          icon,
          attributes,
        } = this.role;
        this.initAttributes(attributes);
        this.formInput.name = name;
        this.formInput.type = type;
        this.formInput.icon = icon;
        this.formInput.chainOfCustody = chainOfCustody;
        this.formInput.isRawMaterialExtractor = isRawMaterialExtractor;
        this.formInput.seasonDuration = seasonDuration;
        this.formInput.seasonStartDate = seasonStartDate;
        permissions.forEach(({ id, subPermissions }) => {
          this.formInput.assignedPermissionIds = [
            ...this.formInput.assignedPermissionIds,
            ...id,
            ...flatMap(subPermissions, 'id'),
          ];
        });
      }
    } catch (error) {
      handleError(error as App.ResponseError);
    } finally {
      this.isLoading = false;
    }
  }

  initAttributes(attributes: RoleAndPermission.AttributeGroup) {
    forOwn(
      attributes,
      (value: RoleAndPermission.RoleAttributeParams[], key) => {
        if (key === RoleAttributeTypeEnum.ADDITIONAL_ATTRIBUTE) {
          this.additionalAttributes = value.map(({ attribute, isOptional }) => {
            return {
              attribute,
              isOptional,
              id: attribute.id,
              groupType: attribute.type,
            };
          });
        } else {
          const option = this.identityTypesOptions.find(
            ({ name }) => name === key,
          );
          if (option) {
            this.selectedIdentifierTypes.push(option);
          }
        }
      },
    );
  }

  async getIdentifierTypes(): Promise<void> {
    try {
      this.identityTypesOptions = await getIdentifierTypes();
    } catch (error) {
      handleError(error as App.ResponseError);
    }
  }

  updateAdministratorPermissions(
    permissions: RoleAndPermission.NewPermission[],
  ): RoleAndPermission.NewPermission[] {
    if (!isEmpty(permissions)) {
      permissions[0].groupType = GroupTypeEnum.CHECKBOX;
    }
    return permissions;
  }

  async validateConfigRole(): Promise<boolean> {
    try {
      const params: RoleAndPermission.RoleValidateParams = {
        id: this.isEdit ? this.role.id : null,
        name: this.formInput.name,
      };
      await validateRoles(params);
      return true;
    } catch (error) {
      this.goToStep(RoleStepEnum.INFO);
      this.$nextTick(() => {
        this.messageErrors = get(error, 'errors');
      });
      return false;
    }
  }

  async onConfigRole(): Promise<void> {
    try {
      this.isSubmitting = true;
      this.formInput.assignedPermissionIds = filter(
        this.formInput.assignedPermissionIds,
        (id: string) => !isNull(id),
      );
      const payload = pick(this.formInput, [
        'name',
        'type',
        'chainOfCustody',
        'assignedPermissionIds',
        'isRawMaterialExtractor',
        'seasonStartDate',
        'seasonDuration',
        'attributes',
        'icon',
      ]);
      if (this.isEdit) {
        await editRole(this.role.id, payload);
      } else {
        await createRole(payload);
      }
      this.onSuccess();
      this.$toast.success(this.$t(this.messageSuccess));
      this.closeModal();
    } catch (error) {
      const errors = get(error, 'errors');
      if (values(errors).length > 0) {
        this.messageErrors = errors;
      } else {
        handleError(error as App.ResponseError);
      }
    } finally {
      this.isSubmitting = false;
    }
  }

  async onSubmit(): Promise<void> {
    const isValid = await this.validateConfigRole();
    if (isValid) {
      this.onConfigRole();
    }
  }

  onCancel(): void {
    this.closeModal();
  }

  closeModal(): void {
    this.$emit('close');
  }

  changeIdentifierTypes(options: App.DropdownOption[]) {
    this.selectedIdentifierTypes = options;
  }

  onSelectAdditionalAttributes(
    attributes: RoleAndPermission.AttributeParams[],
  ): void {
    this.additionalAttributes = attributes;
    this.goToStep(RoleStepEnum.ATTRIBUTE);
  }

  removeAttribute(attributeId: string) {
    this.additionalAttributes = this.additionalAttributes.filter(
      ({ id }) => id !== attributeId,
    );
  }

  editAdditionalAttribute(attribute: RoleAndPermission.RoleAttribute): void {
    this.setCurrentAttribute(attribute);
    this.goToStep(RoleStepEnum.ATTRIBUTE_SETTING);
  }

  handleSavedAttribute(data: RoleAndPermission.RoleAttributeParams): void {
    if (this.currentAttribute) {
      const attributeIndex = this.additionalAttributes.findIndex(
        ({ id }) => id === this.currentAttribute.id,
      );
      if (attributeIndex > -1) {
        this.additionalAttributes[attributeIndex].attribute.name = data.name;
        this.additionalAttributes[attributeIndex].attribute.category =
          data.category;
      }
    } else {
      const { id, attribute } = data;
      this.additionalAttributes.push({
        id,
        attribute,
        isOptional: false,
        groupType: RoleAttributeTypeEnum.ADDITIONAL_ATTRIBUTE,
      });
    }
    this.setCurrentAttribute();
    this.goToStep(RoleStepEnum.ADD_ADDITIONAL_ATTRIBUTE);
  }

  setCurrentAttribute(attribute: RoleAndPermission.RoleAttribute = null): void {
    this.currentAttribute = attribute;
  }

  onDeletedAttribute(): void {
    if (this.currentAttribute) {
      const attributeIndex = this.additionalAttributes.findIndex(
        ({ id }) => id === this.currentAttribute.id,
      );
      if (attributeIndex > -1) {
        this.additionalAttributes.splice(attributeIndex, 1);
      }
    }
    this.goToStep(RoleStepEnum.ADD_ADDITIONAL_ATTRIBUTE);
  }

  onClearMessageErrors(): void {
    if (this.messageErrors) {
      this.messageErrors = null;
    }
  }

  goToStep(step: RoleStepEnum) {
    this.updateModalWidth(step);
    this.step = step;
  }

  updateModalWidth(step: RoleStepEnum) {
    switch (step) {
      case RoleStepEnum.INFO:
      case RoleStepEnum.PERMISSION:
        updateModalWidth(this.$el, 640);
        break;
      default:
        updateModalWidth(this.$el, 776);
        break;
    }
  }

  onBack(): void {
    switch (this.step) {
      case RoleStepEnum.PERMISSION:
        this.goToStep(RoleStepEnum.INFO);
        return;
      case RoleStepEnum.ATTRIBUTE:
        this.goToStep(RoleStepEnum.PERMISSION);
        return;
      case RoleStepEnum.ADD_ADDITIONAL_ATTRIBUTE:
        this.goToStep(RoleStepEnum.ATTRIBUTE);
        return;
      case RoleStepEnum.ATTRIBUTE_SETTING:
        this.setCurrentAttribute();
        this.goToStep(RoleStepEnum.ADD_ADDITIONAL_ATTRIBUTE);
        return;
      default:
        break;
    }
  }

  onNext(params: RoleAndPermission.RoleParams) {
    this.formInput = { ...this.formInput, ...params };
    switch (this.step) {
      case RoleStepEnum.INFO:
        this.goToStep(RoleStepEnum.PERMISSION);
        break;
      case RoleStepEnum.PERMISSION:
        if (this.formInput.type === RoleTypeEnum.PRODUCT) {
          this.goToStep(RoleStepEnum.ATTRIBUTE);
        } else {
          this.onSubmit();
        }
        break;
      default:
        this.onSubmit();
        break;
    }
  }

  renderForm(): JSX.Element {
    return (
      <fragment>
        {this.isInfoStep && (
          <Info
            formData={this.formInput}
            isSubmitting={this.isSubmitting}
            messageErrors={this.messageErrors}
            changeInput={this.onClearMessageErrors}
            cancel={this.onCancel}
            next={this.onNext}
          />
        )}
        {this.isPermissionStep && (
          <PermissionsList
            formData={this.formInput}
            next={this.onNext}
            cancel={this.onCancel}
          />
        )}
        {this.isAttributeStep && (
          <Attribute
            identifierTypes={this.selectedIdentifierTypes}
            identityTypesOptions={this.identityTypesOptions}
            additionalAttributes={this.additionalAttributes}
            formData={this.formInput}
            changeIdentifierTypes={this.changeIdentifierTypes}
            cancel={this.onCancel}
            next={this.onNext}
            removeAttribute={this.removeAttribute}
            gotoAddAdditionalAttribute={() => {
              this.goToStep(RoleStepEnum.ADD_ADDITIONAL_ATTRIBUTE);
            }}
          />
        )}
        {this.isAddAdditionalAttributeStep && (
          <AttributeList
            selectedAttributesDefault={this.additionalAttributes}
            selectAttributes={this.onSelectAdditionalAttributes}
            editAttribute={this.editAdditionalAttribute}
            createNewAttribute={() => {
              this.goToStep(RoleStepEnum.ATTRIBUTE_SETTING);
            }}
          />
        )}
        {this.isAttributeSettingStep && (
          <AttributeSetting
            currentAttribute={this.currentAttribute}
            savedAttribute={this.handleSavedAttribute}
            deletedAttribute={this.onDeletedAttribute}
          />
        )}
      </fragment>
    );
  }

  render(): JSX.Element {
    return (
      <modal-layout
        closeModal={this.closeModal}
        title={this.title}
        showBack={!this.isInfoStep}
        back={this.onBack}
      >
        <Styled.Wrapper>
          {this.isLoading && <SpinLoading />}
          {!this.isLoading && this.renderForm()}
        </Styled.Wrapper>
      </modal-layout>
    );
  }
}
