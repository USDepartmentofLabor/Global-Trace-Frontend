import { Vue, Component, Prop } from 'vue-property-decorator';
import { clone } from 'lodash';
import { formatNumber } from 'utils/helpers';
import {
  getProductsWeightTotal,
  showProductQuantity,
} from 'utils/product-attributes';
import Button from 'components/FormUI/Button';
import Tag from 'components/Tag';
import * as Styled from './styled';

const OutputProductModal = () => import('modals/OutputProductModal');

@Component
export default class OutPutProduct extends Vue {
  @Prop({ default: [] })
  readonly defaultProducts: AssignProduct.OutputProduct[];
  @Prop({ default: 0 }) readonly totalInputWeight: number;
  @Prop({ default: false }) readonly isSubmitting: boolean;
  @Prop({
    default: () => {
      //
    },
  })
  changeProducts: (products: AssignProduct.OutputProductData[]) => void;

  private products: AssignProduct.OutputProductData[] = [];

  get productsTag(): App.Tag {
    return {
      title: formatNumber(this.totalProducts),
      subTitle: formatNumber(this.productsWeightTotal),
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
    this.products = this.defaultProducts;
  }

  handleSuccess(products: AssignProduct.OutputProduct[]): void {
    this.products = clone(products);
    this.changeProducts(products);
  }

  showOutPutProductLotModal(): void {
    this.$modal.show(
      OutputProductModal,
      {
        defaultProducts: this.products,
        totalInputWeight: this.totalInputWeight,
        onSuccess: this.handleSuccess,
      },
      {
        width: '800px',
        height: 'auto',
        clickToClose: false,
        scrollable: true,
        adaptive: true,
      },
    );
  }

  renderProductTag(): JSX.Element {
    const title = `${this.productsTag.subTitle} ${this.$t('kg')}`;
    return (
      <Styled.Row>
        <Tag icon="menu_list" height="56px">
          <Styled.Total slot="title">
            <Styled.Strong>{this.productsTag.title}</Styled.Strong>
            {this.productLabel}
          </Styled.Total>
          {showProductQuantity(this.products) && (
            <Styled.Total slot="subTitle" isEllipsis title={title}>
              <Styled.Strong>{this.productsTag.subTitle}</Styled.Strong>
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
            click={this.showOutPutProductLotModal}
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
          label={this.$t('add_output_product')}
          variant="outlineWarning"
          size="large"
          disabled={this.isSubmitting}
          click={this.showOutPutProductLotModal}
        />
      </Styled.Row>
    );
  }

  render(): JSX.Element {
    if (this.totalProducts > 0) {
      return this.renderProductTag();
    } else {
      return this.renderAddLotButton();
    }
  }
}
