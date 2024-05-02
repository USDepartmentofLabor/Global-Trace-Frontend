import { Component, Prop, Mixins } from 'vue-property-decorator';
import { ProductAttributeEnum } from 'enums/product';
import LocationMixin from 'components/FormUI/Location/LocationMixin';
import AttributeNumberUnit from './NumberUnit';
import AttributeList from './List';
import AttributeDate from './Date';
import AttributeAttachments from './Attachments';
import AttributeLocation from './Location';
import AttributeInput from './Input';
import * as Styled from './styled';

@Component
export default class ProductAttributes extends Mixins(LocationMixin) {
  @Prop({ default: false }) readonly isOutputProduct: boolean;
  @Prop({ default: null })
  readonly definitionAttributes: ProductAttribute.ProductDefinitionAttribute[];
  @Prop({ default: null }) readonly messageErrors: App.MessageError;
  @Prop({ default: false }) readonly isSubmitting: boolean;
  @Prop({
    default: () => {
      //
    },
  })
  change: (params: ProductAttribute.AttributeParams) => void;
  @Prop({
    default: () => {
      //
    },
  })
  changeQrCode: (code: string) => void;

  renderNumberUnitPair(
    productDefinition: ProductAttribute.ProductDefinitionAttribute,
  ): JSX.Element {
    return (
      <AttributeNumberUnit
        isSubmitting={this.isSubmitting}
        productAttribute={productDefinition}
        change={this.change}
      />
    );
  }

  renderList(
    productDefinition: ProductAttribute.ProductDefinitionAttribute,
  ): JSX.Element {
    return (
      <AttributeList
        isSubmitting={this.isSubmitting}
        productAttribute={productDefinition}
        change={this.change}
      />
    );
  }

  renderDate(
    productDefinition: ProductAttribute.ProductDefinitionAttribute,
  ): JSX.Element {
    return (
      <AttributeDate
        isSubmitting={this.isSubmitting}
        productAttribute={productDefinition}
        change={this.change}
      />
    );
  }

  renderAttachments(
    productDefinition: ProductAttribute.ProductDefinitionAttribute,
  ): JSX.Element {
    return (
      <AttributeAttachments
        isSubmitting={this.isSubmitting}
        productAttribute={productDefinition}
        change={this.change}
      />
    );
  }

  renderLocation(
    productDefinition: ProductAttribute.ProductDefinitionAttribute,
  ): JSX.Element {
    return (
      <AttributeLocation
        isSubmitting={this.isSubmitting}
        productAttribute={productDefinition}
        messageErrors={this.messageErrors}
        change={this.change}
      />
    );
  }

  renderInput(
    productDefinition: ProductAttribute.ProductDefinitionAttribute,
  ): JSX.Element {
    return (
      <AttributeInput
        isOutputProduct={this.isOutputProduct}
        isSubmitting={this.isSubmitting}
        productAttribute={productDefinition}
        change={this.change}
        changeCode={this.changeQrCode}
      />
    );
  }

  render(): JSX.Element {
    return (
      <Styled.Wrapper>
        {this.definitionAttributes.map(
          (productDefinition: ProductAttribute.ProductDefinitionAttribute) => {
            const category = productDefinition.attribute.category;
            switch (category) {
              case ProductAttributeEnum.NUMBER_UNIT_PAIR:
                return this.renderNumberUnitPair(productDefinition);
              case ProductAttributeEnum.LIST:
                return this.renderList(productDefinition);
              case ProductAttributeEnum.DATE:
                return this.renderDate(productDefinition);
              case ProductAttributeEnum.ATTACHMENTS:
                return this.renderAttachments(productDefinition);
              case ProductAttributeEnum.COUNTRY_PROVINCE_DISTRICT:
                return this.renderLocation(productDefinition);
              default:
                return this.renderInput(productDefinition);
            }
          },
        )}
      </Styled.Wrapper>
    );
  }
}
