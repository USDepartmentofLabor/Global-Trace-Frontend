import { Vue, Component } from 'vue-property-decorator';
import { PAGINATION_DEFAULT } from 'config/constants';
import { formatDate } from 'utils/date';
import {
  deleteAllQRCode,
  deleteQRCode,
  getQRCodeHistory,
} from 'api/qr-code-management';
import { SpinLoading } from 'components/Loaders';
import Button from 'components/FormUI/Button';
import DataTable from 'components/DataTable';
import { handleError } from 'components/Toast';
import * as Styled from './styled';

const ConfirmModal = () => import('modals/ConfirmModal');

@Component
export default class QRCodeHistoryContainer extends Vue {
  private isLoading: boolean = false;
  private isSearching: boolean = false;
  private hasData: boolean = false;
  private isLoadingDelete: boolean = false;
  private sortInfo: App.SortInfo = {
    sortKey: 'completedAt',
    sort: 'DESC',
  };
  private pagination: App.Pagination = PAGINATION_DEFAULT;
  private requestParams: App.RequestParams = null;
  private QRCodes: QRCodeManagement.QRCode[] = [];

  get columns(): App.DataTableColumn[] {
    return [
      {
        label: this.$t('completion_date'),
        field: 'completedAt',
        sortable: true,
        sortKey: 'completedAt',
      },
      {
        label: this.$t('name'),
        field: 'name',
      },
      {
        label: this.$t('creator'),
        field: 'creator',
      },
      {
        label: this.$t('quantity'),
        field: 'quantity',
      },
      {
        label: '',
        field: '',
        width: '70px',
      },
    ];
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
    this.getQRCodeList(true);
  }

  async getQRCodeList(isFirstLoad = false): Promise<void> {
    try {
      this.isLoading = isFirstLoad;
      this.isSearching = !isFirstLoad;
      const response = await getQRCodeHistory(this.requestParams);
      this.QRCodes = response.items;
      this.pagination = {
        total: response.total,
        lastPage: response.lastPage,
        currentPage: response.currentPage,
        perPage: response.perPage,
      };
      if (isFirstLoad) {
        this.hasData = response.items.length > 0;
      }
    } catch (error) {
      handleError(error as App.ResponseError);
    } finally {
      this.isLoading = false;
      this.isSearching = false;
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
    this.getQRCodeList();
  }

  pageOnChange(page: number): void {
    this.requestParams.page = page;
    this.getQRCodeList();
  }

  async deleteQRCode(QRCodeId: string): Promise<void> {
    try {
      this.isLoadingDelete = true;
      const QRCodeName = this.QRCodes.find(({ id }) => id === QRCodeId).name;
      await deleteQRCode(QRCodeId);
      this.QRCodes = [];
      this.initData();
      this.$toast.success(
        this.$t('deleteQRCodeModal.delete_item_success_message', {
          item: QRCodeName,
        }),
      );
    } catch (error) {
      handleError(error as App.ResponseError);
    } finally {
      this.isLoadingDelete = false;
    }
  }

  async deleteAllQRCode(): Promise<void> {
    try {
      this.isLoadingDelete = true;
      await deleteAllQRCode();
      this.QRCodes = [];
      this.hasData = false;
      this.$toast.success(
        this.$t('deleteQRCodeModal.delete_all_success_message'),
      );
    } catch (error) {
      handleError(error as App.ResponseError);
    } finally {
      this.isLoadingDelete = false;
    }
  }

  openDeleteQRCodeModal(QRCode: QRCodeManagement.QRCode): void {
    this.$modal.show(
      ConfirmModal,
      {
        icon: 'delete',
        iconSize: '44',
        message: this.$t('deleteQRCodeModal.delete_item_message'),
        note: this.$t('this_action_cannot_be_undone'),
        confirmLabel: this.$t('common.action.yes_delete'),
        confirmButtonVariant: 'danger',
        cancelLabel: this.$t('common.action.cancel'),
        onConfirm: () => this.deleteQRCode(QRCode.id),
      },
      { width: '410px', height: 'auto', clickToClose: false, adaptive: true },
    );
  }

  openDeleteAllQRCodeModal(): void {
    this.$modal.show(
      ConfirmModal,
      {
        icon: 'delete',
        iconSize: '44',
        message: this.$t('deleteQRCodeModal.delete_all_message'),
        note: this.$t('this_action_cannot_be_undone'),
        confirmLabel: this.$t('common.action.yes_delete'),
        confirmButtonVariant: 'danger',
        cancelLabel: this.$t('common.action.cancel'),
        onConfirm: () => this.deleteAllQRCode(),
      },
      { width: '361px', height: 'auto', clickToClose: false, adaptive: true },
    );
  }

  redirectToQRCodeManagement(): void {
    this.$router.push({ name: 'QRCodeManagement' });
  }

  renderEmpty(): JSX.Element {
    return <Styled.EmptyData slot="emptyRow" />;
  }

  renderRowItem(QRCode: QRCodeManagement.QRCode): JSX.Element {
    return (
      <Styled.Tr>
        <Styled.Td>{formatDate(QRCode.completedAt)}</Styled.Td>
        <Styled.Td>{QRCode.name}</Styled.Td>
        <Styled.Td>
          {QRCode.creator.firstName} {QRCode.creator.lastName}
        </Styled.Td>
        <Styled.Td>
          <Styled.Quantity>{QRCode.quantity}</Styled.Quantity>
        </Styled.Td>
        <Styled.Td>
          <Styled.RowActions>
            <Button
              label={this.$t('delete')}
              icon="delete"
              variant="transparentSecondary"
              size="small"
              iconSize="20"
              click={() => {
                this.openDeleteQRCodeModal(QRCode);
              }}
            />
          </Styled.RowActions>
        </Styled.Td>
      </Styled.Tr>
    );
  }

  renderHeader(): JSX.Element {
    return (
      <Styled.HeaderAction slot="headerAction">
        <Styled.HeaderActionContent>
          <Styled.Back vOn:click={this.redirectToQRCodeManagement}>
            <font-icon name="arrow_left" color="stormGray" size="18" />
            <Styled.Link>{this.$t('back')}</Styled.Link>
          </Styled.Back>
        </Styled.HeaderActionContent>
      </Styled.HeaderAction>
    );
  }

  renderEmptyData(): JSX.Element {
    if (this.isLoading) {
      return <SpinLoading />;
    }
    return (
      <Styled.EmptyContainer>
        <Styled.EmptyText>{this.$t('history_empty')}</Styled.EmptyText>
        <Styled.QRCodeEmptyImage />
      </Styled.EmptyContainer>
    );
  }

  renderTable(): JSX.Element {
    return (
      <DataTable
        numberRowLoading={5}
        isLoading={this.isSearching}
        columns={this.columns}
        data={this.QRCodes}
        pagination={this.pagination}
        sortColumn={this.sortColumn}
        pageOnChange={this.pageOnChange}
        scopedSlots={{
          tableRow: ({ item }: { item: QRCodeManagement.QRCode }) =>
            this.renderRowItem(item),
        }}
      >
        {this.renderEmpty()}
      </DataTable>
    );
  }

  renderTableHeader(): JSX.Element {
    return (
      <Styled.TableHeader>
        <Styled.Title>{this.$t('history')}</Styled.Title>
        <Button
          underlineLabel={true}
          label={this.$t('delete_all')}
          icon="delete"
          variant="transparentSecondary"
          size="small"
          iconSize="20"
          click={() => {
            this.openDeleteAllQRCodeModal();
          }}
        />
      </Styled.TableHeader>
    );
  }

  renderContent(): JSX.Element {
    return (
      <Styled.Content>
        {this.renderTableHeader()}
        {this.renderTable()}
      </Styled.Content>
    );
  }

  render(): JSX.Element {
    return (
      <dashboard-layout>
        {this.renderHeader()}
        <Styled.Wrapper>
          {this.hasData ? this.renderContent() : this.renderEmptyData()}
        </Styled.Wrapper>
        {this.isLoadingDelete && <SpinLoading isInline={false} />}
      </dashboard-layout>
    );
  }
}
