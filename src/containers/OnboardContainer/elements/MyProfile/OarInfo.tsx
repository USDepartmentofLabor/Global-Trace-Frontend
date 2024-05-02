import { Mixins, Component, Prop } from 'vue-property-decorator';
import Input from 'components/FormUI/Input';
import MessageError from 'components/FormUI/MessageError';
import LocationMixin from 'components/FormUI/Location/LocationMixin';
import LocationForm from 'components/FormUI/Location/LocationForm';
import * as Styled from './styled';

@Component
export default class OarInfo extends Mixins(LocationMixin) {
  @Prop({ required: true }) readonly data: Onboard.OarIdDetail;
  @Prop({ default: null }) readonly messageErrors: App.MessageError;

  get formName(): string {
    return this.$formulate.registry.keys().next().value;
  }

  get formData(): Onboard.ProfileRequestParams {
    return this.$formulate.registry.get(this.formName).proxy;
  }

  get businessName(): string {
    return this.formData.businessName;
  }

  set businessName(value: string) {
    this.$formulate.setValues(this.formName, {
      ...this.formData,
      businessName: value,
    });
  }

  get address(): string {
    return this.formData.address;
  }

  set address(value: string) {
    this.$formulate.setValues(this.formName, {
      ...this.formData,
      address: value,
    });
  }

  get countryId(): string {
    return this.formData.countryId;
  }

  set countryId(value: string) {
    this.$formulate.setValues(this.formName, {
      ...this.formData,
      countryId: value,
    });
  }

  get provinceId(): string {
    return this.formData.provinceId;
  }

  set provinceId(value: string) {
    this.$formulate.setValues(this.formName, {
      ...this.formData,
      provinceId: value,
    });
  }

  get districtId(): string {
    return this.formData.districtId;
  }

  set districtId(value: string) {
    this.$formulate.setValues(this.formName, {
      ...this.formData,
      districtId: value,
    });
  }

  created(): void {
    this.getCountries(this.initData);
  }

  initData(): void {
    const { name, address, countryId, districtId, provinceId } = this.data;
    this.businessName = name;
    this.address = address;
    this.countryId = countryId;
    this.provinceId = provinceId;
    this.districtId = districtId;
    this.fetchDataLocation(countryId, provinceId, districtId);
  }

  renderLocation(): JSX.Element {
    return (
      <LocationForm
        disabled
        countries={this.countries}
        provinces={this.provinces}
        districts={this.districts}
        selectedCountry={this.selectedCountry}
        selectedProvince={this.selectedProvince}
        selectedDistrict={this.selectedDistrict}
      />
    );
  }

  renderBusinessName(): JSX.Element {
    return (
      <Styled.Column>
        <Input
          height="48px"
          variant="material"
          label={this.$t('business_name')}
          name="businessName"
          placeholder={this.$t('business_name')}
          validation="bail|required"
          disabled
          autoTrim
          validationMessages={{
            required: this.$t('validation.required', {
              field: this.$t('business_name').toLowerCase(),
            }),
          }}
        />
        {this.messageErrors && (
          <MessageError field="name" messageErrors={this.messageErrors} />
        )}
      </Styled.Column>
    );
  }

  render(): JSX.Element {
    return (
      <Styled.Content>
        {this.renderBusinessName()}
        {this.renderLocation()}
      </Styled.Content>
    );
  }
}
