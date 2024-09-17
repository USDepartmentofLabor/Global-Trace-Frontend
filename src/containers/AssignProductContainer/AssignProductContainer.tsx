import { Vue, Component } from 'vue-property-decorator';
import { isEmpty, pick, some, isNull, get, cloneDeep, map } from 'lodash';
import { assignProducts } from 'api/assign-product';
import { getProductDefinitions } from 'api/purchase';
import { getErrorQrCode, getUploadFileObjectParams } from 'utils/helpers';
import { handleError } from 'components/Toast';
import { getProductsWeightTotal } from 'utils/product-attributes';
import { InputAttributeEnum } from 'enums/app';
import { ProductAttributeTypeEnum } from 'enums/product';
import { SpinLoading } from 'components/Loaders';
import Button from 'components/FormUI/Button';
import OutputProduct from './elements/OutputProduct';
import InputProduct from './elements/InputProduct';
import * as Styled from './styled';

@Component
export default class AssignProductContainer extends Vue {
  private inputProductList: AssignProduct.Product[] = [];
  private outputProductList: AssignProduct.OutputProductData[] = [];
  private isSubmitting: boolean = false;
  private isLoading: boolean = false;
  private purchaseProductDefinition: Purchase.ProductDefinitionAttribute[] = [];

  get disabled(): boolean {
    return (
      this.isSubmitting ||
      (this.canAddInputProduct && isEmpty(this.inputProductList)) ||
      isEmpty(this.outputProductList)
    );
  }

  get totalInputWeight(): number {
    return getProductsWeightTotal(this.inputProductList);
  }

  get canAddInputProduct(): boolean {
    return some(
      this.purchaseProductDefinition,
      (productAttribute: ProductAttribute.ProductDefinitionAttribute) =>
        productAttribute.attribute.type === ProductAttributeTypeEnum.PRODUCT_ID,
    );
  }

  get productDefinitionId(): string {
    const outputProduct = this.outputProductList.find(
      (product: AssignProduct.OutputProductData) => !isNull(product.code),
    );
    return get(outputProduct, 'code', '');
  }

  created(): void {
    this.getProductDefinitions();
  }

  async getProductDefinitions(): Promise<void> {
    try {
      this.isLoading = true;
      const response = await getProductDefinitions();
      const { productDefinitionAttributes } = response;
      this.purchaseProductDefinition = productDefinitionAttributes;
    } catch (error) {
      handleError(error as App.ResponseError);
    } finally {
      this.isLoading = false;
    }
  }

  onChangeOutPutProducts(products: AssignProduct.OutputProductData[]): void {
    this.outputProductList = products;
  }

  onChangeInputProducts(products: AssignProduct.Product[]): void {
    this.inputProductList = products;
  }

  async handleUploadFiles(files: File[]) {
    try {
      return await getUploadFileObjectParams(files);
    } catch (error) {
      handleError(error as App.ResponseError);
    }
  }

  async getPayload(): Promise<AssignProduct.AssignProductRequestParams> {
    const outputProductAttributes = this.outputProductList.map((item) =>
      pick(item, ['attributes', 'qrCode', 'dnaIdentifier']),
    );
    const payloads: ProductManagement.AddedProduct[] = await Promise.all(
      outputProductAttributes.map(async (outputProductAttribute) => {
        const product: ProductManagement.AddedProduct = cloneDeep(
          outputProductAttribute,
        );
        product.attributes = await this.uploadAttachments(product.attributes);
        return product;
      }),
    );

    return {
      inputProductIds: this.inputProductList.map((product) => product.id),
      outputProduct: {
        productDefinitionId: this.productDefinitionId,
        outputProducts: payloads as AssignProduct.OutputProducts[],
      },
    };
  }

  async uploadAttachments(
    attributes: ProductAttribute.AttributeParams[],
  ): Promise<ProductAttribute.AttributeParams[]> {
    return await Promise.all(
      map(attributes, async (attribute, index) => {
        if (attribute.category === InputAttributeEnum.ATTACHMENTS) {
          const attachments = attributes[index];
          const uploadProofs = await this.handleUploadFiles(
            attachments.value as File[],
          );
          attributes[index].value = uploadProofs;
        }
        return attribute;
      }),
    );
  }

  async assignProduct(): Promise<void> {
    try {
      this.isSubmitting = true;
      await assignProducts(await this.getPayload());
      this.$router.push({ name: 'Homepage' });
      this.$toast.success(this.$t('data_saved'));
    } catch (error) {
      const qrCodeMessage = getErrorQrCode(get(error, 'errors.outputProduct'));
      if (qrCodeMessage) {
        this.$toast.error(qrCodeMessage);
      } else {
        handleError(error as App.ResponseError);
      }
    } finally {
      this.isSubmitting = false;
    }
  }

  onSave(): void {
    this.assignProduct();
  }

  render(): JSX.Element {
    return (
      <Styled.Container>
        {this.isLoading && <SpinLoading />}
        {!this.isLoading && (
          <Styled.Wrapper>
            <Styled.Title>{this.$t('transformation')}</Styled.Title>
            {this.canAddInputProduct && (
              <InputProduct
                productsDefault={this.inputProductList}
                onSuccess={this.onChangeInputProducts}
              />
            )}
            <OutputProduct
              defaultProducts={this.outputProductList}
              totalInputWeight={this.totalInputWeight}
              changeProducts={this.onChangeOutPutProducts}
            />
            <Styled.Action>
              <Button
                width="100%"
                type="button"
                variant="primary"
                label={this.$t('common.action.save_changes')}
                disabled={this.disabled}
                isLoading={this.isSubmitting}
                click={this.onSave}
              />
            </Styled.Action>
          </Styled.Wrapper>
        )}
      </Styled.Container>
    );
  }
}
