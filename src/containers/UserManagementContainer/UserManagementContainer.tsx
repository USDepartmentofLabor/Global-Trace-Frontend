/* eslint-disable max-lines, max-lines-per-function */
import { Vue, Component } from 'vue-property-decorator';
import { get } from 'lodash';
import auth from 'store/modules/auth';
import { deleteUser, resendInvitation } from 'api/user-management';
import { getRoleList } from 'api/role';
import { UserStatusEnum } from 'enums/user';
import userManagement from 'store/modules/user-management';
import DropdownMenu from 'components/DropdownMenu';
import SupplierDetail from 'components/SupplierDetail';
import Button from 'components/FormUI/Button';
import DataTable from 'components/DataTable';
import { handleError } from 'components/Toast';
import { formatDate } from 'utils/date';
import { RoleTypeEnum } from 'enums/role';
import {
  getUserFacility,
  getUserRole,
  isSupplier,
  profileUpdated,
} from 'utils/user';
import * as Styled from './styled';

const ConfirmModal = () => import('modals/ConfirmModal');
const UserModal = () => import('modals/UserModal');

@Component
export default class UserManagementContainer extends Vue {
  private isLoading: boolean = false;
  private sortInfo: App.SortInfo = {
    sort: 'DESC',
    sortKey: 'createdAt',
  };
  private pagination: App.Pagination = {
    total: 1,
    lastPage: 1,
    perPage: 20,
    currentPage: 1,
  };
  private requestParams: App.RequestParams = null;
  private roles: RoleAndPermission.Role[] = [];
  private currentSupplierId: string = null;

  get columns(): App.DataTableColumn[] {
    return [
      {
        label: this.$t('account_type'),
        field: 'role',
        sortable: true,
        sortKey: 'role',
      },
      {
        label: this.$t('name'),
        field: 'name',
        sortable: true,
        sortKey: 'name',
        width: '200px',
      },
      {
        label: this.$t('email'),
        field: 'email',
        width: '300px',
      },
      {
        label: this.$t('status'),
        field: 'status',
        sortable: true,
        sortKey: 'status',
      },
      {
        label: this.$t('last_activity_capitalize'),
        field: 'lastLoginAt',
        sortable: true,
        sortKey: 'lastLoginAt',
      },
      {
        label: '',
        field: '',
        width: '333px',
      },
    ];
  }

  get actionOptions(): App.DropdownMenuOption[] {
    return this.roles
      .map(({ id, name }) => ({ id, name }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  created(): void {
    this.initData();
    this.getRoleList();
  }

  initData(): void {
    const { sort, sortKey } = this.sortInfo;
    this.requestParams = {
      page: this.pagination.currentPage,
      perPage: this.pagination.perPage,
      sortFields: `${sortKey}:${sort}`,
    };
    this.getUserList(this.requestParams);
  }

  getUserList(params?: UserManagement.RequestParams): void {
    const requestParams = { ...this.requestParams, ...params };
    this.isLoading = true;
    userManagement.getUserList({
      params: requestParams,
      callback: {
        onFailure: (error: App.ResponseError) => {
          handleError(error);
        },
        onFinish: () => {
          this.pagination = {
            total: userManagement.total,
            lastPage: userManagement.lastPage,
            currentPage: userManagement.currentPage,
            perPage: userManagement.perPage,
          };
          this.isLoading = false;
        },
      },
    });
  }

  async getRoleList() {
    try {
      this.roles = await getRoleList({ canInvite: true });
    } catch (error) {
      handleError(error as App.ResponseError);
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
    this.getUserList(this.requestParams);
  }

  pageOnChange(page: number): void {
    this.requestParams.page = page;
    this.getUserList(this.requestParams);
  }

  getOnBoardedName(user: Auth.User): string {
    if (profileUpdated(user)) {
      const facility = getUserFacility(user);
      return facility.name;
    }
    return `${user.firstName} ${user.lastName}`;
  }

  getName(user: Auth.User): string {
    const facility = getUserFacility(user);
    switch (user.role.type) {
      case RoleTypeEnum.ADMINISTRATOR:
      case RoleTypeEnum.BRAND:
      case RoleTypeEnum.API_USER:
        return `${user.firstName} ${user.lastName}`;
      case RoleTypeEnum.LABOR:
        return this.getOnBoardedName(user);
      default:
        return get(facility, 'name');
    }
  }

  userBusiness(user: Auth.User): string {
    const role = getUserRole(user);
    return role.name;
  }

  async deleteUser(userId: string): Promise<void> {
    try {
      await deleteUser(userId);
      this.initData();
      this.$toast.success(this.$t('deleteUserModal.successfully_removed_user'));
    } catch (error) {
      handleError(error as App.ResponseError);
    }
  }

  async resendInvitation(userId: string): Promise<void> {
    try {
      await resendInvitation(userId);
      this.$toast.success(this.$t('resendInvitationModal.resend_successfully'));
    } catch (error) {
      handleError(error as App.ResponseError);
    }
  }

  openDeleteUserModal(user: Auth.User): void {
    this.$modal.show(
      ConfirmModal,
      {
        icon: 'delete',
        iconSize: '44',
        message: this.$t('deleteUserModal.message'),
        note: this.$t('this_action_cannot_be_undone'),
        confirmLabel: this.$t('common.action.yes_delete'),
        confirmButtonVariant: 'danger',
        cancelLabel: this.$t('common.action.cancel'),
        onConfirm: () => this.deleteUser(user.id),
      },
      { width: '342px', height: 'auto', clickToClose: false, adaptive: true },
    );
  }

  openResendInvitationModal(user: Auth.User): void {
    this.$modal.show(
      ConfirmModal,
      {
        icon: 'resend_email',
        iconSize: '65',
        message: this.$t('resendInvitationModal.message'),
        confirmLabel: this.$t('common.action.yes_resend'),
        cancelLabel: this.$t('common.action.cancel'),
        onConfirm: () => this.resendInvitation(user.id),
      },
      { width: '320px', height: 'auto', clickToClose: false, adaptive: true },
    );
  }

  selectAction(option: App.DropdownMenuOption): void {
    const role = this.roles.find(({ id }) => id === option.id);
    this.openUserModal({
      role,
      isSupplier: role.type === RoleTypeEnum.PRODUCT,
    });
  }

  openUserModal(params: UserManagement.UserRequestParams): void {
    this.$modal.show(
      UserModal,
      {
        ...params,
        onSuccess: this.initData,
      },
      {
        width: '480px',
        height: 'auto',
        classes: 'overflow-visible',
        clickToClose: false,
        adaptive: true,
      },
    );
  }

  openSupplierModal(params: UserManagement.UserRequestParams): void {
    const { user } = params;
    const facility = getUserFacility(user);
    if (auth.hasViewSupplierDetail) {
      this.currentSupplierId = facility.id;
    }
  }

  resetCurrentSupplierId(): void {
    this.currentSupplierId = null;
  }

  renderEmpty(): JSX.Element {
    return <Styled.EmptyData slot="emptyRow" />;
  }

  renderResendInvitation(user: Auth.User): JSX.Element {
    return (
      <Styled.ResendInvitation
        vOn:click={() => this.openResendInvitationModal(user)}
      >
        <font-icon name="send_email" color="highland" size="20" />
        <Styled.InviteText>{this.$t('resend_invitation')}</Styled.InviteText>
      </Styled.ResendInvitation>
    );
  }

  renderUserInfo(user: Auth.User): JSX.Element {
    const lastLoginAt = user.lastLoginAt ? formatDate(user.lastLoginAt) : '';
    return (
      <fragment>
        <Styled.Td>{this.userBusiness(user)}</Styled.Td>
        <Styled.Td>
          <Styled.Cell>{this.getName(user)}</Styled.Cell>
        </Styled.Td>
        <Styled.Td>
          <Styled.Cell>{user.email}</Styled.Cell>
        </Styled.Td>
        <Styled.Td>
          {this.$t(UserStatusEnum[user.status].toLowerCase())}
        </Styled.Td>
        <Styled.Td>{lastLoginAt}</Styled.Td>
      </fragment>
    );
  }

  renderRowItem(user: Auth.User): JSX.Element {
    const isActive = user.status != UserStatusEnum.INVITED;
    const isInactive = user.status != UserStatusEnum.DEACTIVATED;
    const role = getUserRole(user);
    return (
      <Styled.Tr disabled={isInactive}>
        {this.renderUserInfo(user)}
        <Styled.Td>
          <Styled.RowActions>
            {isSupplier(user.role.type) &&
              auth.hasViewSupplierDetail &&
              isActive && (
                <Button
                  label={this.$t('common.action.view')}
                  icon="eye"
                  variant="transparentSecondary"
                  size="small"
                  iconSize="20"
                  click={() =>
                    this.openSupplierModal({
                      user: user,
                    })
                  }
                />
              )}
            {isActive && (
              <Button
                label={this.$t('edit')}
                icon="edit"
                variant="transparentSecondary"
                size="small"
                iconSize="20"
                click={() =>
                  this.openUserModal({
                    role,
                    user: user,
                    isSupplier: user.isSupplier,
                  })
                }
              />
            )}
            {!isActive && this.renderResendInvitation(user)}
            <Button
              label={this.$t('common.action.remove')}
              icon="delete"
              variant="transparentSecondary"
              size="small"
              iconSize="20"
              click={() => this.openDeleteUserModal(user)}
            />
          </Styled.RowActions>
        </Styled.Td>
      </Styled.Tr>
    );
  }

  renderActionOption(option: App.DropdownMenuOption): JSX.Element {
    return <Styled.Label>{option.name}</Styled.Label>;
  }

  render(): JSX.Element {
    return (
      <dashboard-layout>
        <Styled.HeaderAction slot="headerAction">
          <DropdownMenu
            options={this.actionOptions}
            selectOption={this.selectAction}
            scopedSlots={{
              menuOption: ({ option }: { option: App.DropdownMenuOption }) =>
                this.renderActionOption(option),
            }}
          >
            <Button width="168px" label={this.$t('add_new')} icon="plus" />
          </DropdownMenu>
        </Styled.HeaderAction>
        <Styled.Wrapper>
          <DataTable
            numberRowLoading={5}
            isLoading={this.isLoading}
            columns={this.columns}
            data={userManagement.users}
            pagination={this.pagination}
            sortColumn={this.sortColumn}
            pageOnChange={this.pageOnChange}
            scopedSlots={{
              tableRow: ({ item }: { item: Auth.User }) =>
                this.renderRowItem(item),
            }}
          >
            {this.renderEmpty()}
          </DataTable>
        </Styled.Wrapper>
        {this.currentSupplierId && (
          <SupplierDetail
            supplierId={this.currentSupplierId}
            close={this.resetCurrentSupplierId}
          />
        )}
      </dashboard-layout>
    );
  }
}
