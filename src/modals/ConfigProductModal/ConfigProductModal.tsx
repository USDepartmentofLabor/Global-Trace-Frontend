/* eslint-disable max-lines */
import { Vue, Component, Prop } from 'vue-property-decorator';
import { get, isEmpty } from 'lodash';
import { createProduct, updateProduct } from 'api/product-management';
import AppModule from 'store/modules/app';
import { handleError } from 'components/Toast';
import Button from 'components/FormUI/Button';
import Input from 'components/FormUI/Input/Input';
import { ProductModalTypeEnum } from 'enums/product';
import MessageError from 'components/FormUI/MessageError';
import AttributeList from './elements/AttributeList';
import Filter from './elements/Filter/Filter';
import Attribute from './elements/Attribute';
import AttributeSetting from './elements/AttributeSetting';
import * as Styled from './styled';

@Component
export default class ConfigProductModal extends Vue {
  @Prop({ default: null }) readonly product: ProductManagement.Product;
  @Prop({
    default: () => {
      //
    },
  })
  onSuccess: () => void;

  private name: string = '';
  private productAttributes: ProductManagement.AttributeParams[] = [];
  private modalType: ProductModalTypeEnum = ProductModalTypeEnum.PRODUCT;
  private isLoading: boolean = false;
  private messageErrors: App.MessageError = null;
  private currentAttribute: ProductManagement.ProductAttribute = null;

  get currentLocale(): string {
    return AppModule.locale;
  }

  get modalTitle(): string {
    switch (this.modalType) {
      case ProductModalTypeEnum.ATTRIBUTES:
        return this.$t('product_attributes');
      case ProductModalTypeEnum.ATTRIBUTE_SETTING:
        if (this.currentAttribute) {
          return (
            this.currentAttribute.nameTranslation[this.currentLocale] ||
            this.currentAttribute.name
          );
        }
        return this.$t('create_new_attribute');
      default:
        if (this.isEdit) {
          return this.$t('edit_product');
        }
        return this.$t('define_new_product');
    }
  }

  get isEdit(): boolean {
    return !isEmpty(this.product);
  }

  get isDisabled(): boolean {
    return isEmpty(this.productAttributes) || isEmpty(this.name);
  }

  created(): void {
    if (this.isEdit) {
      this.name = this.product.name;
      this.productAttributes = this.product.productDefinitionAttributes.map(
        ({ attribute, isOptional, isAddManuallyOnly }) => ({
          attribute,
          isOptional,
          isAddManuallyOnly,
          id: attribute.id,
        }),
      );
    }
  }

  closeModal(): void {
    this.$emit('close');
  }

  onSelectAttributes(attributes: ProductManagement.AttributeParams[]): void {
    this.productAttributes = attributes;
    this.modalType = ProductModalTypeEnum.PRODUCT;
  }

  setCurrentAttribute(
    attribute: ProductManagement.ProductAttribute = null,
  ): void {
    this.currentAttribute = attribute;
  }

  editAttribute(attribute: ProductManagement.ProductAttribute = null): void {
    this.setCurrentAttribute(attribute);
    this.gotoAttributeSetting();
  }

  onSavedAttribute(data: ProductManagement.ProductAttributeParams): void {
    if (this.currentAttribute) {
      const attributeIndex = this.productAttributes.findIndex(
        ({ id }) => id === this.currentAttribute.id,
      );
      if (attributeIndex > -1) {
        const { name, type, category } = data;
        this.productAttributes[attributeIndex].attribute.name = name;
        this.productAttributes[attributeIndex].attribute.category = category;
        this.productAttributes[attributeIndex].attribute.type = type;
      } else {
        const { name, type, category } = data;
        this.currentAttribute.name = name;
        this.currentAttribute.category = category;
        this.currentAttribute.type = type;

        this.productAttributes.push({
          id: this.currentAttribute.id,
          attribute: this.currentAttribute,
          isOptional: false,
          isAddManuallyOnly: false,
        });
      }
    } else {
      const { id, attribute } = data;
      this.productAttributes.push({
        id,
        attribute,
        isOptional: false,
        isAddManuallyOnly: false,
      });
    }
    this.setCurrentAttribute();
    this.gotoProduct();
  }

  onDeletedAttribute(): void {
    if (this.currentAttribute) {
      const attributeIndex = this.productAttributes.findIndex(
        ({ id }) => id === this.currentAttribute.id,
      );
      if (attributeIndex > -1) {
        this.productAttributes.splice(attributeIndex, 1);
      }
    }
    this.gotoAttributeList();
    this.onSuccess();
  }

  async handleSuccess(): Promise<void> {
    try {
      this.isLoading = true;
      if (this.isEdit) {
        await updateProduct(this.product.id, {
          name: this.name,
          attributes: this.productAttributes,
        });
      } else {
        await createProduct({
          name: this.name,
          attributes: this.productAttributes,
        });
      }
      this.$toast.success(this.$t('successfully_saved'));
      if (this.onSuccess) {
        this.onSuccess();
      }
      this.closeModal();
    } catch (error) {
      handleError(error as App.ResponseError);
      this.messageErrors = get(error, 'errors');
    } finally {
      this.isLoading = false;
    }
  }

  removeAttribute(index: number): void {
    this.productAttributes.splice(index, 1);
  }

  gotoAttributeSetting(): void {
    this.modalType = ProductModalTypeEnum.ATTRIBUTE_SETTING;
  }

  gotoAttributeList(): void {
    this.modalType = ProductModalTypeEnum.ATTRIBUTES;
  }

  gotoProduct(): void {
    this.modalType = ProductModalTypeEnum.PRODUCT;
  }

  onClickAddAttribute(): void {
    if (!isEmpty(this.name)) this.gotoAttributeList();
  }

  onBack(): void {
    if (this.modalType === ProductModalTypeEnum.ATTRIBUTE_SETTING) {
      if (this.currentAttribute) {
        this.gotoAttributeList();
      } else {
        this.gotoProduct();
      }
      this.setCurrentAttribute();
    } else {
      this.modalType = ProductModalTypeEnum.PRODUCT;
    }
  }

  changeName(value: string): void {
    this.name = value;
  }

  onClearMessageErrors(): void {
    if (this.messageErrors) {
      this.messageErrors = null;
    }
  }

  renderInputName(): JSX.Element {
    return (
      <Styled.Input>
        <Input
          label={this.$t('product_name')}
          name="name"
          height="48px"
          value={this.name}
          placeholder={this.$t('input_product_name')}
          iconColor="highland"
          changeValue={(value: string) => {
            this.changeName(value);
            this.onClearMessageErrors();
          }}
          messageErrors={this.messageErrors}
        />
        {this.messageErrors && (
          <MessageError field="name" messageErrors={this.messageErrors} />
        )}
      </Styled.Input>
    );
  }

  renderHeader() {
    return (
      <Styled.Header>
        <Styled.Row>
          {this.renderInputName()}
          <Button
            type="button"
            disabled={isEmpty(this.name)}
            variant="primary"
            label={this.$t('create_new_attribute')}
            click={this.gotoAttributeSetting}
          />
        </Styled.Row>
        <Styled.AddManually
          disabled={isEmpty(this.name)}
          onClick={this.onClickAddAttribute}
        >
          {this.$t('add_available_product_attributes')}
          <font-icon name="chevron_right" size="16" />
        </Styled.AddManually>
      </Styled.Header>
    );
  }

  renderFilter(): JSX.Element {
    return <Filter />;
  }

  renderContent(): JSX.Element {
    return (
      <Styled.Content isEmpty={this.productAttributes.length === 0}>
        <perfect-scrollbar>
          <draggable
            list={this.productAttributes}
            handle=".drag-item"
            ghost-class="ghost-item"
          >
            {this.productAttributes.map((productAttribute, index) => (
              <Styled.Box key={productAttribute.id}>
                <Attribute
                  productAttribute={productAttribute}
                  changeIsOptional={() => {
                    productAttribute.isOptional = !productAttribute.isOptional;
                  }}
                  changeIsAllManually={() => {
                    productAttribute.isAddManuallyOnly =
                      !productAttribute.isAddManuallyOnly;
                  }}
                  removeAttribute={() => {
                    this.removeAttribute(index);
                  }}
                />
              </Styled.Box>
            ))}
          </draggable>
        </perfect-scrollbar>
      </Styled.Content>
    );
  }

  renderFooter() {
    return (
      <Styled.Footer>
        <Button
          width="312px"
          type="button"
          variant="primary"
          label={this.$t('done')}
          disabled={this.isLoading || this.isDisabled}
          isLoading={this.isLoading}
          click={this.handleSuccess}
        />
      </Styled.Footer>
    );
  }

  render(): JSX.Element {
    return (
      <modal-layout
        title={this.modalTitle}
        closeModal={this.closeModal}
        showBack={this.modalType !== ProductModalTypeEnum.PRODUCT}
        back={this.onBack}
      >
        {this.modalType === ProductModalTypeEnum.ATTRIBUTES && (
          <AttributeList
            selectedAttributesDefault={this.productAttributes}
            selectAttributes={this.onSelectAttributes}
            editAttribute={this.editAttribute}
          />
        )}
        {this.modalType === ProductModalTypeEnum.ATTRIBUTE_SETTING && (
          <AttributeSetting
            currentAttribute={this.currentAttribute}
            saved={this.onSavedAttribute}
            deleted={this.onDeletedAttribute}
          />
        )}
        {this.modalType === ProductModalTypeEnum.PRODUCT && (
          <fragment>
            {this.renderHeader()}
            {this.renderFilter()}
            {this.renderContent()}
            {this.renderFooter()}
          </fragment>
        )}
      </modal-layout>
    );
  }
}
