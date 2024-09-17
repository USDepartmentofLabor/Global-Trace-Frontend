import { Component, Prop, Mixins } from 'vue-property-decorator';
import { get, isEmpty } from 'lodash';
import Input from 'components/FormUI/Input';
import { CIDAttributesEnum } from 'enums/role';
import LocationMixin from 'components/FormUI/Location/LocationMixin';
import LocationForm from 'components/FormUI/Location/LocationForm';
import MessageError from 'components/FormUI/MessageError';
import * as Styled from './styled';

@Component
export default class CIDInfo extends Mixins(LocationMixin) {
  @Prop({ required: true }) readonly formName: string;
  @Prop({ required: true }) readonly data: Onboard.RoleAttributeParams[];
  @Prop({ default: [] }) readonly roleAttributes: Auth.RoleAttribute[];
  @Prop({ default: null }) readonly messageErrors: App.MessageError;
  @Prop({
    default: () => {
      //
    },
  })
  changeInput: () => void;

  private disableAddress: boolean = false;
  get formData(): Onboard.CIDParams {
    return this.$formulate.registry.get(this.formName).proxy;
  }

  get hasAddress(): boolean {
    return this.hasAttribute(CIDAttributesEnum.ADDRESS);
  }

  created(): void {
    this.initData();
  }

  initData(): void {
    this.initFacilityName();
    this.initMetal();
    this.initCountry();
    this.initAddress();
  }

  hasAttribute(attributeName: CIDAttributesEnum): boolean {
    return !isEmpty(
      this.roleAttributes.find(
        ({ attribute }) => attribute.name === attributeName,
      ),
    );
  }

  initFacilityName() {
    const facilityNameAttribute = this.getAttribute(
      CIDAttributesEnum.FACILITY_NAME,
    );
    const facilityName = this.data.find(
      ({ attributeId }) => attributeId === facilityNameAttribute.attributeId,
    );
    this.$formulate.setValues(this.formName, {
      ...this.formData,
      facilityName: get(facilityName, 'value', ''),
    });
  }

  initMetal() {
    const metalAttribute = this.getAttribute(CIDAttributesEnum.METAL);
    const metal = this.data.find(
      ({ attributeId }) => attributeId === metalAttribute.attributeId,
    );
    this.$formulate.setValues(this.formName, {
      ...this.formData,
      metal: get(metal, 'value', ''),
    });
  }

  initCountry() {
    const countryAttribute = this.getAttribute(CIDAttributesEnum.COUNTRY);
    const country = this.data.find(
      ({ attributeId }) => attributeId === countryAttribute.attributeId,
    );
    const countryId = get(country, 'value', '');
    if (countryId) {
      this.$formulate.setValues(this.formName, {
        ...this.formData,
        countryLocation: countryId,
      });
      this.fetchDataLocation(countryId);
    }
  }

  initAddress() {
    if (this.hasAddress) {
      const addressAttribute = this.getAttribute(CIDAttributesEnum.ADDRESS);
      const address = this.data.find(
        ({ attributeId }) => attributeId === addressAttribute.attributeId,
      );
      const addressValue = get(address, 'value', '');
      this.$formulate.setValues(this.formName, {
        ...this.formData,
        stateProvinceRegion: addressValue,
      });
      this.disableAddress = !isEmpty(addressValue);
    }
  }

  getAttribute(attributeName: CIDAttributesEnum): Auth.RoleAttribute {
    return this.roleAttributes.find(
      ({ attribute }) => attribute.name === attributeName,
    );
  }

  changeAddress(value: string) {
    this.$formulate.setValues(this.formName, {
      ...this.formData,
      stateProvinceRegion: value,
    });
    this.changeInput();
  }

  renderFacilityName(): JSX.Element {
    return (
      <Styled.Column>
        <Input
          height="48px"
          label={this.$t('facility_name')}
          name="facilityName"
          placeholder={this.$t('facility_name')}
          validation="bail|required"
          disabled
          autoTrim
          validationMessages={{
            required: this.$t('validation.required', {
              field: this.$t('facility_name').toLowerCase(),
            }),
          }}
        />
        {this.messageErrors && (
          <MessageError
            field="facilityName"
            messageErrors={this.messageErrors}
          />
        )}
      </Styled.Column>
    );
  }

  renderMetal(): JSX.Element {
    return (
      <Styled.Column>
        <Input
          height="48px"
          label={this.$t('metal')}
          name="metal"
          placeholder={this.$t('metal')}
          validation="bail|required"
          disabled
          autoTrim
          validationMessages={{
            required: this.$t('validation.required', {
              field: this.$t('metal').toLowerCase(),
            }),
          }}
        />
        {this.messageErrors && (
          <MessageError field="metal" messageErrors={this.messageErrors} />
        )}
      </Styled.Column>
    );
  }

  renderCountry(): JSX.Element {
    return (
      <LocationForm
        disabledCountry
        showProvince={false}
        showDistrict={false}
        showAddress={false}
        countries={this.countries}
        provinces={this.provinces}
        districts={this.districts}
        selectedCountry={this.selectedCountry}
        selectedProvince={this.selectedProvince}
        selectedDistrict={this.selectedDistrict}
      />
    );
  }

  renderStateProvinceRegion(): JSX.Element {
    return (
      <Styled.Column>
        <Input
          height="48px"
          label={this.$t('state_province_region')}
          name="stateProvinceRegion"
          placeholder={this.$t('state_province_region')}
          disabled={this.disableAddress}
          autoTrim
          changeValue={this.changeAddress}
        />
        {this.messageErrors && (
          <MessageError
            field="stateProvinceRegion"
            messageErrors={this.messageErrors}
          />
        )}
      </Styled.Column>
    );
  }

  render(): JSX.Element {
    return (
      <fragment>
        {this.renderFacilityName()}
        {this.renderMetal()}
        {this.renderCountry()}
        {this.hasAddress && this.renderStateProvinceRegion()}
      </fragment>
    );
  }
}
