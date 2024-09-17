/* eslint-disable max-lines-per-function */
import { Vue, Component } from 'vue-property-decorator';
import { isEmpty } from 'lodash';
import producerManagement from 'store/modules/producer-management';
import Button from 'components/FormUI/Button';
import { handleError } from 'components/Toast';
import { getUserInfo } from 'utils/cookie';
import auth from 'store/modules/auth';
import { isAdminUser } from 'utils/user';
import { SpinLoading } from 'components/Loaders';
import ProducerManagement from 'components/ProducerManagement';
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

  goToMyProfile() {
    if (auth.isBrand) {
      this.$router.push({ name: 'BrandProfile' });
    } else if (auth.isLabor) {
      this.$router.push({ name: 'AuditorProfile' });
    } else {
      this.$router.push({ name: 'MyProfile' });
    }
  }

  render(): JSX.Element {
    const showAddNewButton = !this.isEmptyData && this.canEdit;
    return (
      <dashboard-layout>
        <Styled.HeaderAction slot="headerAction">
          <Styled.HeaderActionContent>
            <Styled.Back vOn:click={this.goToMyProfile}>
              <font-icon name="arrow_left" color="stormGray" size="18" />
              <Styled.Link>{this.$t('back')}</Styled.Link>
            </Styled.Back>
          </Styled.HeaderActionContent>
          {showAddNewButton && (
            <Button
              width="168px"
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
        <Styled.Wrapper>
          {this.isLoading && <SpinLoading isInline={false} />}
          {!this.isLoading && <ProducerManagement />}
        </Styled.Wrapper>
      </dashboard-layout>
    );
  }
}
