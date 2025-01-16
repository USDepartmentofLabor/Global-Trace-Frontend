/* eslint-disable max-lines */
import { Vue, Component, Prop } from 'vue-property-decorator';
import {
  assign,
  findIndex,
  orderBy,
  some,
  get,
  cloneDeep,
  map,
  pick,
} from 'lodash';
import { InputAttributeEnum, SortType } from 'enums/app';

import { currentTimestamp } from 'utils/date';
import {
  validProduct,
  validProductId,
  getProductId,
} from 'utils/product-attributes';
import { ProductAttributeTypeEnum } from 'enums/product';
import auth from 'store/modules/auth';
import ProductModule from 'store/modules/product';
import { handleError } from 'components/Toast';
import { SpinLoading } from 'components/Loaders';
import Button from 'components/FormUI/Button';
import ProductAttributes from 'components/InputAttribute';
import Input from 'components/FormUI/Input';
import InputGroup from 'components/FormUI/InputGroup';
import Product from './elements/Product';
import ProductId from './elements/ProductId';
import * as Styled from './styled';

@Component
export default class OutputProductModal extends Vue {
  @Prop({ default: [] })
  readonly defaultProducts: AssignProduct.OutputProduct[];
  @Prop({ default: 0 }) readonly totalInputWeight: number;
  @Prop({
    default: () => {
      //
    },
  })
  onSuccess: (products: AssignProduct.OutputProductData[]) => void;

  private isLoading: boolean = false;
  private hasProductId: boolean = false;
  private isSubmitting: boolean = false;
  private formName: string = 'outputProductForm';
  private filters: AssignProduct.ProductLotFilterParams = {
    createdAt: SortType.DESC,
    code: SortType.DESC,
  };

  private outputProducts: AssignProduct.OutputProductData[] = [];
  private definitionAttributes: ProductAttribute.ProductDefinitionAttribute[];
  private productDataDefault: AssignProduct.OutputProductData = {
    code: '',
    attributes: [],
    dnaIdentifier: '',
    qrCode: null,
  };
  private productData: AssignProduct.OutputProductData = {
    code: '',
    attributes: [],
    dnaIdentifier: '',
    qrCode: null,
  };

  get formData(): AssignProduct.OutputProduct {
    return this.$formulate.registry.get(this.formName).proxy;
  }

  get isDisabled(): boolean {
    return this.outputProducts.length == 0;
  }

  get validateInputAttributeParams(): ProductAttribute.ValidateInputParams[] {
    return map(this.productData.attributes, (attribute) =>
      pick(attribute, ['category', 'value', 'isOptional', 'quantityUnit']),
    );
  }

  get isValidProduct(): boolean {
    return validProduct(this.validateInputAttributeParams);
  }

  get isShowProductIdDefault(): boolean {
    return !this.hasProductId && auth.hasAssignQRCode;
  }

  created(): void {
    this.initData();
    this.outputProducts = this.defaultProducts;
  }

  initData() {
    try {
      this.isLoading = true;
      const { id, productDefinitionAttributes } =
        ProductModule.currentOutputProduct;
      this.productData.code = id;

      const availableAttributes = productDefinitionAttributes.filter(
        (productAttribute: Purchase.ProductDefinitionAttribute) =>
          !productAttribute.isAddManuallyOnly,
      );
      this.hasProductId = some(
        availableAttributes,
        (attribute: ProductAttribute.ProductDefinitionAttribute) =>
          get(attribute, 'attribute.type') ===
          ProductAttributeTypeEnum.PRODUCT_ID,
      );

      this.definitionAttributes = availableAttributes;
      availableAttributes.forEach(
        (productAttribute: Purchase.ProductDefinitionAttribute) => {
          const { attribute, isOptional } = productAttribute;
          this.productData.attributes = [
            ...this.productData.attributes,
            {
              category: attribute.category,
              isOptional,
              type: attribute.type,
              id: attribute.id,
              value: null,
              quantityUnit: null,
            },
          ];
        },
      );

      this.productDataDefault = cloneDeep(this.productData);
    } catch (error) {
      handleError(error as App.ResponseError);
    } finally {
      this.isLoading = false;
    }
  }

  isAttachment(attribute: ProductAttribute.AttributeParams): boolean {
    return get(attribute, 'category') === InputAttributeEnum.ATTACHMENTS;
  }

  private getProductPayload(): ProductManagement.AddedProduct {
    for (let index = 0; index < this.productData.attributes.length; index++) {
      const element = this.productData.attributes[index];
      if (this.isAttachment(element)) {
        this.productData.attributes[index].value = get(
          this.productData.attributes[index],
          'value.selectedFiles',
        );
      }
    }
    return this.productData;
  }

  async onAddProduct(): Promise<void> {
    if (validProductId(getProductId(this.productData), this.outputProducts)) {
      this.outputProducts.push({
        ...this.getProductPayload(),
        addedTime: currentTimestamp(),
      });
      this.isSubmitting = true;
      await this.onReset();
      this.isSubmitting = false;
    } else {
      this.$toast.error(this.$t('duplicate_product_id'));
    }
  }

  changeSortFilter(key: string): void {
    this.filters[key] =
      this.filters[key] === SortType.ASC ? SortType.DESC : SortType.ASC;
    const productOrder = orderBy(
      this.outputProducts,
      [key],
      [this.filters[key]],
    );
    this.outputProducts = productOrder;
  }

  removeProduct(addedTime: number): void {
    this.outputProducts = this.outputProducts.filter(
      (product: AssignProduct.OutputProductData) =>
        product.addedTime != addedTime,
    );
  }

  closeModal(): void {
    this.$emit('close');
  }

  onChangeQrCode(qrCode: string) {
    this.productData.qrCode = qrCode;
  }

  onChangeAttribute(params: ProductAttribute.AttributeParams) {
    const { id } = params;
    const currentIndex = findIndex(
      this.productData.attributes,
      (attribute: ProductAttribute.AttributeParams) => attribute.id === id,
    );
    if (currentIndex > -1) {
      assign(this.productData.attributes[currentIndex], params);
    }
  }

  handleSuccess(): void {
    this.$toast.success(
      this.$t('add_success', {
        item: this.$t('products'),
      }),
    );
    this.onSuccess && this.onSuccess(this.outputProducts);
    this.closeModal();
  }

  onReset(): void {
    const qrCode = get(this.productData, 'qrCode');
    this.productData = cloneDeep(this.productDataDefault);
    if (qrCode) {
      this.productData.qrCode = qrCode;
    }
  }

  onChangeCodeDefault(value: string): void {
    this.productData.qrCode = value;
  }

  onChangeDNA(value: string): void {
    this.productData.dnaIdentifier = value;
  }

  renderAction(hasErrors: boolean): JSX.Element {
    return (
      <Styled.Actions>
        <Button
          width="100%"
          label={this.$t('add_output_product')}
          variant="primary"
          click={this.onAddProduct}
          disabled={hasErrors || !this.isValidProduct}
        />
      </Styled.Actions>
    );
  }

  renderProductAttributes(): JSX.Element {
    if (this.isSubmitting) {
      return <SpinLoading isInline={false} />;
    }
    return (
      <ProductAttributes
        isOutputProduct
        definitionAttributes={this.definitionAttributes}
        isSubmitting={this.isSubmitting}
        change={this.onChangeAttribute}
        changeQrCode={this.onChangeQrCode}
        overflow
      />
    );
  }

  renderDNSIdentifier(): JSX.Element {
    return (
      <Input
        value={this.productData.dnaIdentifier}
        name="dnaIdentifier"
        label={this.$t('dna_identifier_optional')}
        placeholder={this.$t('dna_identifier_optional')}
        height="48px"
        changeValue={this.onChangeDNA}
      />
    );
  }

  renderForm(): JSX.Element {
    return (
      <formulate-form
        name={this.formName}
        scopedSlots={{
          default: ({ hasErrors }: { hasErrors: boolean }) => (
            <Styled.Form>
              <InputGroup>
                {this.isShowProductIdDefault && (
                  <ProductId changeCode={this.onChangeCodeDefault} />
                )}
                {this.renderProductAttributes()}
                {auth.hasDNAInputField && this.renderDNSIdentifier()}
                {this.renderAction(hasErrors)}
              </InputGroup>
            </Styled.Form>
          ),
        }}
      />
    );
  }

  renderFilter(): JSX.Element {
    return (
      <Styled.FilterContainer>
        <Styled.FilterWrapper
          sortType={this.filters.createdAt}
          vOn:click={() => this.changeSortFilter('createdAt')}
        >
          {this.$t('added_date')} <font-icon name="arrow_dropdown" size="24" />
        </Styled.FilterWrapper>
        <Styled.FilterWrapper
          sortType={this.filters.code}
          vOn:click={() => this.changeSortFilter('code')}
        >
          {this.$t('product_id')} <font-icon name="arrow_dropdown" size="24" />
        </Styled.FilterWrapper>
        <Styled.FilterWrapper>
          {this.$t('file_and_attachment')}
        </Styled.FilterWrapper>
        <Styled.FilterAction />
      </Styled.FilterContainer>
    );
  }

  renderFooter() {
    return (
      <Styled.Actions>
        <Styled.ButtonGroupEnd>
          <Button
            label={this.$t('common.action.cancel')}
            variant="transparentPrimary"
            click={this.closeModal}
          />
          <Button
            type="button"
            variant="primary"
            label={this.$t('done')}
            disabled={this.isDisabled}
            click={this.handleSuccess}
          />
        </Styled.ButtonGroupEnd>
      </Styled.Actions>
    );
  }

  render(): JSX.Element {
    return (
      <modal-layout
        title={this.$t('add_output_product')}
        closeModal={this.closeModal}
      >
        <Styled.Wrapper>
          <perfect-scrollbar>
            {!this.isLoading && this.renderForm()}
            <Styled.Content>
              {this.renderFilter()}
              {this.outputProducts.map(
                (product: AssignProduct.OutputProductData, index: number) => (
                  <Product
                    key={index}
                    product={product}
                    removeProduct={this.removeProduct}
                  />
                ),
              )}
            </Styled.Content>
          </perfect-scrollbar>
          {this.renderFooter()}
          {this.isLoading && <SpinLoading isInline={false} />}
        </Styled.Wrapper>
      </modal-layout>
    );
  }
}
