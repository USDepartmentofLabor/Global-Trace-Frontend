import { Vue, Component, Prop } from 'vue-property-decorator';
import { ProductStatusEnum } from 'enums/product';
import { formatNumber } from 'utils/helpers';
import {
  getProductsWeightTotal,
  showProductQuantity,
} from 'utils/product-attributes';
import Button from 'components/FormUI/Button';
import Tag from 'components/Tag';
import * as Styled from './styled';

const ProductModal = () => import('modals/ProductModal');

@Component
export default class CreateProduct extends Vue {
  @Prop({ default: true }) readonly isSell: boolean;
  @Prop({ default: [] }) readonly productsDefault: ProductManagement.Product[];
  @Prop({ required: true }) readonly status: ProductStatusEnum;
  @Prop({ default: false }) readonly isSubmitting: boolean;
  @Prop({
    default: () => {
      //
    },
  })
  success: (products: ProductManagement.Product[]) => void;

  private products: ProductManagement.Product[] = [];

  get productTag(): App.Tag {
    return {
      title: formatNumber(this.totalProducts),
      subTitle: formatNumber(this.productsWeightTotal),
    };
  }

  get totalProducts(): number {
    return this.products.length;
  }

  get simulatorProducts(): ProductManagement.Product[] {
    return this.products.map((product: ProductManagement.Product) => ({
      ...product,
      attributes: product.additionalAttributes,
    }));
  }

  get productsWeightTotal(): number {
    return getProductsWeightTotal(this.simulatorProducts);
  }

  get tagLabel(): string {
    if (this.totalProducts == 1) {
      return this.$t('product');
    }
    return this.$t('products');
  }

  created(): void {
    this.products = this.productsDefault;
  }

  showProductModal(): void {
    this.$modal.show(
      ProductModal,
      {
        isSell: this.isSell,
        productsDefault: this.products,
        status: this.status,
        onSuccess: this.success,
      },
      { width: '776px', height: 'auto', clickToClose: false, adaptive: true },
    );
  }

  renderProductTag(): JSX.Element {
    const { subTitle } = this.productTag;
    return (
      <Styled.Row>
        <Tag icon="menu_list" height="56px">
          <Styled.Total slot="title">
            <Styled.Strong>{this.productTag.title}</Styled.Strong>
            {this.tagLabel}
          </Styled.Total>
          {showProductQuantity(this.simulatorProducts) && (
            <Styled.Total slot="subTitle" isEllipsis title={subTitle}>
              <Styled.Strong>{subTitle}</Styled.Strong>
              <Styled.Weight>{this.$t('kg')}</Styled.Weight>
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
            click={this.showProductModal}
          />
        </Tag>
      </Styled.Row>
    );
  }

  renderAddProduct(): JSX.Element {
    return (
      <Styled.Row>
        <Button
          width="100%"
          type="button"
          icon="plus"
          textAlign="left"
          size="large"
          label={this.$t('add_item', {
            item: this.$t('product'),
          })}
          variant="lightWarning"
          disabled={this.isSubmitting}
          click={this.showProductModal}
        />
      </Styled.Row>
    );
  }

  render(): JSX.Element {
    if (this.totalProducts > 0) {
      return this.renderProductTag();
    } else {
      return this.renderAddProduct();
    }
  }
}
