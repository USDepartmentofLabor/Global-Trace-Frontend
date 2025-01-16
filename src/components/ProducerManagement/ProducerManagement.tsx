/* eslint-disable max-lines, max-lines-per-function */
import { Vue, Component } from 'vue-property-decorator';
import { get, isEmpty } from 'lodash';
import { deleteUser, resendInvitation } from 'api/producer-management';
import { ProducerTypeEnum, UserStatusEnum } from 'enums/user';
import producerManagement from 'store/modules/producer-management';
import Button from 'components/FormUI/Button';
import { convertEnumToTranslation } from 'utils/translation';
import DataTable from 'components/DataTable';
import { handleError } from 'components/Toast';
import { formatDate } from 'utils/date';
import { getUserInfo } from 'utils/cookie';
import { getUserFacility, isAdminUser, profileUpdated } from 'utils/user';
import { SpinLoading } from 'components/Loaders';
import * as Styled from './styled';

const ConfirmModal = () => import('modals/ConfirmModal');
const ProducerModal = () => import('modals/ProducerModal');

@Component
export default class ProducerManagement extends Vue {
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

  get canEdit(): boolean {
    const userInfo = getUserInfo();
    return isAdminUser(userInfo);
  }

  get columns(): App.DataTableColumn[] {
    const columns: App.DataTableColumn[] = [
      {
        label: this.$t('type'),
        field: 'type',
        sortable: true,
        sortKey: 'userType',
        width: '150px',
      },
      {
        label: this.$t('name'),
        field: 'name',
        sortable: true,
        sortKey: 'name',
        width: '180px',
      },
      {
        label: this.$t('email'),
        field: 'email',
        width: '270px',
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
    ];
    if (this.canEdit) {
      columns.push({
        label: '',
        field: '',
        width: '300px',
      });
    }
    return columns;
  }

  get isEmptyData(): boolean {
    return isEmpty(producerManagement.users);
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
    producerManagement.getUserList({
      params: requestParams,
      callback: {
        onFailure: (error: App.ResponseError) => {
          handleError(error);
        },
        onFinish: () => {
          this.pagination = {
            total: producerManagement.total,
            lastPage: producerManagement.lastPage,
            currentPage: producerManagement.currentPage,
            perPage: producerManagement.perPage,
          };
          this.isLoading = false;
        },
      },
    });
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
    return `${user.firstName} ${user.lastName}`;
  }

  getType(user: Auth.User): string {
    return this.$t(convertEnumToTranslation(get(user, 'userType', '')));
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

  openUserModal(params: UserManagement.UserRequestParams): void {
    this.$modal.show(
      ProducerModal,
      {
        ...params,
        onSuccess: this.initData,
      },
      {
        width: '600px',
        height: 'auto',
        classes: 'overflow-visible',
        clickToClose: false,
        adaptive: true,
      },
    );
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
        <Styled.Td>
          {this.getType(user)}{' '}
          {user.userType === ProducerTypeEnum.ADMIN && (
            <font-icon name="admin_user" size="20" color="manatee" />
          )}
        </Styled.Td>
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
    return (
      <Styled.Tr disabled={isInactive}>
        {this.renderUserInfo(user)}
        {this.canEdit && (
          <Styled.Td>
            <Styled.RowActions>
              {isActive && (
                <Button
                  label={this.$t('edit')}
                  icon="edit"
                  variant="transparentSecondary"
                  size="small"
                  iconSize="20"
                  click={() =>
                    this.openUserModal({
                      user: user,
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
        )}
      </Styled.Tr>
    );
  }

  renderActionOption(option: App.DropdownMenuOption): JSX.Element {
    return <Styled.Label>{option.name}</Styled.Label>;
  }

  renderEmptyData(): JSX.Element {
    if (this.isLoading) {
      return <SpinLoading />;
    }
    return (
      <Styled.Empty>
        <Styled.EmptyImage />
        <Styled.EmptyText>{this.$t('empty_producer_message')}</Styled.EmptyText>
        {this.canEdit && (
          <Styled.EmptyAction>
            <Button
              label={this.$t('add_new_user')}
              width="100%"
              icon="plus"
              click={() =>
                this.openUserModal({
                  user: null,
                })
              }
            />
          </Styled.EmptyAction>
        )}
      </Styled.Empty>
    );
  }

  renderTable(): JSX.Element {
    return (
      <DataTable
        numberRowLoading={5}
        isLoading={this.isLoading}
        columns={this.columns}
        data={producerManagement.users}
        pagination={this.pagination}
        sortColumn={this.sortColumn}
        pageOnChange={this.pageOnChange}
        scopedSlots={{
          tableRow: ({ item }: { item: Auth.User }) => this.renderRowItem(item),
        }}
      />
    );
  }

  render(): JSX.Element {
    return (
      <fragment>
        {this.isEmptyData ? this.renderEmptyData() : this.renderTable()}
      </fragment>
    );
  }
}
