import { Vue, Component, Prop } from 'vue-property-decorator';
import { formatDate } from 'utils/date';
import * as Styled from './styled';

@Component
export default class Information extends Vue {
  @Prop({ required: true }) readonly orderDetail: BrandTrace.OrderDetail;

  render(): JSX.Element {
    return (
      <Styled.Content>
        <Styled.Group>
          <Styled.Label>{this.$t('supplier_name')}</Styled.Label>
          <Styled.Value>{this.orderDetail.supplier.name}</Styled.Value>
          <Styled.Label>{this.$t('purchase_order_number')}</Styled.Label>
          <Styled.Value>{this.orderDetail.purchaseOrderNumber}</Styled.Value>
        </Styled.Group>
        <Styled.Group>
          <Styled.Label>{this.$t('purchase_date')}</Styled.Label>
          <Styled.Value>
            {formatDate(this.orderDetail.purchasedAt)}
          </Styled.Value>
          <Styled.Label>{this.$t('invoice_number')}</Styled.Label>
          <Styled.Value>{this.orderDetail.invoiceNumber}</Styled.Value>
        </Styled.Group>
        <Styled.Group>
          <Styled.Label>{this.$t('package_list_number')}</Styled.Label>
          <Styled.Value>{this.orderDetail.packingListNumber}</Styled.Value>
        </Styled.Group>
      </Styled.Content>
    );
  }
}
