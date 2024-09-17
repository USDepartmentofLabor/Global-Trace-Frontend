import { Vue, Component } from 'vue-property-decorator';
import { get, isEmpty } from 'lodash';
import { PAGINATION_DEFAULT } from 'config/constants';
import { SpinLoading } from 'components/Loaders';
import DataTable from 'components/DataTable';
import { handleError } from 'components/Toast';
import auth from 'store/modules/auth';
import { getCAPList } from 'api/cap';
import { CapStatusEnum } from 'enums/brand';
import * as Styled from './styled';
import RowItem from './RowItem';

const ActionPlanModal = () => import('modals/ActionPlanModal');
const RequestExtensionModal = () => import('modals/RequestExtensionModal');
const ViewExtensionRequestModal = () =>
  import('modals/ViewExtensionRequestModal');

@Component
export default class CAPManagementContainer extends Vue {
  private isLoading: boolean = true;
  private sortInfoDefault: App.SortInfo = {
    sortKey: 'createdAt',
    sort: 'DESC',
  };
  private sortInfo: App.SortInfo = this.sortInfoDefault;
  private pagination: App.Pagination = PAGINATION_DEFAULT;
  private CAPs: CAP.CAP[] = [];
  private requestParams: App.RequestParams = null;

  get columns(): App.DataTableColumn[] {
    return [
      {
        label: this.$t('status'),
        field: 'status',
        sortable: true,
        sortKey: 'status',
      },
      {
        label: this.$t('organization'),
        field: 'organization',
      },
      {
        label: this.$t('target_completion_date'),
        field: 'targetCompletionAt',
        sortable: true,
        sortKey: 'targetCompletionAt',
      },
      {
        label: this.$t('last_activity'),
        field: 'updatedAt',
        sortable: true,
        sortKey: 'updatedAt',
      },
      {
        label: this.$t('outcome'),
        field: 'outcome',
      },
      auth.isProduct
        ? {
            label: '',
            field: '',
            width: '200px',
          }
        : null,
    ].filter((item) => !isEmpty(item));
  }

  get isEmptyData(): boolean {
    return isEmpty(this.CAPs);
  }

  created(): void {
    this.initData();
  }

  initData(): void {
    const { sort, sortKey } = this.sortInfo;
    this.requestParams = {
      page: this.pagination.currentPage,
      perPage: this.pagination.perPage,
      sortField: sortKey,
      sortDirection: sort,
    };
    this.getCAPList();
  }

  async getCAPList(): Promise<void> {
    try {
      this.isLoading = true;
      const response = await getCAPList(this.requestParams);
      this.CAPs = response.items;
      this.pagination = {
        total: response.total,
        lastPage: response.lastPage,
        currentPage: response.currentPage,
        perPage: response.perPage,
      };
    } catch (error) {
      handleError(error as App.ResponseError);
    } finally {
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
      sortField: key,
      sortDirection: type,
    };
    this.getCAPList();
  }

  pageOnChange(page: number): void {
    this.requestParams.page = page;
    this.getCAPList();
  }

  setPage(page: number): void {
    this.requestParams.page = page;
  }

  resetTableOptions(): void {
    this.sortInfo = this.sortInfoDefault;
    this.pagination = PAGINATION_DEFAULT;
  }

  addedCAP() {
    this.getCAPList();
  }

  openActionPlanModal(CAP: CAP.CAP) {
    this.$modal.show(
      ActionPlanModal,
      {
        facility: CAP.facility,
        createdFacility: CAP.createdFacility,
        capId: CAP.id,
        indicatorRiskData: [],
        onSuccess: this.getCAPList,
        onCloseModal: () => {
          if (CAP.status === CapStatusEnum.NEW && auth.isProduct) {
            CAP.status = CapStatusEnum.IN_PROGRESS;
          }
        },
      },
      {
        width: '729px',
        height: 'auto',
        clickToClose: false,
        scrollable: true,
        adaptive: true,
      },
    );
  }

  openRequestExtensionModal(CAP: CAP.CAP) {
    this.$modal.show(
      RequestExtensionModal,
      {
        facilityId: CAP.facilityId,
        name: get(CAP, 'createdFacility.name'),
        capId: CAP.id,
        onSuccess: this.getCAPList,
      },
      {
        width: '640px',
        height: 'auto',
        clickToClose: false,
        scrollable: true,
        adaptive: true,
      },
    );
  }

  openViewExtensionRequestModal(CAP: CAP.CAP) {
    this.$modal.show(
      ViewExtensionRequestModal,
      {
        facilityId: CAP.facilityId,
        cap: CAP,
        onSuccess: this.getCAPList,
      },
      {
        width: '640px',
        height: 'auto',
        clickToClose: false,
        scrollable: true,
        adaptive: true,
      },
    );
  }

  renderEmptyRow(): JSX.Element {
    return <Styled.EmptyRow slot="emptyRow" />;
  }

  renderEmptyData(): JSX.Element {
    if (this.isLoading) {
      return <SpinLoading />;
    }
    return (
      <Styled.Empty>
        <Styled.EmptyImage />
        <Styled.EmptyText>
          {this.$t('there_is_no_CAP_to_show')}
        </Styled.EmptyText>
      </Styled.Empty>
    );
  }

  renderTable(): JSX.Element {
    return (
      <DataTable
        numberRowLoading={5}
        isLoading={this.isLoading}
        columns={this.columns}
        data={this.CAPs}
        pagination={this.pagination}
        sortColumn={this.sortColumn}
        pageOnChange={this.pageOnChange}
        scopedSlots={{
          tableRow: ({ item }: { item: CAP.CAP }) => (
            <RowItem
              data={item}
              openRequestExtensionModal={this.openRequestExtensionModal}
              openActionPlanModal={this.openActionPlanModal}
              openViewExtensionRequestModal={this.openViewExtensionRequestModal}
            />
          ),
        }}
      >
        {this.renderEmptyRow()}
      </DataTable>
    );
  }

  render(): JSX.Element {
    return (
      <dashboard-layout>
        <Styled.Wrapper>
          {this.isEmptyData ? this.renderEmptyData() : this.renderTable()}
        </Styled.Wrapper>
      </dashboard-layout>
    );
  }
}
