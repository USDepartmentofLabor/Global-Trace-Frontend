import { Vue, Component } from 'vue-property-decorator';
import { isEmpty } from 'lodash';
import { PAGINATION_DEFAULT } from 'config/constants';
import { getShortToken } from 'api/auth';
import { downloadQRCodeUrl } from 'utils/download-helper';
import { formatDate } from 'utils/date';
import { getQRCodeList } from 'api/qr-code-management';
import { SpinLoading } from 'components/Loaders';
import Button from 'components/FormUI/Button';
import DataTable from 'components/DataTable';
import { handleError } from 'components/Toast';
import * as Styled from './styled';

const GenerateQRCodeModal = () => import('modals/GenerateQRCodeModal');

@Component
export default class QRCodeManagementContainer extends Vue {
  private isLoading: boolean = false;
  private isLoadingDownload: boolean = false;
  private sortInfoDefault: App.SortInfo = {
    sortKey: 'createdAt',
    sort: 'DESC',
  };
  private sortInfo: App.SortInfo = this.sortInfoDefault;
  private pagination: App.Pagination = PAGINATION_DEFAULT;
  private QRCodes: QRCodeManagement.QRCode[] = [];
  private requestParams: App.RequestParams = null;

  get columns(): App.DataTableColumn[] {
    return [
      {
        label: this.$t('date_created'),
        field: 'createdAt',
        sortable: true,
        sortKey: 'createdAt',
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
        label: this.$t('status'),
        field: 'status',
        width: '120px',
      },
      {
        label: '',
        field: '',
        width: '100px',
      },
      {
        label: '',
        field: '',
        width: '100px',
      },
      {
        label: '',
        field: '',
        width: '70px',
      },
    ];
  }

  get isEmptyData(): boolean {
    return isEmpty(this.QRCodes);
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

  async getQRCodeList(isFirstLoad: boolean = false): Promise<void> {
    try {
      this.isLoading = isFirstLoad;
      const response = await getQRCodeList(this.requestParams);
      this.QRCodes = response.items;
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
    this.requestParams.sortFields = `${key}:${type}`;
    this.getQRCodeList();
  }

  pageOnChange(page: number): void {
    this.requestParams.page = page;
    this.getQRCodeList();
  }

  setPage(page: number): void {
    this.requestParams.page = page;
  }

  resetTableOptions(): void {
    this.sortInfo = this.sortInfoDefault;
    this.pagination = PAGINATION_DEFAULT;
  }

  showGenerateQRCodeModal(): void {
    this.$modal.show(
      GenerateQRCodeModal,
      {
        onSuccess: () => {
          this.resetTableOptions();
          this.initData();
        },
      },
      {
        width: '360px',
        height: 'auto',
        classes: 'overflow-visible',
        clickToClose: false,
      },
    );
  }

  async downloadQRCode(QRCodeId: string): Promise<void> {
    try {
      this.isLoadingDownload = true;
      const response = await getShortToken();
      const downloadUrl = downloadQRCodeUrl(QRCodeId, response.shortToken);
      window.open(downloadUrl, '_blank');
    } catch (error) {
      handleError(error as App.ResponseError);
    } finally {
      this.isLoadingDownload = false;
    }
  }

  redirectToHistory(): void {
    this.$router.push({ name: 'QRCodeHistory' });
  }

  renderEmptyRow(): JSX.Element {
    return <Styled.EmptyRow slot="emptyRow" />;
  }

  renderStatusDetail(title: string, total: number): JSX.Element {
    return (
      <Styled.Td>
        <Styled.StatusContainer>
          <Styled.Status>{title}</Styled.Status>
          <Styled.Total>{total}</Styled.Total>
        </Styled.StatusContainer>
      </Styled.Td>
    );
  }

  renderQRCodeStatus(QRCode: QRCodeManagement.QRCode): JSX.Element {
    return (
      <fragment>
        {this.renderStatusDetail(this.$t('encoded'), QRCode.totalEncoded)}
        {this.renderStatusDetail(this.$t('active'), QRCode.totalActive)}
        {this.renderStatusDetail(this.$t('dispensed'), QRCode.totalDispensed)}
      </fragment>
    );
  }

  renderRowItem(QRCode: QRCodeManagement.QRCode): JSX.Element {
    return (
      <Styled.Tr>
        <Styled.Td>{formatDate(QRCode.createdAt)}</Styled.Td>
        <Styled.Td>{QRCode.name}</Styled.Td>
        <Styled.Td>
          {QRCode.creator.firstName} {QRCode.creator.lastName}
        </Styled.Td>
        <Styled.Td>
          <Styled.Quantity>{QRCode.quantity}</Styled.Quantity>
        </Styled.Td>
        {this.renderQRCodeStatus(QRCode)}
        <Styled.Td>
          <Styled.RowActions>
            <Button
              label={this.$t('download')}
              icon="download"
              variant="transparentSecondary"
              size="small"
              iconSize="20"
              click={() => {
                this.downloadQRCode(QRCode.id);
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
        <Styled.QRCodeAction>
          <Styled.ViewHistory vOn:click={this.redirectToHistory}>
            {this.$t('view_history')}
          </Styled.ViewHistory>
          <Button
            label={this.$t('generate_qr_code')}
            icon="qr_code"
            variant="primary"
            size="medium"
            iconSize="20"
            click={this.showGenerateQRCodeModal}
          />
        </Styled.QRCodeAction>
      </Styled.HeaderAction>
    );
  }

  renderTable(): JSX.Element {
    return (
      <DataTable
        numberRowLoading={5}
        isLoading={this.isLoading}
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
        {this.renderEmptyRow()}
      </DataTable>
    );
  }

  renderEmptyData(): JSX.Element {
    if (this.isLoading) {
      return <SpinLoading />;
    }
    return (
      <Styled.EmptyContainer>
        <Styled.EmptyText>
          {this.$t('qr_code_empty_description')}
        </Styled.EmptyText>
        <Styled.QRCodeEmptyImage />
      </Styled.EmptyContainer>
    );
  }

  render(): JSX.Element {
    return (
      <dashboard-layout>
        {this.renderHeader()}
        <Styled.Wrapper>
          {this.isEmptyData ? this.renderEmptyData() : this.renderTable()}
        </Styled.Wrapper>
        {this.isLoadingDownload && <SpinLoading isInline={false} />}
      </dashboard-layout>
    );
  }
}
