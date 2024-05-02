import { Vue, Component, Prop } from 'vue-property-decorator';
import { get, isEmpty } from 'lodash';
import moment from 'moment';
import { DATE_FORMAT, NO_TRACEABILITY_DATA } from 'config/constants';
import { getTraceList } from 'api/brand-trace';
import { getShortToken } from 'api/auth';
import {
  downloadDocumentsUrl,
  downloadOrderPdfUrl,
} from 'utils/download-helper';
import { currentTimezone, formatDate } from 'utils/date';
import app from 'store/modules/app';
import { OrderCategoryEnum } from 'enums/order';
import { SpinLoading } from 'components/Loaders';
import { handleError } from 'components/Toast';
import DataTable from 'components/DataTable';
import Button from 'components/FormUI/Button';
import * as Styled from './styled';
import Result from './Result';

const NoTracingDataModal = () => import('modals/NoTracingDataModal');

@Component
export default class TracingResult extends Vue {
  @Prop({ default: [] }) supplierGroups: BrandSupplier.SupplierItem[];
  @Prop({ default: null }) currentSupplierId: string;
  @Prop({
    default: () => {
      //
    },
  })
  changeCurrentSupplierId: (id: string) => void;

  private isLoading: boolean = false;
  private sortInfo: App.SortInfo = {
    sort: 'ASC',
    sortKey: 'transactedAt',
  };
  private requestParams: App.RequestParams = null;
  private orderSuppliers: BrandSupplier.OrderSupplier[] = [];
  private orderId: string = this.$route.params.id;
  private isDownloading: boolean = false;
  private disableExport: boolean = false;
  private tracingDataChecked: boolean = false;

  get columns(): App.DataTableColumn[] {
    return [
      {
        label: this.$t('business_name'),
        field: 'business_name',
        sortable: true,
        sortKey: 'supplierName',
      },
      {
        label: this.$t('purchase'),
        field: 'transactedAt',
        sortable: true,
        sortKey: 'transactedAt',
      },
      {
        label: this.$t('category'),
        field: 'category',
        width: '207px',
        sortable: true,
        sortKey: 'category',
      },
      {
        label: this.$t('available_documents'),
        field: 'available_documents',
      },
      {
        label: this.$t('risk_assessment'),
        field: 'risk_assessment',
      },
    ];
  }

  get noTraceabilityData(): BrandSupplier.OrderSupplier[] {
    return this.orderSuppliers.filter(
      ({ tracedPurchasedAtLevel }) =>
        tracedPurchasedAtLevel === NO_TRACEABILITY_DATA,
    );
  }

  get showNotice(): boolean {
    return this.tracingDataChecked && this.noTraceabilityData.length > 0;
  }

  created(): void {
    this.initData();
  }

  initData(): void {
    const { sort, sortKey } = this.sortInfo;
    this.requestParams = {
      sortField: sortKey,
      sortDirection: sort,
    };
    this.getTracingResult(this.requestParams);
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
    this.getTracingResult(this.requestParams);
  }

  async getTracingResult(params?: App.RequestParams): Promise<void> {
    try {
      this.isLoading = true;
      this.orderSuppliers = await getTraceList(this.orderId, params);
      this.checkTracingData();
    } catch (error) {
      handleError(error as App.ResponseError);
    } finally {
      this.isLoading = false;
    }
  }

  checkTracingData(): void {
    if (!this.tracingDataChecked) {
      const hasTraceData = this.orderSuppliers.some(
        ({ category }) => category === OrderCategoryEnum.TRACED,
      );
      this.disableExport = !hasTraceData;
      if (!hasTraceData) {
        this.openNoTracingDataModal();
      }
      this.tracingDataChecked = true;
    }
  }

  openNoTracingDataModal(): void {
    this.$modal.show(
      NoTracingDataModal,
      {
        supplierGroups: this.supplierGroups,
      },
      { width: '570px', height: 'auto', clickToClose: false, adaptive: true },
    );
  }

  async exportPdf(): Promise<void> {
    try {
      this.isDownloading = true;
      const response = await getShortToken();
      const downloadUrl = downloadOrderPdfUrl(
        this.orderId,
        currentTimezone,
        response.shortToken,
        app.locale,
      );
      window.open(downloadUrl, '_blank');
    } catch (error) {
      handleError(error as App.ResponseError);
    } finally {
      this.isDownloading = false;
    }
  }

  renderHeader(): JSX.Element {
    return (
      <Styled.Header>
        <Styled.Label>{this.$t('tracing_result')}</Styled.Label>
        <Button
          label={this.$t('export_PDF_file')}
          width="240px"
          disabled={this.disableExport}
          click={this.exportPdf}
        />
      </Styled.Header>
    );
  }

  renderEmpty(): JSX.Element {
    return <Styled.EmptyData slot="emptyRow" />;
  }

  async onDownloadDocument(
    orderSupplier: BrandSupplier.OrderSupplier,
  ): Promise<void> {
    const documentTransactionIds = get(
      orderSupplier,
      'document.transactionIds',
      [],
    );
    const defaultTransactionId = get(orderSupplier, 'transactionId');
    const transactionIds = isEmpty(documentTransactionIds)
      ? [defaultTransactionId]
      : documentTransactionIds;
    try {
      this.isDownloading = true;
      const response = await getShortToken();
      const downloadUrl = downloadDocumentsUrl(
        this.orderId,
        transactionIds.join(','),
        response.shortToken,
      );
      window.open(downloadUrl, '_blank');
    } catch (error) {
      handleError(error as App.ResponseError);
    } finally {
      this.isDownloading = false;
    }
  }

  renderResult(orderSupplier: BrandSupplier.OrderSupplier): JSX.Element {
    return (
      <Result
        orderSupplier={orderSupplier}
        currentSupplierId={this.currentSupplierId}
        downloadDocument={this.onDownloadDocument}
        changeCurrentSupplierId={this.changeCurrentSupplierId}
      />
    );
  }

  renderNoTraceabilityPartner(
    orderSupplier: BrandSupplier.OrderSupplier,
  ): JSX.Element {
    const { supplier, tracedPurchasedAt } = orderSupplier;
    const start = moment
      .unix(tracedPurchasedAt)
      .subtract(2, 'week')
      .format(DATE_FORMAT);
    const end = formatDate(tracedPurchasedAt);
    return (
      <Styled.Information>{`${supplier.name}: ${start}-${end}`}</Styled.Information>
    );
  }

  renderNotice(): JSX.Element {
    if (this.showNotice) {
      return (
        <Styled.Notice>
          <font-icon name="circle_warning" size="16" color="red" />
          <Styled.NoticeContent>
            <Styled.Text>{this.$t('no_traceability_data')}</Styled.Text>
            {this.noTraceabilityData.map((item) =>
              this.renderNoTraceabilityPartner(item),
            )}
          </Styled.NoticeContent>
        </Styled.Notice>
      );
    }
    return null;
  }

  render(): JSX.Element {
    return (
      <Styled.Wrapper>
        {this.renderNotice()}
        {this.renderHeader()}
        <DataTable
          numberRowLoading={5}
          isLoading={this.isLoading}
          columns={this.columns}
          data={this.orderSuppliers}
          hasPagination={false}
          sortColumn={this.sortColumn}
          scopedSlots={{
            tableRow: ({ item }: { item: BrandSupplier.OrderSupplier }) =>
              this.renderResult(item),
          }}
        >
          {this.renderEmpty()}
        </DataTable>
        {this.isDownloading && <SpinLoading isInline={false} />}
      </Styled.Wrapper>
    );
  }
}
