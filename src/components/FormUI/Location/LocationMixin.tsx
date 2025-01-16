import { Vue, Component } from 'vue-property-decorator';
import { find, get, head, isEmpty } from 'lodash';
import {
  OTHER_COUNTRY_ID,
  OTHER_DISTRICT_ID,
  OTHER_PROVINCE_ID,
} from 'config/constants';
import location from 'store/modules/location';
import auth from 'store/modules/auth';
import { handleError } from 'components/Toast';

@Component
export default class LocationMixin extends Vue {
  public selectedCountry: App.DropdownOption = null;
  public selectedProvince: App.DropdownOption = null;
  public selectedDistrict: App.DropdownOption = null;
  public provinces: Location.Province[] = [];
  public districts: Location.District[] = [];
  public isLoadingLocation: boolean = false;

  get user(): Auth.User {
    return auth.user;
  }

  get countries(): Location.Country[] {
    return location.countries;
  }

  get hasEmptyLocation(): boolean {
    return (
      isEmpty(this.selectedCountry) ||
      isEmpty(this.selectedProvince) ||
      isEmpty(this.selectedDistrict)
    );
  }

  get isOtherCountry(): boolean {
    return this.selectedCountry && this.selectedCountry.id === OTHER_COUNTRY_ID;
  }

  fetchDataLocation(
    countryId?: string,
    provinceId?: string,
    districtId?: string,
  ): void {
    this.isLoadingLocation = true;
    this.getCountries(() => {
      if (countryId === OTHER_COUNTRY_ID) {
        this.changeNotAvailableLocation();
      } else {
        this.handleAvailableLocation(countryId, provinceId, districtId);
      }
    });
  }

  fetchDataLocationDefault(): void {
    this.isLoadingLocation = true;
    this.getCountries(() => {
      const countryDefault = head(this.countries);
      this.selectedCountry = this.convertCountryToOption(countryDefault);
      this.handleAvailableLocation(countryDefault.id);
    });
  }

  handleAvailableLocation(
    country?: string,
    province?: string,
    district?: string,
  ): void {
    this.changeCountry(
      this.convertCountryToOption(this.getCountryDefault(country)),
    );
    const countryId = get(this.getCountryDefault(country), 'id');

    this.getProvinces(countryId, () => {
      this.changeProvince(
        this.convertProvinceToOption(this.getProvinceDefault(province)),
      );
      const provinceIdDefault = get(this.getProvinceDefault(province), 'id');

      this.getDistricts(provinceIdDefault, () => {
        this.changeDistrict(
          this.convertDistrictToOption(this.getDistrictDefault(district)),
        );
        this.isLoadingLocation = false;
      });
    });
  }

  changeNotAvailableLocation(): void {
    const countryOption: App.DropdownOption = {
      id: OTHER_COUNTRY_ID,
      name: this.$t('other'),
    };
    this.changeCountry(countryOption);

    const provinceOption: App.DropdownOption = {
      id: OTHER_PROVINCE_ID,
      name: this.$t('na'),
    };
    this.changeProvince(provinceOption);

    const districtOption: App.DropdownOption = {
      id: OTHER_DISTRICT_ID,
      name: this.$t('na'),
    };
    this.changeDistrict(districtOption);
  }

  getLocationParams(): Location.RequestParams {
    return {
      countryId: get(this.selectedCountry, 'id', '').toString(),
      provinceId: get(this.selectedProvince, 'id', '').toString(),
      districtId: get(this.selectedDistrict, 'id', '').toString(),
    };
  }

  getCountryDefault(countryDefault?: string): Location.Country {
    if (countryDefault) {
      return find(this.countries, (country) => country.id === countryDefault);
    }
    return null;
  }

  getProvinceDefault(provinceDefault?: string): Location.Province {
    if (provinceDefault) {
      return find(
        this.provinces,
        (province) => province.id === provinceDefault,
      );
    }
    return null;
  }

  getDistrictDefault(districtDefault?: string): Location.District {
    if (districtDefault) {
      return find(
        this.districts,
        (district) => district.id === districtDefault,
      );
    }
    return null;
  }

  getCountries(onSuccess?: () => void): void {
    this.isLoadingLocation = true;
    location.getCountries({
      callback: {
        onSuccess: onSuccess,
        onFailure: (error: App.ResponseError) => {
          handleError(error);
        },
        onFinish: () => {
          this.isLoadingLocation = false;
        },
      },
    });
  }

  onChangeCountry(option: App.DropdownOption): void {
    this.changeCountry(option);

    if (option && !this.isOtherCountry) {
      this.getProvinces(option.id as string);
    }
    const otherProvinceOption: App.DropdownOption = {
      id: OTHER_PROVINCE_ID,
      name: this.$t('na'),
    };
    this.changeProvince(this.isOtherCountry ? otherProvinceOption : null);

    const otherDistrictOption: App.DropdownOption = {
      id: OTHER_DISTRICT_ID,
      name: this.$t('na'),
    };
    this.changeDistrict(this.isOtherCountry ? otherDistrictOption : null);
  }

  getProvinces(countryId: string, onSuccess?: () => void): void {
    if (countryId) {
      this.isLoadingLocation = true;
      location.getProvinces({
        countryId: countryId,
        callback: {
          onSuccess: (provinces: Location.Province[]) => {
            this.provinces = provinces;
            onSuccess && onSuccess();
          },
          onFailure: (error: App.ResponseError) => {
            handleError(error);
          },
          onFinish: () => {
            this.isLoadingLocation = false;
          },
        },
      });
    }
  }

  onChangeProvince(option: App.DropdownOption): void {
    if (option) {
      this.getDistricts(option.id as string);
    }
    this.changeProvince(option);
    this.changeDistrict(null);
  }

  getDistricts(provinceId: string, onSuccess?: () => void): void {
    if (provinceId) {
      this.isLoadingLocation = true;
      location.getDistricts({
        provinceId: provinceId,
        callback: {
          onSuccess: (districts: Location.District[]) => {
            this.districts = districts;
            onSuccess && onSuccess();
          },
          onFailure: (error: App.ResponseError) => {
            handleError(error);
          },
          onFinish: () => {
            this.isLoadingLocation = false;
          },
        },
      });
    }
  }

  convertCountryToOption(country: Location.Country): App.DropdownOption {
    return country
      ? {
          id: country.id,
          name: country.country,
        }
      : null;
  }

  convertProvinceToOption(province: Location.Province): App.DropdownOption {
    return province
      ? {
          id: province.id,
          name: province.province,
        }
      : null;
  }

  convertDistrictToOption(district: Location.District): App.DropdownOption {
    return district
      ? {
          id: district.id,
          name: district.district,
        }
      : null;
  }

  changeCountry(option: App.DropdownOption): void {
    this.selectedCountry = option;
  }

  changeProvince(option: App.DropdownOption): void {
    this.selectedProvince = option;
  }

  changeDistrict(option: App.DropdownOption): void {
    this.selectedDistrict = option;
  }
}
