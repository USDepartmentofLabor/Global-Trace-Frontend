import { Component, Prop, Vue } from 'vue-property-decorator';
import { get } from 'lodash';
import AppModule from 'store/modules/app';
import { getAttributeProperties } from 'utils/product-attributes';
import Dropdown from 'components/FormUI/Dropdown';
import * as Styled from './styled';

@Component
export default class AttributeList extends Vue {
  @Prop({ required: true }) isSubmitting: boolean;
  @Prop({ required: true })
  productAttribute: ProductAttribute.ProductDefinitionAttribute;
  @Prop() change: (params: ProductAttribute.AttributeParams) => void;

  private selectedOption: App.DropdownOption = null;

  get attributeProperties(): ProductAttribute.Entity {
    return getAttributeProperties(this.productAttribute);
  }

  get currentLocale(): string {
    return AppModule.locale;
  }

  get dropdownOptions(): App.DropdownOption[] {
    const options = get(this.productAttribute, 'attribute.options', []);
    return options.map((option: App.DropdownOption) => ({
      id: option.value,
      name: get(option, `translation.${this.currentLocale}`) || option.value,
    }));
  }

  onChangeDropdown(option: App.DropdownOption): void {
    this.selectedOption = option;
    this.change({
      isOptional: this.attributeProperties.isOptional,
      category: this.attributeProperties.category,
      type: this.attributeProperties.type,
      id: this.attributeProperties.id,
      value: option.name,
    });
  }

  render(): JSX.Element {
    return (
      <Styled.Attribute>
        <Dropdown
          title={this.attributeProperties.label}
          height="48px"
          variant="material"
          options={this.dropdownOptions}
          width="100%"
          value={this.selectedOption}
          changeOptionValue={this.onChangeDropdown}
          placeholder={this.attributeProperties.label}
          disabled={this.isSubmitting}
          allowEmpty={false}
          overflow
        />
      </Styled.Attribute>
    );
  }
}
