import { Vue, Component, Prop } from 'vue-property-decorator';
import moment from 'moment';
import { get } from 'lodash';
import { DATE_FORMAT, NO_TRACEABILITY_DATA } from 'config/constants';
import DataTable from 'components/DataTable';
import { formatDate } from 'utils/date';
import * as Styled from './styled';

@Component
export default class SupplierMappingDetail extends Vue {
  @Prop({ default: [] }) traceResultList: BrandSupplier.OrderSupplier[];

  get columns(): App.DataTableColumn[] {
    return [
      {
        label: this.$t('supplier'),
        width: '142px',
      },
      {
        label: this.$t('information'),
      },
    ];
  }

  renderDetail(label: string, value: string): JSX.Element {
    return (
      <Styled.Detail>
        {label}: <Styled.Value>{value}</Styled.Value>
      </Styled.Detail>
    );
  }

  renderNoTraceabilityNotice(
    orderSupplier: BrandSupplier.OrderSupplier,
  ): JSX.Element {
    const start = moment
      .unix(orderSupplier.tracedPurchasedAt)
      .subtract(2, 'week')
      .format(DATE_FORMAT);
    const end = formatDate(orderSupplier.tracedPurchasedAt);
    return (
      <Styled.Notice>
        {this.$t('no_traceability_data_detail', {
          name: orderSupplier.supplier.name,
          start: start,
          end: end,
          interpolation: { escapeValue: false },
        })}
      </Styled.Notice>
    );
  }

  renderTransaction(orderSupplier: BrandSupplier.OrderSupplier): JSX.Element {
    const purchaseOrderNumber = get(
      orderSupplier,
      'transactionInfo.purchaseOrderNumber',
    );
    const packingListNumber = get(
      orderSupplier,
      'transactionInfo.packingListNumber',
    );
    const invoiceNumber = get(orderSupplier, 'transactionInfo.invoiceNumber');
    const purchasedAt = get(orderSupplier, 'transactionInfo.purchasedAt');

    return (
      <fragment>
        {purchasedAt &&
          this.renderDetail(this.$t('purchase_date'), formatDate(purchasedAt))}
        {purchaseOrderNumber &&
          this.renderDetail(
            this.$t('purchase_order_number'),
            purchaseOrderNumber,
          )}
        {packingListNumber &&
          this.renderDetail(this.$t('package_list_number'), packingListNumber)}
        {invoiceNumber &&
          this.renderDetail(this.$t('invoice_number'), invoiceNumber)}
      </fragment>
    );
  }

  renderEmptyTransaction(
    orderSupplier: BrandSupplier.OrderSupplier,
  ): JSX.Element {
    return (
      <fragment>
        {this.renderDetail(
          this.$t('purchase_date'),
          formatDate(orderSupplier.tracedPurchasedAt),
        )}
      </fragment>
    );
  }

  renderRowItem(orderSupplier: BrandSupplier.OrderSupplier): JSX.Element {
    if (!orderSupplier.transactionInfo) {
      return;
    }
    if (orderSupplier && orderSupplier.supplier) {
      const isRootSupplier = orderSupplier.isRoot;
      const isNoTraceability =
        orderSupplier.tracedPurchasedAtLevel === NO_TRACEABILITY_DATA;
      const isEmptyTransaction = !isRootSupplier && isNoTraceability;
      const isNotAvailable = !isRootSupplier && !orderSupplier.transactionInfo;
      return (
        <Styled.Tr>
          <Styled.Td>
            <Styled.Name>{get(orderSupplier, 'supplier.name')}</Styled.Name>
          </Styled.Td>
          <Styled.Td>
            <Styled.Information>
              {isEmptyTransaction && this.renderEmptyTransaction(orderSupplier)}
              {!isEmptyTransaction && this.renderTransaction(orderSupplier)}
              {isNoTraceability &&
                this.renderNoTraceabilityNotice(orderSupplier)}
            </Styled.Information>
            {isNotAvailable && <Styled.Value>{this.$t('na')}</Styled.Value>}
          </Styled.Td>
        </Styled.Tr>
      );
    }
  }

  render(): JSX.Element {
    return (
      <Styled.TableWrapper>
        <Styled.Title>{this.$t('supplier_mapping_details')}</Styled.Title>
        <DataTable
          columns={this.columns}
          data={this.traceResultList}
          hasPagination={false}
          scopedSlots={{
            tableRow: ({ item }: { item: BrandSupplier.OrderSupplier }) =>
              this.renderRowItem(item),
          }}
        />
      </Styled.TableWrapper>
    );
  }
}
