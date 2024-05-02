import { Component, Prop, Mixins } from 'vue-property-decorator';
import { getAttributeProperties } from 'utils/product-attributes';
import { SpinLoading } from 'components/Loaders';
import LocationMixin from 'components/FormUI/Location/LocationMixin';
import LocationForm from 'components/FormUI/Location/LocationForm';
import * as Styled from './styled';

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
    this.fetchDataLocation();
  }

  render(): JSX.Element {
    return (
      <Styled.Locations>
        <LocationForm
          showAddress={false}
          messageErrors={this.messageErrors}
          disabled={this.isSubmitting}
          countries={this.countries}
          provinces={this.provinces}
          districts={this.districts}
          selectedCountry={this.selectedCountry}
          selectedProvince={this.selectedProvince}
          selectedDistrict={this.selectedDistrict}
          changeCountry={this.onChangeCountry}
          changeProvince={this.onChangeProvince}
          changeDistrict={this.onChangeAttribute}
          changeValue={this.clearMessageErrors}
        />
        {this.isLoadingLocation && <SpinLoading isInline={false} />}
      </Styled.Locations>
    );
  }
}
