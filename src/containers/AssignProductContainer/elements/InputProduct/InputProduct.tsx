import { Vue, Component, Prop } from 'vue-property-decorator';
import { formatWeight, formatNumber } from 'utils/helpers';
import {
  getProductsWeightTotal,
  showProductQuantity,
} from 'utils/product-attributes';
import Button from 'components/FormUI/Button';
import Tag from 'components/Tag';
import * as Styled from './styled';

const InputProductModal = () => import('modals/InputProductListModal');

@Component
export default class InputProduct extends Vue {
  @Prop({ default: [] }) readonly productsDefault: AssignProduct.Product[];
  @Prop({ default: false }) readonly isSubmitting: boolean;
  @Prop({
    default: () => {
      //
    },
  })
  onSuccess: (products: string[]) => void;

  private products: AssignProduct.Product[] = [];

  get productTag(): App.Tag {
    return {
      title: formatNumber(this.totalProducts),
      subTitle: formatNumber(formatWeight(this.productsWeightTotal)),
    };
  }

  get totalProducts(): number {
    return this.products.length;
  }

  get productsWeightTotal(): number {
    return getProductsWeightTotal(this.products);
  }

  get productLabel(): string {
    if (this.totalProducts > 1) {
      return this.$t('products');
    } else {
      return this.$t('product');
    }
  }

  created(): void {
    this.products = this.productsDefault;
  }

  showInputProductLotModal(): void {
    this.$modal.show(
      InputProductModal,
      {
        productsDefault: this.products,
        onSuccess: this.onSuccess,
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
              <Styled.LotUnit>{this.$t('kg')}</Styled.LotUnit>
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
            click={this.showInputProductLotModal}
          />
        </Tag>
      </Styled.Row>
    );
  }

  renderButtonAddProduct(): JSX.Element {
    return (
      <Styled.Row>
        <Button
          width="100%"
          type="button"
          icon="plus"
          textAlign="left"
          label={this.$t('add_input_product')}
          variant="lightWarning"
          size="large"
          disabled={this.isSubmitting}
          click={this.showInputProductLotModal}
        />
      </Styled.Row>
    );
  }

  render(): JSX.Element {
    if (this.totalProducts > 0) {
      return this.renderProductTag();
    } else {
      return this.renderButtonAddProduct();
    }
  }
}
