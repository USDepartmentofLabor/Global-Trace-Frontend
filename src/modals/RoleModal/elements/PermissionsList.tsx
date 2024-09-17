import { Vue, Component, Prop } from 'vue-property-decorator';
import { cloneDeep, forOwn, get, isEmpty, uniq } from 'lodash';
import {
  ChainOfCustodyEnum,
  GroupTypeEnum,
  PermissionActionEnum,
  RoleTypeEnum,
} from 'enums/role';
import { handleError } from 'components/Toast';
import { SpinLoading } from 'components/Loaders';
import { getPermissions } from 'api/permission';
import InputGroup from 'components/FormUI/InputGroup';
import Button from 'components/FormUI/Button';
import PermissionsGroup from './PermissionsGroup';
import * as Styled from './styled';

@Component
export default class PermissionsList extends Vue {
  @Prop({ default: false }) formData: RoleAndPermission.RoleParams;
  @Prop() cancel: () => void;
  @Prop() next: (formInput: RoleAndPermission.RoleParams) => void;

  private isLoading: boolean = true;
  private groupedPermissionIds: { [x: string]: string[] } = {};
  private permissions: RoleAndPermission.NewPermission[] = [];
  private initPermissions: RoleAndPermission.NewPermission[] = [];
  private isEmptyPermissionIds = true;
  private formInput: RoleAndPermission.RoleParams = {
    assignedPermissionIds: [],
  };

  created() {
    this.initData();
  }

  async initData() {
    this.formInput.assignedPermissionIds = this.formData.assignedPermissionIds;
    await this.getPermissions();
    this.filterPermissions();
    this.initValue();
    this.isLoading = false;
  }

  initValue() {
    if (!isEmpty(this.formInput.assignedPermissionIds)) {
      this.permissions.forEach((permissionGroup) => {
        const values: string[] = this.formInput.assignedPermissionIds.filter(
          (permissionId) =>
            permissionGroup.subPermissions.some(
              ({ id }) => permissionId === id,
            ),
        );
        this.groupedPermissionIds[permissionGroup.id] = values;
      });
    }
  }

  async getPermissions(): Promise<void> {
    try {
      this.permissions = await getPermissions({ roleType: this.formData.type });
      if (this.formData.type === RoleTypeEnum.ADMINISTRATOR) {
        this.permissions = this.updateAdministratorPermissions(
          this.permissions,
        );
      }
      this.initPermissions = cloneDeep(this.permissions);
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

  filterPermissions() {
    const isRawMaterialExtractor = get(
      this.formData,
      'isRawMaterialExtractor',
      false,
    );
    const chainOfCustody = get(this.formData, 'chainOfCustody');
    if (
      isRawMaterialExtractor ||
      isEmpty(chainOfCustody) ||
      chainOfCustody === ChainOfCustodyEnum.PRODUCT_SEGREGATION
    ) {
      this.hideSubPermissions([PermissionActionEnum.VIEW_MARGIN_OF_ERROR]);
    } else {
      this.permissions = cloneDeep(this.initPermissions);
    }
  }

  hideSubPermissions(permissionActions: PermissionActionEnum[]) {
    this.permissions = cloneDeep(this.initPermissions).map(
      (permissionGroup) => {
        const ignoreSubPermissions = permissionGroup.subPermissions.filter(
          ({ action }) => permissionActions.includes(action),
        );
        if (!isEmpty(ignoreSubPermissions)) {
          this.formInput.assignedPermissionIds =
            this.formInput.assignedPermissionIds.filter((id) =>
              ignoreSubPermissions.some((permission) => permission.id !== id),
            );
          permissionGroup.subPermissions =
            permissionGroup.subPermissions.filter(({ action }) =>
              ignoreSubPermissions.some(
                (permission) => permission.action !== action,
              ),
            );
        }
        return permissionGroup;
      },
    );
  }

  onChange(permissionGroupId: string, ids: string[]): void {
    this.groupedPermissionIds[permissionGroupId] = ids;
    this.isEmptyPermissionIds = isEmpty(this.getPermissionIds());
  }

  onSubmit(): void {
    this.next({ assignedPermissionIds: this.getPermissionIds() });
  }

  getPermissionIds(): string[] {
    let permissionsIds: string[] = [];
    forOwn(this.groupedPermissionIds, (value, key) => {
      if (!isEmpty(value)) {
        value = value.filter((item) => !isEmpty(item));
        permissionsIds = uniq([...permissionsIds, key, ...value]);
      }
    });
    return permissionsIds;
  }

  renderActions(): JSX.Element {
    const label =
      this.formData.type === RoleTypeEnum.PRODUCT
        ? this.$t('next')
        : this.$t('done');
    return (
      <Styled.Actions>
        <Styled.ButtonGroupEnd>
          <Button
            label={this.$t('common.action.cancel')}
            variant="outlinePrimary"
            click={this.cancel}
          />
          <Button
            variant="primary"
            label={label}
            disabled={this.isEmptyPermissionIds}
            click={this.onSubmit}
          />
        </Styled.ButtonGroupEnd>
      </Styled.Actions>
    );
  }

  render(): JSX.Element {
    return (
      <InputGroup>
        <Styled.FormContainer>
          <perfect-scrollbar>
            <Styled.PermissionList>
              {this.isLoading && <SpinLoading />}
              {!this.isLoading &&
                this.permissions.map((permission) => (
                  <PermissionsGroup
                    key={permission.id}
                    defaultValues={this.formInput.assignedPermissionIds}
                    permissionGroup={permission}
                    change={(values: string[]) =>
                      this.onChange(permission.id, values)
                    }
                  />
                ))}
            </Styled.PermissionList>
          </perfect-scrollbar>
        </Styled.FormContainer>
        {this.renderActions()}
      </InputGroup>
    );
  }
}
