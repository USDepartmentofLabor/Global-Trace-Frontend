import { Vue, Component, Prop } from 'vue-property-decorator';
import { formatNumber } from 'utils/helpers';
import {
  getProductsWeightTotal,
  showProductQuantity,
} from 'utils/product-attributes';
import Button from 'components/FormUI/Button';
import Tag from 'components/Tag';
import * as Styled from './styled';

const PurchaseProductModal = () => import('modals/PurchaseProductModal');

@Component
export default class Product extends Vue {
  @Prop({ default: [] }) readonly productsDefault: Purchase.Product[];
  @Prop({ default: false }) readonly isSubmitting: boolean;
  @Prop({
    default: () => {
      //
    },
  })
  success: (products: Purchase.Product[]) => void;

  private products: Purchase.Product[] = [];

  get productsWeightTotal(): number {
    return getProductsWeightTotal(this.products);
  }

  get productTag(): App.Tag {
    return {
      title: formatNumber(this.productTotal),
      subTitle: formatNumber(this.productsWeightTotal),
    };
  }

  get productTotal(): number {
    return this.products.length;
  }

  get productLabel(): string {
    if (this.productTotal > 1) {
      return this.$t('products');
    } else {
      return this.$t('product');
    }
  }

  created(): void {
    this.products = this.productsDefault;
  }

  showPurchaseProductModal(): void {
    this.$modal.show(
      PurchaseProductModal,
      {
        productsDefault: this.products,
        onSuccess: this.success,
      },
      { width: '776px', height: 'auto', clickToClose: false, adaptive: true },
    );
  }

  renderProductTag(): JSX.Element {
    const title = `${this.productTag.subTitle} ${this.$t('kg')}`;
    return (
      <Styled.Row>
        <Tag icon="menu_list" height="56px">
          <Styled.Total slot="title">
            <Styled.Strong>{this.productTag.title}</Styled.Strong>
            {this.productLabel}
          </Styled.Total>
          {showProductQuantity(this.products) && (
            <Styled.Total slot="subTitle" isEllipsis title={title}>
              <Styled.Strong>{this.productTag.subTitle}</Styled.Strong>
              <Styled.LotWeight>{this.$t('kg')}</Styled.LotWeight>
            </Styled.Total>
          )}
          <Button
            slot="action"
            width="100%"
            type="button"
            icon="edit"
            iconSize="16"
            size="small"
            label={this.$t('edit')}
            variant="transparentWarning"
            disabled={this.isSubmitting}
            click={this.showPurchaseProductModal}
          />
        </Tag>
      </Styled.Row>
    );
  }

  renderAddLotButton(): JSX.Element {
    return (
      <Styled.Row>
        <Button
          width="100%"
          type="button"
          icon="plus"
          size="large"
          label={this.$t('add_item', { item: this.$t('products') })}
          variant="outlineWarning"
          disabled={this.isSubmitting}
          click={this.showPurchaseProductModal}
        />
      </Styled.Row>
    );
  }

  render(): JSX.Element {
    if (this.productTotal > 0) {
      return this.renderProductTag();
    } else {
      return this.renderAddLotButton();
    }
  }
}
