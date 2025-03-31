import { Vue, Component, Prop } from 'vue-property-decorator';
import { first, get } from 'lodash';
import { createUser, updateUser } from 'api/user-management';
import { UserRoleEnum } from 'enums/user';
import { RoleTypeEnum } from 'enums/role';
import { getUserRole } from 'utils/user';
import InputGroup from 'components/FormUI/InputGroup';
import Button from 'components/FormUI/Button';
import { handleError } from 'components/Toast';
import { SpinLoading } from 'components/Loaders';
import { getCategories } from 'api/grievance-report';
import { CategoryTypeEnum } from 'enums/taxonomy-exploitation';
import UserInfo from './elements/UserInfo';
import * as Styled from './styled';

@Component
export default class UserModal extends Vue {
  @Prop({ default: null }) readonly role: RoleAndPermission.Role;
  @Prop({ default: false }) readonly isSupplier: boolean;
  @Prop({ default: null }) readonly user: Auth.User;
  @Prop({
    type: Function,
    default: () => {
      //
    },
  })
  onSuccess: () => void;

  private formInput: UserManagement.User = {
    firstName: '',
    lastName: '',
    email: '',
    roleId: null,
    status: null,
    businessName: null,
    isSupplier: false,
  };
  public isSubmitting: boolean = false;
  public messageErrors: App.MessageError = null;
  private isLoading = false;
  private riskIndices: GrievanceReport.Category[] = [];

  get isEdit(): boolean {
    return this.user !== null;
  }

  get submitLabel(): string {
    return this.isEdit ? this.$t('common.action.save_changes') : this.$t('add');
  }

  get isDisabledInput(): boolean {
    return this.isSubmitting || this.isEdit;
  }

  get userRole(): RoleAndPermission.Role {
    return this.isEdit ? getUserRole(this.user) : this.role;
  }

  get userRoleName(): string {
    return get(this, 'role.name', UserRoleEnum.SUPPLIER);
  }

  get title(): string {
    if (this.isEdit) {
      const roleName = this.$t(this.userRole.name.toLowerCase());
      return this.$t('userModal.edit_user', {
        user: roleName.toLowerCase(),
      });
    }
    return this.$t('userModal.add_new_user', {
      user: this.userRoleName,
    });
  }

  get isShowBusinessName(): boolean {
    if (this.userRole) {
      return this.isBrand || this.isSupplier;
    }
    return false;
  }

  get isBrand(): boolean {
    return this.userRole.type === RoleTypeEnum.BRAND;
  }

  get isAPIUser(): boolean {
    return this.userRole.type === RoleTypeEnum.API_USER;
  }

  created(): void {
    this.initData();
  }

  async initData(): Promise<void> {
    try {
      if (this.isAPIUser) {
        this.isLoading = true;
        this.riskIndices = await getCategories({
          type: CategoryTypeEnum.EXTERNAL_RISK_INDICATOR,
        });
      }
      this.initFormData();
    } catch (error) {
      handleError(error as App.ResponseError);
    } finally {
      this.isLoading = false;
    }
  }

  initFormData(): void {
    if (this.isEdit) {
      const {
        firstName,
        lastName,
        email,
        status,
        facilities,
        isSupplier,
        userApiLimit,
      } = this.user;
      this.formInput.firstName = firstName;
      this.formInput.lastName = lastName;
      this.formInput.email = email;
      this.formInput.status = status;
      this.formInput.isSupplier = isSupplier;
      this.formInput.businessName =
        facilities && facilities.length && first(facilities).name;
      this.formInput.roleId = get(getUserRole(this.user), 'id', '');
      this.initAPIUserData(userApiLimit);
    } else {
      this.formInput.roleId = get(this.role, 'id', '');
    }
  }

  initAPIUserData(userApiLimit: UserManagement.UserApiLimit) {
    if (this.isAPIUser) {
      this.formInput.editableExternalRiskIndexIds =
        userApiLimit.editableExternalRiskIndexIds;
      this.formInput.maximumCreateExternalRiskIndex =
        userApiLimit.maximumCreateExternalRiskIndex.toString();
    }
  }

  onClearMessageErrors(): void {
    if (this.messageErrors) {
      this.messageErrors = null;
    }
  }

  getCreateUserParams(): UserManagement.User {
    const brandInformation = this.isBrand
      ? {
          name: this.formInput.businessName,
        }
      : null;
    const supplierInformation = this.isSupplier
      ? {
          name: this.formInput.businessName,
        }
      : null;
    const userApiLimit = this.getUserApiParams();

    return {
      ...this.formInput,
      isSupplier: this.isSupplier,
      roleId: this.isSupplier ? this.formInput.roleId : this.role.id,
      roleType: this.role.type,
      brandInformation,
      supplierInformation,
      userApiLimit,
    };
  }

  getUserApiParams(): UserManagement.UserApiLimit {
    if (this.isAPIUser) {
      const { editableExternalRiskIndexIds, maximumCreateExternalRiskIndex } =
        this.formInput;
      return {
        editableExternalRiskIndexIds,
        maximumCreateExternalRiskIndex: maximumCreateExternalRiskIndex
          ? parseInt(maximumCreateExternalRiskIndex, 10)
          : undefined,
      };
    }
    return null;
  }

  getFacilityParams(): UserManagement.FacilityParams {
    if (this.isSupplier) {
      return {
        typeId: this.formInput.roleId,
      };
    }
    return undefined;
  }

  getEditUserParams(): UserManagement.EditParams {
    return {
      user: {
        status: this.formInput.status,
      },
      facility: this.getFacilityParams(),
    };
  }

  async onSubmit(): Promise<void> {
    this.isSubmitting = true;
    try {
      if (this.isEdit) {
        await updateUser(this.user.id, this.getEditUserParams());
      } else {
        await createUser(this.getCreateUserParams());
      }
      this.onSuccess();
      this.closeModal();
      this.showSuccessMessage();
    } catch (error) {
      this.messageErrors = get(error, 'errors');
    } finally {
      this.isSubmitting = false;
    }
  }

  showSuccessMessage(): void {
    const successMessage = this.isEdit
      ? this.$t('userModal.successfully_saved')
      : this.$t('userModal.add_new_user_successfully', {
          role: this.role.name,
        });
    this.$toast.success(successMessage);
  }

  closeModal(): void {
    this.$emit('close');
  }

  renderActions(hasErrors: boolean): JSX.Element {
    return (
      <Styled.ButtonGroup>
        <Styled.ButtonGroupEnd>
          <Button
            type="button"
            variant="transparentPrimary"
            label={this.$t('common.action.cancel')}
            disabled={this.isSubmitting}
            click={this.closeModal}
          />
          <Button
            type="submit"
            variant="primary"
            label={this.submitLabel}
            isLoading={this.isSubmitting}
            disabled={this.isSubmitting || hasErrors}
          />
        </Styled.ButtonGroupEnd>
      </Styled.ButtonGroup>
    );
  }

  renderForm(): JSX.Element {
    if (this.isLoading) {
      return (
        <Styled.Loading>
          <SpinLoading />
        </Styled.Loading>
      );
    }
    return (
      <formulate-form
        v-model={this.formInput}
        name="userForm"
        scopedSlots={{
          default: ({ hasErrors }: { hasErrors: boolean }) => (
            <InputGroup>
              <UserInfo
                isShowBusinessName={this.isShowBusinessName}
                isShowStatus={this.isEdit}
                disabledRoleId={this.isSubmitting}
                statusDefault={this.formInput.status}
                role={this.role}
                riskIndices={this.riskIndices}
                roleIdDefault={this.formInput.roleId}
                disabled={this.isDisabledInput}
                messageErrors={this.messageErrors}
                changeInput={this.onClearMessageErrors}
              />
              {this.renderActions(hasErrors)}
            </InputGroup>
          ),
        }}
        vOn:submit={this.onSubmit}
      />
    );
  }

  render(): JSX.Element {
    return (
      <modal-layout closeModal={this.closeModal} title={this.title}>
        <Styled.Content>
          <perfect-scrollbar>{this.renderForm()}</perfect-scrollbar>
        </Styled.Content>
      </modal-layout>
    );
  }
}
