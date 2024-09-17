import { Component, Prop, Mixins } from 'vue-property-decorator';
import { isUndefined } from 'lodash';
import { getAttributeProperties } from 'utils/product-attributes';
import { SpinLoading } from 'components/Loaders';
import LocationMixin from 'components/FormUI/Location/LocationMixin';
import LocationForm from 'components/FormUI/Location/LocationForm';

@Component
export default class AttributeLocation extends Mixins(LocationMixin) {
  @Prop({ required: true }) isSubmitting: boolean;
  @Prop({ required: true })
  productAttribute: ProductAttribute.ProductDefinitionAttribute;
  @Prop({ required: true }) readonly messageErrors: App.MessageError;
  @Prop() clearMessageErrors: () => void;
  @Prop() change: (params: ProductAttribute.AttributeParams) => void;

  get attributeProperties(): ProductAttribute.Entity {
    return getAttributeProperties(this.productAttribute);
  }

  onChangeAttribute(option: App.DropdownOption): void {
    this.changeDistrict(option);
    this.change({
      isOptional: this.attributeProperties.isOptional,
      category: this.attributeProperties.category,
      type: this.attributeProperties.type,
      id: this.attributeProperties.id,
      value: {
        countryId: this.selectedCountry.id,
        provinceId: this.selectedProvince.id,
        districtId: option.id,
      },
    });
  }

  created(): void {
    if (!isUndefined(this.productAttribute.value)) {
      const { countryId, provinceId, districtId } = this.productAttribute.value;
      this.fetchDataLocation(countryId, provinceId, districtId);
    } else {
      this.fetchDataLocation();
    }
  }

  render(): JSX.Element {
    return (
      <fragment>
        <LocationForm
          showAddress={false}
          messageErrors={this.messageErrors}
          disabledCountry={this.isSubmitting}
          disabledProvince={this.isSubmitting}
          disabledDistrict={this.isSubmitting}
          disabledAddress={this.isSubmitting}
          countries={this.countries}
          provinces={this.provinces}
          districts={this.districts}
          optionalCountry={this.attributeProperties.isOptional}
          optionalProvince={this.attributeProperties.isOptional}
          optionalDistrict={this.attributeProperties.isOptional}
          optionalAddress={this.attributeProperties.isOptional}
          selectedCountry={this.selectedCountry}
          selectedProvince={this.selectedProvince}
          selectedDistrict={this.selectedDistrict}
          changeCountry={this.onChangeCountry}
          changeProvince={this.onChangeProvince}
          changeDistrict={this.onChangeAttribute}
          changeValue={this.clearMessageErrors}
        />
        {this.isLoadingLocation && <SpinLoading isInline={false} />}
      </fragment>
    );
  }
}
