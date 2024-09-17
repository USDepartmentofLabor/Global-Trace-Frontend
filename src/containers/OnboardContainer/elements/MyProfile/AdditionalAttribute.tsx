import { Vue, Component, Prop } from 'vue-property-decorator';
import { assign, findIndex } from 'lodash';
import { RoleAttributeTypeEnum } from 'enums/role';
import RoleAttributes from 'components/InputAttribute/RoleAttributes';
import * as Styled from './styled';

@Component
export default class AdditionalAttribute extends Vue {
  @Prop({ default: true }) column: number;
  @Prop({ required: true }) readonly roleAttributes: Auth.RoleAttributes;
  @Prop({ default: null }) readonly messageErrors: App.MessageError;
  @Prop({ default: false }) readonly disabled: boolean;
  @Prop({
    default: () => {
      //
    },
  })
  changeInput: () => void;
  @Prop() update: (params: Onboard.RoleAttributeParams[]) => void;

  private formData: Onboard.AdditionalParams = {
    attributes: [],
  };

  get attributes(): Auth.RoleAttribute[] {
    return this.roleAttributes[RoleAttributeTypeEnum.ADDITIONAL_ATTRIBUTE];
  }

  created() {
    this.formData.attributes = this.attributes;
  }

  onChangeAttribute(params: ProductAttribute.AttributeParams) {
    this.changeInput();
    const { id } = params;
    const currentIndex = findIndex(
      this.formData.attributes,
      ({ attribute }) => attribute.id === id,
    );
    if (currentIndex > -1) {
      assign(this.formData.attributes[currentIndex], params);
    }
    this.update(this.getPayload());
  }

  getPayload(): Onboard.RoleAttributeParams[] {
    return this.formData.attributes.map(
      ({ attribute, attributeId, value, quantityUnit, isOptional }) => ({
        attribute,
        attributeId,
        value,
        isOptional,
        category: attribute.category,
        roleAttributeType: RoleAttributeTypeEnum.ADDITIONAL_ATTRIBUTE,
        quantityUnit,
      }),
    );
  }

  render(): JSX.Element {
    return (
      <Styled.Group>
        <Styled.SubTitle>{this.$t('additional_attributes')}</Styled.SubTitle>
        <RoleAttributes
          column={this.column}
          definitionAttributes={this.attributes}
          messageErrors={this.messageErrors}
          change={this.onChangeAttribute}
        />
      </Styled.Group>
    );
  }
}
