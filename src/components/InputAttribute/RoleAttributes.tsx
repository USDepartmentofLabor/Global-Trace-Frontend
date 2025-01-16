import { Component, Prop, Mixins } from 'vue-property-decorator';
import { InputAttributeEnum } from 'enums/app';
import LocationMixin from 'components/FormUI/Location/LocationMixin';
import AttributeNumberUnit from './NumberUnit';
import AttributeList from './List';
import AttributeDate from './Date';
import AttributeAttachments from './Attachments';
import AttributeLocation from './Location';
import AttributeInput from './Input';
import * as Styled from './styled';

@Component
export default class RoleAttributes extends Mixins(LocationMixin) {
  @Prop({ default: null })
  readonly definitionAttributes: Auth.RoleAttribute[];
  @Prop({ default: null }) readonly messageErrors: App.MessageError;
  @Prop({ default: false }) readonly isSubmitting: boolean;
  @Prop({ default: false }) readonly overflow: boolean;
  @Prop({ default: 1 }) readonly column: number;
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

  renderNumberUnitPair(productDefinition: Auth.RoleAttribute): JSX.Element {
    return (
      <AttributeNumberUnit
        isSubmitting={this.isSubmitting}
        productAttribute={productDefinition}
        overflow={this.overflow}
        change={this.change}
      />
    );
  }

  renderList(productDefinition: Auth.RoleAttribute): JSX.Element {
    return (
      <AttributeList
        isSubmitting={this.isSubmitting}
        productAttribute={productDefinition}
        overflow={this.overflow}
        change={this.change}
      />
    );
  }

  renderDate(productDefinition: Auth.RoleAttribute): JSX.Element {
    return (
      <AttributeDate
        isSubmitting={this.isSubmitting}
        productAttribute={productDefinition}
        change={this.change}
      />
    );
  }

  renderAttachments(productDefinition: Auth.RoleAttribute): JSX.Element {
    return (
      <AttributeAttachments
        isSubmitting={this.isSubmitting}
        productAttribute={productDefinition}
        change={this.change}
      />
    );
  }

  renderLocation(productDefinition: Auth.RoleAttribute): JSX.Element {
    return (
      <AttributeLocation
        isSubmitting={this.isSubmitting}
        productAttribute={productDefinition}
        messageErrors={this.messageErrors}
        change={this.change}
      />
    );
  }

  renderInput(productDefinition: Auth.RoleAttribute): JSX.Element {
    return (
      <AttributeInput
        isOutputProduct={false}
        isSubmitting={this.isSubmitting}
        productAttribute={productDefinition}
        messageErrors={this.messageErrors}
        change={this.change}
        changeCode={this.changeQrCode}
      />
    );
  }

  render(): JSX.Element {
    return (
      <Styled.Wrapper column={this.column}>
        {this.definitionAttributes.map(
          (productDefinition: Auth.RoleAttribute) => {
            const category = productDefinition.attribute.category;
            switch (category) {
              case InputAttributeEnum.NUMBER_UNIT_PAIR:
                return this.renderNumberUnitPair(productDefinition);
              case InputAttributeEnum.LIST:
                return this.renderList(productDefinition);
              case InputAttributeEnum.DATE:
                return this.renderDate(productDefinition);
              case InputAttributeEnum.ATTACHMENTS:
                return this.renderAttachments(productDefinition);
              case InputAttributeEnum.COUNTRY_PROVINCE_DISTRICT:
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
