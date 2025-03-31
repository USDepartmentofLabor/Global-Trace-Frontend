import { Vue, Component, Prop } from 'vue-property-decorator';
import { get } from 'lodash';
import Button from 'components/FormUI/Button';
import * as Styled from './styled';

@Component
export default class ProductOrder extends Vue {
  @Prop({ default: null }) readonly order: BrandProduct.Order;
  @Prop({ required: true }) editOrder: (order: BrandProduct.Order) => void;

  onTrace(id: string): void {
    this.$router.push({
      name: 'BrandProductTrace',
      params: { id },
    });
  }

  render(): JSX.Element {
    return (
      <Styled.Tr>
        <Styled.Td>{get(this.order, 'supplier.name')}</Styled.Td>
        <Styled.Td>{this.order.purchaseOrderNumber}</Styled.Td>
        <Styled.Td>{this.order.productDescription}</Styled.Td>
        <Styled.Td>{this.order.quantity}</Styled.Td>
        <Styled.Td>
          <Button
            variant="transparentPrimary"
            icon="edit"
            iconSize="20"
            size="small"
            label={this.$t('edit')}
            underlineLabel
            click={() => this.editOrder(this.order)}
          />
        </Styled.Td>
        <Styled.Td>
          <Button
            variant="outlinePrimary"
            icon="arrow_outline"
            iconSize="20"
            size="small"
            label={this.$t('brandOrderPage.trace')}
            click={() => this.onTrace(this.order.id)}
          />
        </Styled.Td>
      </Styled.Tr>
    );
  }
}
