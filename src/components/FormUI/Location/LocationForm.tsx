import { Vue, Component, Prop } from 'vue-property-decorator';
import {
  OTHER_COUNTRY_ID,
  OTHER_DISTRICT_ID,
  OTHER_PROVINCE_ID,
} from 'config/constants';
import Dropdown from 'components/FormUI/Dropdown';
import Input from 'components/FormUI/Input';

@Component
export default class LocationForm extends Vue {
  @Prop({ default: null }) readonly selectedCountry: App.DropdownOption;
  @Prop({ default: null }) readonly selectedProvince: App.DropdownOption;
  @Prop({ default: null }) readonly selectedDistrict: App.DropdownOption;
  @Prop({ default: [] }) readonly countries: Location.Country[];
  @Prop({ default: [] }) readonly provinces: Location.Province[];
  @Prop({ default: [] }) readonly districts: Location.District[];
  @Prop({ default: false }) readonly disabledCountry: boolean;
  @Prop({ default: false }) readonly disabledProvince: boolean;
  @Prop({ default: false }) readonly disabledDistrict: boolean;
  @Prop({ default: false }) readonly disabledAddress: boolean;
  @Prop({ default: false }) readonly overflow: boolean;
  @Prop({ default: true }) readonly showProvince: boolean;
  @Prop({ default: true }) readonly showDistrict: boolean;
  @Prop({ default: true }) readonly showAddress: boolean;
  @Prop({ default: false }) readonly optionalCountry: boolean;
  @Prop({ default: false }) readonly optionalProvince: boolean;
  @Prop({ default: false }) readonly optionalDistrict: boolean;
  @Prop({ default: false }) readonly optionalAddress: boolean;
  @Prop({ default: '' }) readonly addressPlaceholder: string;
  @Prop() changeInput: () => void;
  @Prop() changeCountry: (value: App.DropdownOption) => void;
  @Prop() changeProvince: (value: App.DropdownOption) => void;
  @Prop() changeDistrict: (value: App.DropdownOption) => void;

  get isOtherCountry(): boolean {
    return this.selectedCountry && this.selectedCountry.id === OTHER_COUNTRY_ID;
  }

  get countryOptions(): App.DropdownOption[] {
    return this.countries.map((country: Location.Country) => ({
      id: country.id,
      name: country.country,
    }));
  }

  get provinceOptions(): App.DropdownOption[] {
    if (this.isOtherCountry) {
      return [
        {
          id: OTHER_PROVINCE_ID,
          name: this.$t('na'),
        },
      ];
    }
    return this.provinces.map((province: Location.Province) => ({
      id: province.id,
      name: province.province,
    }));
  }

  get districtOptions(): App.DropdownOption[] {
    if (this.isOtherCountry) {
      return [
        {
          id: OTHER_DISTRICT_ID,
          name: this.$t('na'),
        },
      ];
    }
    return this.districts.map((district: Location.District) => ({
      id: district.id,
      name: district.district,
    }));
  }

  get countryLabel(): string {
    if (this.optionalCountry) {
      return this.$t('item_optional', {
        item: this.$t('country'),
      });
    }
    return this.$t('country');
  }

  get provinceLabel(): string {
    if (this.optionalProvince) {
      return this.$t('item_optional', {
        item: this.$t('province'),
      });
    }
    return this.$t('province');
  }

  get districtLabel(): string {
    if (this.optionalDistrict) {
      return this.$t('item_optional', {
        item: this.$t('district'),
      });
    }
    return this.$t('district');
  }

  get addressLabel(): string {
    if (this.optionalAddress) {
      return this.$t('item_optional', {
        item: this.$t('street_address'),
      });
    }
    return this.$t('street_address');
  }

  get addressPlaceholderOption(): string {
    if (this.addressPlaceholder) {
      return this.addressPlaceholder;
    }
    return this.addressLabel;
  }

  setSelectedCountry(option: App.DropdownOption): void {
    this.changeCountry(option);
  }

  setSelectedProvince(option: App.DropdownOption): void {
    this.changeProvince(option);
  }

  setSelectedDistrict(option: App.DropdownOption): void {
    this.changeDistrict(option);
  }

  renderCountry(): JSX.Element {
    return (
      <fragment>
        <Dropdown
          title={this.countryLabel}
          height="48px"
          options={this.countryOptions}
          width="100%"
          trackBy="id"
          value={this.selectedCountry}
          changeOptionValue={this.changeCountry}
          placeholder={this.countryLabel}
          disabled={this.disabledCountry}
          allowEmpty={this.optionalCountry}
          overflow={this.overflow}
        />
      </fragment>
    );
  }

  renderProvince(): JSX.Element {
    return (
      <fragment>
        <Dropdown
          title={this.provinceLabel}
          height="48px"
          options={this.provinceOptions}
          width="100%"
          trackBy="id"
          value={this.selectedProvince}
          changeOptionValue={this.changeProvince}
          placeholder={this.provinceLabel}
          disabled={this.disabledProvince || this.isOtherCountry}
          allowEmpty={this.optionalProvince}
          overflow={this.overflow}
        />
      </fragment>
    );
  }

  renderDistrict(): JSX.Element {
    return (
      <fragment>
        <Dropdown
          title={this.districtLabel}
          height="48px"
          options={this.districtOptions}
          width="100%"
          trackBy="id"
          value={this.selectedDistrict}
          changeOptionValue={this.changeDistrict}
          placeholder={this.districtLabel}
          disabled={this.disabledDistrict || this.isOtherCountry}
          allowEmpty={this.optionalDistrict}
          overflow={this.overflow}
        />
      </fragment>
    );
  }

  renderAddress(): JSX.Element {
    return (
      <fragment>
        <Input
          width="100%"
          height="48px"
          maxlength={255}
          label={this.addressLabel}
          name="address"
          placeholder={this.addressPlaceholderOption}
          validation={this.optionalAddress ? '' : 'bail|required'}
          disabled={this.disabledAddress}
          changeValue={this.changeInput}
          validationMessages={{
            required: this.$t('validation.required', {
              field: this.$t('street_address').toLowerCase(),
            }),
          }}
        />
      </fragment>
    );
  }

  render(): JSX.Element {
    return (
      <fragment>
        {this.renderCountry()}
        {this.showProvince && this.renderProvince()}
        {this.showDistrict && this.renderDistrict()}
        {this.showAddress && this.renderAddress()}
      </fragment>
    );
  }
}
