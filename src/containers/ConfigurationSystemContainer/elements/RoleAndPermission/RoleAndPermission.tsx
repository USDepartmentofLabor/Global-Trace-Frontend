/* eslint-disable max-lines */
import { Vue, Component } from 'vue-property-decorator';
import { groupBy, head, isEmpty, values } from 'lodash';
import { SettingTabEnum } from 'enums/setting';
import DataTable from 'components/DataTable/DataTable';
import Input from 'components/FormUI/Input';
import Button from 'components/FormUI/Button/Button';
import { handleError } from 'components/Toast';
import { SpinLoading } from 'components/Loaders';
import { convertEnumToTranslation } from 'utils/translation';
import { formatDate } from 'utils/date';
import { isLogGroup } from 'utils/user';
import saqModule from 'store/modules/saq';
import { deleteRole, getRoleList } from 'api/role';
import * as Styled from './styled';

const ConfirmModal = () => import('modals/ConfirmModal');
const RoleModal = () => import('modals/RoleModal');

@Component
export default class RoleAndPermission extends Vue {
  private isLoading = true;
  private isGetting: boolean = false;
  private isEmptyRoles: boolean = false;
  private roles: RoleAndPermission.Role[] = [];
  private sortInfo: App.SortInfo = {
    sortKey: 'createdAt',
    sort: 'DESC',
  };
  private search: string = '';
  private requestParams: App.RequestParams = null;

  get columns(): App.DataTableColumn[] {
    return [
      {
        label: this.$t('role'),
        field: 'name',
        sortable: true,
        sortKey: 'name',
      },
      {
        label: this.$t('type'),
        sortable: true,
        sortKey: 'type',
        field: 'type',
      },
      {
        label: this.$t('last_update'),
        field: 'lastUpdate',
        sortable: true,
        sortKey: 'lastUpdate',
      },
      {
        label: '',
        field: '',
        width: '70px',
      },
    ];
  }

  created() {
    this.initData();
  }

  initData(): void {
    const { sort, sortKey } = this.sortInfo;
    this.requestParams = {
      sortFields: `${sortKey}:${sort}`,
    };
    this.search = '';
    this.getRoleList(true, this.requestParams);
    this.getConfigurableSAQ();
  }

  reloadData() {
    this.sortInfo = {
      sortKey: 'createdAt',
      sort: 'DESC',
    };
    const { sort, sortKey } = this.sortInfo;
    this.requestParams = {
      key: this.search,
      sortFields: `${sortKey}:${sort}`,
    };
    this.getRoleList(false, this.requestParams);
  }

  async getConfigurableSAQ() {
    const requestParams = {
      sortField: 'createdAt',
      sortDirection: 'DESC',
    };
    saqModule.getConfigurableSAQ({
      params: requestParams,
      callback: {
        onFailure: (error: App.ResponseError) => {
          handleError(error);
        },
      },
    });
  }

  async getRoleList(
    isFirstLoad: boolean,
    params: RoleAndPermission.RequestParams,
  ) {
    try {
      this.isLoading = isFirstLoad;
      this.isGetting = true;
      const requestParams = { ...this.requestParams, ...params };
      this.roles = await getRoleList(requestParams);
      this.isEmptyRoles = isFirstLoad && isEmpty(this.roles);
    } catch (error) {
      handleError(error as App.ResponseError);
    } finally {
      this.isGetting = false;
      this.isLoading = false;
    }
  }

  sortColumn(key: string, type: string): void {
    this.sortInfo = {
      sort: type,
      sortKey: key,
    };
    this.requestParams = {
      ...this.requestParams,
      sortFields: `${key}:${type}`,
    };
    this.getRoleList(false, this.requestParams);
  }

  pageOnChange(page: number): void {
    this.requestParams.page = page;
    this.getRoleList(false, this.requestParams);
  }

  showRoleModal(role: RoleAndPermission.Role = null): void {
    this.$modal.show(
      RoleModal,
      {
        role,
        onSuccess: this.initData,
      },
      {
        width: '640px',
        height: 'auto',
        classes: 'overflow-visible',
        clickToClose: false,
        adaptive: true,
      },
    );
  }

  showConfirmDeleteModal(roleId: string): void {
    this.$modal.show(
      ConfirmModal,
      {
        icon: 'delete_forever',
        iconSize: '44',
        message: this.$t('delete_role_question'),
        note: this.$t('this_action_cannot_be_undone'),
        confirmLabel: this.$t('common.action.yes_remove'),
        confirmButtonVariant: 'danger',
        cancelLabel: this.$t('common.action.cancel'),
        onConfirm: () => this.onDelete(roleId),
      },
      { width: '351px', height: 'auto', clickToClose: false, adaptive: true },
    );
  }

  async onDelete(roleId: string): Promise<void> {
    try {
      await deleteRole(roleId);
      this.$toast.success(this.$t('deleted_role_successfully'));
      this.getRoleList(false, this.requestParams);
    } catch (error) {
      handleError(error as App.ResponseError);
    }
  }

  back(): void {
    this.$router.push({
      name: 'SuperSetting',
      query: { tabName: SettingTabEnum.ROLE_PERMISSION },
    });
  }

  handleInputSearch(value: string): void {
    this.search = value;
    this.requestParams.key = value;
    this.getRoleList(false, this.requestParams);
  }

  renderEmpty(): JSX.Element {
    if (!this.isLoading) {
      return (
        <Styled.EmptyContainer>
          <Styled.EmptyImage />
          <Styled.EmptyText>{this.$t('role_empty_text')}</Styled.EmptyText>
          <Button
            label={this.$t('add_new_role')}
            width="100%"
            click={() => this.showRoleModal()}
          />
        </Styled.EmptyContainer>
      );
    }
  }

  renderActions(role: RoleAndPermission.Role): JSX.Element {
    return (
      <Styled.Td>
        <Styled.RowActions>
          <Button
            label={this.$t('edit')}
            icon="edit"
            variant="transparentSecondary"
            size="small"
            iconSize="20"
            click={() => this.showRoleModal(role)}
          />
          <Button
            label={this.$t('delete')}
            icon="delete"
            variant="transparentSecondary"
            size="small"
            iconSize="20"
            click={() => this.showConfirmDeleteModal(role.id)}
          />
        </Styled.RowActions>
      </Styled.Td>
    );
  }

  renderPermissionName(
    permission: RoleAndPermission.Permission,
  ): JSX.Element[] {
    const elements: string[] = [];
    if (isLogGroup(permission.action)) {
      const metadata = values(permission.metadata);
      metadata.forEach((roleIds) =>
        roleIds.forEach((roleId) => {
          const role = this.roles.find(({ id }) => id === roleId);
          if (role) {
            elements.push(role.name);
          }
        }),
      );
    } else {
      elements.push(permission.name);
    }

    return elements.map((name) => <Styled.Item>{name}</Styled.Item>);
  }

  renderPermissionGroup(
    permissions: RoleAndPermission.Permission[],
  ): JSX.Element {
    const permissionSets = values(groupBy(permissions, 'set'));
    return (
      <Styled.PermissionSet>
        {permissionSets.map((permissionSet) => {
          const firstPermission = head(permissionSet);
          const { setName } = firstPermission;
          return (
            <Styled.PermissionGroup>
              {setName && (
                <Styled.PermissionGroupName>
                  {setName}
                </Styled.PermissionGroupName>
              )}
              {permissionSet.map((permision) => (
                <Styled.List>
                  {this.renderPermissionName(permision)}
                </Styled.List>
              ))}
            </Styled.PermissionGroup>
          );
        })}
      </Styled.PermissionSet>
    );
  }

  renderRowItem(role: RoleAndPermission.Role): JSX.Element {
    const roleType = convertEnumToTranslation(role.type);
    return (
      <Styled.Tr>
        <Styled.Td>
          <Styled.Label>{this.$t(role.name)}</Styled.Label>
        </Styled.Td>
        <Styled.Td>
          <Styled.Label>{this.$t(roleType)}</Styled.Label>
        </Styled.Td>
        <Styled.Td>{formatDate(role.updatedAt)}</Styled.Td>
        {this.renderActions(role)}
      </Styled.Tr>
    );
  }

  renderTableHeader(): JSX.Element {
    return (
      <Styled.TableHeader>
        <Input
          height="40px"
          name="search"
          size="large"
          value={this.search}
          placeholder={this.$t('search_for_role')}
          changeValue={(value: string) => {
            this.handleInputSearch(value);
          }}
          prefixIcon="search"
        />
        <Button
          label={this.$t('add_new_role')}
          width="100%"
          click={() => this.showRoleModal()}
        />
      </Styled.TableHeader>
    );
  }

  renderTable(): JSX.Element {
    return (
      <DataTable
        numberRowLoading={5}
        isLoading={this.isGetting}
        columns={this.columns}
        data={this.roles}
        sortInfo={this.sortInfo}
        hasPagination={false}
        sortColumn={this.sortColumn}
        pageOnChange={this.pageOnChange}
        scopedSlots={{
          tableRow: ({ item }: { item: RoleAndPermission.Role }) =>
            this.renderRowItem(item),
        }}
      />
    );
  }

  renderContent(): JSX.Element {
    if (this.isLoading) {
      return <SpinLoading />;
    }
    if (this.isEmptyRoles) {
      return this.renderEmpty();
    }
    return (
      <fragment>
        {this.renderTableHeader()}
        {this.renderTable()}
      </fragment>
    );
  }

  render(): JSX.Element {
    return <Styled.Wrapper>{this.renderContent()}</Styled.Wrapper>;
  }
}
