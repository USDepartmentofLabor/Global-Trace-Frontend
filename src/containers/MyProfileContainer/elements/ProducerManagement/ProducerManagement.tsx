/* eslint-disable max-lines-per-function */
import { Vue, Component } from 'vue-property-decorator';
import { isEmpty } from 'lodash';
import producerManagement from 'store/modules/producer-management';
import Button from 'components/FormUI/Button';
import { handleError } from 'components/Toast';
import ProducerManagement from 'components/ProducerManagement';
import { SpinLoading } from 'components/Loaders';
import { getUserInfo } from 'utils/cookie';
import { isAdminUser } from 'utils/user';
import * as Styled from './styled';

const ProducerModal = () => import('modals/ProducerModal');

@Component
export default class ProducerManagementContainer extends Vue {
  private isLoading: boolean = true;
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

  get isEmptyData(): boolean {
    return isEmpty(producerManagement.users);
  }

  created(): void {
    this.initData();
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

  render(): JSX.Element {
    const showAddNewButton = !this.isEmptyData && this.canEdit;
    return (
      <Styled.Wrapper>
        <Styled.HeaderAction>
          <Styled.HeaderTitle>
            {this.$t('sidebar.user_management')}
          </Styled.HeaderTitle>
          {showAddNewButton && (
            <Button
              label={this.$t('add_new_user')}
              icon="plus"
              click={() =>
                this.openUserModal({
                  user: null,
                })
              }
            />
          )}
        </Styled.HeaderAction>
        <Styled.Container>
          {this.isLoading && <SpinLoading isInline={false} />}
          {!this.isLoading && <ProducerManagement />}
        </Styled.Container>
      </Styled.Wrapper>
    );
  }
}
