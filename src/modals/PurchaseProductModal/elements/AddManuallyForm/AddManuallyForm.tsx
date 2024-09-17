import { Component, Prop, Mixins } from 'vue-property-decorator';
import { assign, findIndex, get, map, pick } from 'lodash';
import purchaseModule from 'store/modules/purchase';
import { getUploadFileObjectParams } from 'utils/helpers';
import { validProduct } from 'utils/product-attributes';
import { handleError } from 'components/Toast';
import { SpinLoading } from 'components/Loaders';
import { InputAttributeEnum } from 'enums/app';
import Button from 'components/FormUI/Button';
import LocationMixin from 'components/FormUI/Location/LocationMixin';
import ProductAttributes from 'components/InputAttribute';
import * as Styled from './styled';

@Component
export default class AddManuallyForm extends Mixins(LocationMixin) {
  @Prop({
    required: true,
  })
  cancel: () => void;
  @Prop({
    required: true,
  })
  successAdded: (manualData: Purchase.ManualAddedProduct) => void;

  private isLoading: boolean = false;
  private isSubmitting: boolean = false;
  private messageErrors: App.MessageError = null;
  private manualData: Purchase.ManualAddedProduct = {
    code: '',
    attributes: [],
  };

  get validateInputAttributeParams(): ProductAttribute.ValidateInputParams[] {
    return map(this.manualData.attributes, (attribute) =>
      pick(attribute, ['category', 'value', 'isOptional', 'quantityUnit']),
    );
  }

  get isDisabled(): boolean {
    return (
      this.isSubmitting || !validProduct(this.validateInputAttributeParams)
    );
  }

  created(): void {
    this.fetchDataLocation();
    this.getProductDefinitions();
  }

  getProductDefinitions(): void {
    this.isLoading = true;
    purchaseModule.getProductDefinitions({
      callback: {
        onSuccess: (response: Purchase.ProductDefinitions) => {
          const { id, productDefinitionAttributes } = response;
          this.manualData.code = id;
          productDefinitionAttributes.forEach(
            (productAttribute: Purchase.ProductDefinitionAttribute) => {
              const { attribute, isOptional } = productAttribute;
              this.manualData.attributes = [
                ...this.manualData.attributes,
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
        },
        onFailure: (error: App.ResponseError) => {
          handleError(error);
        },
        onFinish: () => {
          this.isLoading = false;
        },
      },
    });
  }

  async getValueAttribute(
    attribute: Purchase.ManualAddedAttribute,
  ): Promise<Purchase.ManualAddedAttribute> {
    if (attribute.category === InputAttributeEnum.ATTACHMENTS) {
      const files = get(attribute, 'value.selectedFiles', []);
      attribute.value = await getUploadFileObjectParams(files as File[]);
      return attribute;
    }

    return attribute;
  }

  async getValueUploadProofs(): Promise<Purchase.ManualAddedProduct> {
    for (let index = 0; index < this.manualData.attributes.length; index++) {
      const attribute = this.manualData.attributes[index];
      this.manualData.attributes[index] = await this.getValueAttribute(
        attribute,
      );
    }
    return this.manualData;
  }

  async onSubmit(): Promise<void> {
    try {
      this.isSubmitting = true;
      const payload = await this.getValueUploadProofs();
      this.successAdded(payload);
      this.$emit('close');
    } catch (error) {
      handleError(error as App.ResponseError);
    } finally {
      this.isSubmitting = false;
    }
  }

  onClearMessageErrors(): void {
    if (this.messageErrors) {
      this.messageErrors = null;
    }
  }

  onChangeAttribute(params: Purchase.ManualAddedAttribute) {
    this.onClearMessageErrors();
    const { id } = params;
    const currentIndex = findIndex(
      this.manualData.attributes,
      (attribute: Purchase.ManualAddedAttribute) => attribute.id === id,
    );
    if (currentIndex > -1) {
      assign(this.manualData.attributes[currentIndex], params);
    }
  }

  renderProductAttributes(): JSX.Element {
    if (this.isLoading) {
      return (
        <Styled.Col>
          <SpinLoading />
        </Styled.Col>
      );
    }
    return (
      <ProductAttributes
        definitionAttributes={purchaseModule.productDefinitionAttributes}
        messageErrors={this.messageErrors}
        isSubmitting={this.isSubmitting}
        change={this.onChangeAttribute}
      />
    );
  }

  renderAction(hasErrors: boolean): JSX.Element {
    return (
      <Styled.Actions>
        <Styled.ButtonGroupEnd>
          <Button
            label={this.$t('common.action.cancel')}
            variant="transparentPrimary"
            click={this.cancel}
          />
          <Button
            type="submit"
            variant="primary"
            label={this.$t('add')}
            isLoading={this.isSubmitting}
            disabled={this.isDisabled || hasErrors}
          />
        </Styled.ButtonGroupEnd>
      </Styled.Actions>
    );
  }

  renderForm(): JSX.Element {
    return (
      <formulate-form
        name="addManuallyForm"
        vOn:submit={this.onSubmit}
        scopedSlots={{
          default: ({ hasErrors }: { hasErrors: boolean }) => (
            <Styled.Form>
              <perfect-scrollbar>
                {this.renderProductAttributes()}
              </perfect-scrollbar>
              {this.renderAction(hasErrors)}
            </Styled.Form>
          ),
        }}
      />
    );
  }

  render(): JSX.Element {
    return <Styled.Wrapper>{this.renderForm()}</Styled.Wrapper>;
  }
}
