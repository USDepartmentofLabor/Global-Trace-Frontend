import { Vue, Component, Prop } from 'vue-property-decorator';
import { first, get } from 'lodash';
import { createUser, updateUser } from 'api/user-management';
import { UserRoleEnum } from 'enums/user';
import { RoleTypeEnum } from 'enums/role';
import { getUserRole } from 'utils/user';
import Button from 'components/FormUI/Button';
import UserInfo from './elements/UserInfo';
import * as Styled from './styled';

@Component
export default class UserModal extends Vue {
  @Prop({ default: null }) readonly role: RoleAndPermission.Role;
  @Prop({ default: [] }) readonly roles: RoleAndPermission.Role[];
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
    tier: '',
    isSupplier: false,
  };
  public isSubmitting: boolean = false;
  public messageErrors: App.MessageError = null;

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

  created(): void {
    this.initData();
  }

  initData(): void {
    if (this.isEdit) {
      const { firstName, lastName, email, status, facilities, isSupplier } =
        this.user;
      this.formInput.firstName = firstName;
      this.formInput.lastName = lastName;
      this.formInput.email = email;
      this.formInput.status = status;
      this.formInput.isSupplier = isSupplier;
      this.formInput.businessName =
        facilities && facilities.length && first(facilities).name;
      this.formInput.roleId = get(getUserRole(this.user), 'id', '');
    } else {
      this.formInput.roleId = get(this.role, 'id', '');
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
          tier: this.formInput.tier,
        }
      : null;

    return {
      ...this.formInput,
      isSupplier: this.isSupplier,
      roleId: this.isSupplier ? this.formInput.roleId : this.role.id,
      roleType: this.role.type,
      brandInformation,
      supplierInformation,
    };
  }

  getFacilityParams(): UserManagement.FacilityParams {
    if (this.isSupplier) {
      return {
        typeId: this.formInput.roleId,
        tier: this.formInput.tier,
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
        <Button
          width="100%"
          type="button"
          variant="transparentPrimary"
          label={this.$t('common.action.cancel')}
          disabled={this.isSubmitting}
          click={this.closeModal}
        />
        <Button
          width="100%"
          type="submit"
          variant="primary"
          label={this.submitLabel}
          isLoading={this.isSubmitting}
          disabled={this.isSubmitting || hasErrors}
        />
      </Styled.ButtonGroup>
    );
  }

  renderForm(): JSX.Element {
    return (
      <formulate-form
        v-model={this.formInput}
        name="userForm"
        scopedSlots={{
          default: ({ hasErrors }: { hasErrors: boolean }) => (
            <fragment>
              <UserInfo
                isShowBusinessName={this.isShowBusinessName}
                isSupplier={this.isSupplier}
                isShowStatus={this.isEdit}
                disabledTier={this.isSubmitting}
                disabledRoleId={this.isSubmitting}
                statusDefault={this.formInput.status}
                tierDefault={this.formInput.tier}
                roles={this.roles}
                roleIdDefault={this.formInput.roleId}
                disabled={this.isDisabledInput}
                messageErrors={this.messageErrors}
                changeInput={this.onClearMessageErrors}
              />
              {this.renderActions(hasErrors)}
            </fragment>
          ),
        }}
        vOn:submit={this.onSubmit}
      />
    );
  }

  render(): JSX.Element {
    return (
      <modal-layout showCloseIcon={false} title={this.title}>
        <Styled.Content>
          <perfect-scrollbar>{this.renderForm()}</perfect-scrollbar>
        </Styled.Content>
      </modal-layout>
    );
  }
}
