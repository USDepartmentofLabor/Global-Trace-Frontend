import { Component, Prop, Vue } from 'vue-property-decorator';
import { get, isNull, isUndefined } from 'lodash';
import AppModule from 'store/modules/app';
import { getAttributeProperties } from 'utils/product-attributes';
import Input from 'components/FormUI/Input';
import Dropdown from 'components/FormUI/Dropdown';
import * as Styled from './styled';

@Component
export default class AttributeNumberUnit extends Vue {
  @Prop({ required: true }) isSubmitting: boolean;
  @Prop({ default: false }) readonly overflow: boolean;
  @Prop({ required: true })
  productAttribute: ProductAttribute.ProductDefinitionAttribute;
  @Prop() change: (params: ProductAttribute.AttributeParams) => void;

  private selectedOption: App.DropdownOption = null;
  private value: number = null;

  get attributeProperties(): ProductAttribute.Entity {
    return getAttributeProperties(this.productAttribute);
  }

  get validateRules(): string {
    if (!this.attributeProperties.isOptional) {
      return 'bail|required|min:0';
    }
    return null;
  }

  get currentLocale(): string {
    return AppModule.locale;
  }

  get dropdownOptions(): App.DropdownOption[] {
    const options = get(this.productAttribute, 'attribute.options', []);
    return options.map((option: App.Any) => ({
      id: option.value,
      name: get(option, `translation.${this.currentLocale}`) || option.value,
    }));
  }

  created() {
    if (!isUndefined(this.productAttribute.value)) {
      this.value = this.productAttribute.value;
    }
    if (!isUndefined(this.productAttribute.quantityUnit)) {
      const option = this.dropdownOptions.find(
        ({ id }) => id === this.productAttribute.quantityUnit,
      );
      if (option) {
        this.selectedOption = option;
      }
    }
  }

  changeInput(value: number) {
    this.value = value ? value : null;
    this.handleChange();
  }

  onChangeDropdown(option: App.DropdownOption): void {
    this.selectedOption = option;
    this.handleChange();
  }

  handleChange() {
    this.change({
      isOptional: this.attributeProperties.isOptional,
      category: this.attributeProperties.category,
      type: this.attributeProperties.type,
      id: this.attributeProperties.id,
      value: !isNull(this.value) ? Number(this.value) : this.value,
      quantityUnit: get(this.selectedOption, 'name', null),
    });
  }

  render(): JSX.Element {
    return (
      <Styled.NumberUnitPair>
        <Input
          name={this.attributeProperties.id}
          value={this.value}
          type="number"
          min="0"
          label={this.attributeProperties.label}
          height="48px"
          placeholder={this.attributeProperties.label}
          validation="bail|min:0"
          changeValue={this.changeInput}
          validationMessages={{
            min: this.$t('validation.min', {
              field: this.$t(this.attributeProperties.name),
              compare_field: 0,
            }),
          }}
        />
        <Dropdown
          title={this.$t('unit')}
          options={this.dropdownOptions}
          width="100%"
          height="48px"
          value={this.selectedOption}
          changeOptionValue={this.onChangeDropdown}
          placeholder={this.$t('unit')}
          allowEmpty={false}
          overflow={this.overflow}
        />
      </Styled.NumberUnitPair>
    );
  }
}
