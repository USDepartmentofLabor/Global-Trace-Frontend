import { Vue, Component, Prop } from 'vue-property-decorator';
import { find, get } from 'lodash';
import { formatDate, currentTimestamp } from 'utils/date';
import { ProductAttributeTypeEnum } from 'enums/product';
import * as Styled from './styled';

@Component
export default class Product extends Vue {
  @Prop({ default: null, required: true })
  product: AssignProduct.OutputProductData;
  @Prop() removeProduct: (addedTime: number) => void;

  get addedTime(): number {
    return get(this.product, 'addedTime', currentTimestamp());
  }

  get productID(): string {
    const attributeId = find(
      this.product.attributes,
      (attr: Purchase.ManualAddedAttribute) =>
        attr.type === ProductAttributeTypeEnum.PRODUCT_ID,
    );
    if (attributeId) {
      return get(attributeId, 'value', '');
    }
    return get(this.product, 'qrCode', '') as string;
  }

  render(): JSX.Element {
    return (
      <Styled.Wrapper>
        <Styled.ProductItem>
          <Styled.Time>{formatDate(this.addedTime)}</Styled.Time>
          <Styled.Code>{this.productID}</Styled.Code>
          <Styled.EmptyAttachments />
          <Styled.RemoveProduct>
            <font-icon
              name="remove"
              size="14"
              color="ghost"
              vOn:click_native={() => this.removeProduct(this.addedTime)}
            />
          </Styled.RemoveProduct>
        </Styled.ProductItem>
      </Styled.Wrapper>
    );
  }
}
