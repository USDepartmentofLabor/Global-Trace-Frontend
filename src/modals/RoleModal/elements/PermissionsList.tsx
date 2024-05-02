import { Vue, Component, Prop } from 'vue-property-decorator';
import { forOwn, isEmpty, uniq } from 'lodash';
import PermissionsGroup from './PermissionsGroup';
import * as Styled from './styled';

@Component
export default class PermissionsList extends Vue {
  @Prop({ default: [] }) defaultValues: string[];
  @Prop({ default: false }) isEdit: boolean;
  @Prop({ default: [] }) permissions: RoleAndPermission.NewPermission[];
  @Prop({
    default: () => {
      //
    },
  })
  change: (values: string[]) => void;

  private groupedPermissionIds: { [x: string]: string[] } = {};

  created() {
    if (!isEmpty(this.defaultValues)) {
      this.permissions.forEach((permissionGroup) => {
        const values: string[] = this.defaultValues.filter((permissionId) =>
          permissionGroup.subPermissions.some(({ id }) => permissionId === id),
        );
        this.groupedPermissionIds[permissionGroup.id] = values;
      });
    }
  }

  onChange(permissionGroupId: string, ids: string[]): void {
    this.groupedPermissionIds[permissionGroupId] = ids;
    this.change(this.getPermissionIds());
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

  render(): JSX.Element {
    return (
      <Styled.PermissionList>
        <Styled.PermissionTitle>
          {this.$t('assign_permissions')}
        </Styled.PermissionTitle>
        {!isEmpty(this.permissions) &&
          this.permissions.map((permission) => (
            <PermissionsGroup
              key={permission.id}
              defaultValues={this.defaultValues}
              permissionGroup={permission}
              change={(values: string[]) =>
                this.onChange(permission.id, values)
              }
            />
          ))}
      </Styled.PermissionList>
    );
  }
}
