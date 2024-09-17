import { Mixins, Component, Prop } from 'vue-property-decorator';
import { isEmpty } from 'lodash';
import Input from 'components/FormUI/Input';
import MessageError from 'components/FormUI/MessageError';
import LocationMixin from 'components/FormUI/Location/LocationMixin';
import LocationForm from 'components/FormUI/Location/LocationForm';
import { OSIDAttributesEnum, RoleAttributeTypeEnum } from 'enums/role';
import * as Styled from './styled';

@Component
export default class OpenSupplyHubInfo extends Mixins(LocationMixin) {
  @Prop({ required: true }) readonly formName: string;
  @Prop({ required: true }) readonly data: Onboard.OarIdDetail;
  @Prop({ required: true }) readonly userInfo: Auth.User;
  @Prop({ default: null }) readonly messageErrors: App.MessageError;
  @Prop({
    default: () => {
      //
    },
  })
  changeInput: () => void;

  get formData(): Onboard.OsIDParams {
    return this.$formulate.registry.get(this.formName).proxy;
  }

  get disabledDistrict(): boolean {
    return !isEmpty(this.data.districtId);
  }

  get roleAttributes(): Auth.RoleAttribute[] {
    const { roleAttributes } = this.userInfo;
    return roleAttributes[RoleAttributeTypeEnum.OPEN_SUPPLY_HUB_ID];
  }

  created(): void {
    this.getCountries(this.initData);
  }

  hasAttribute(attributeName: OSIDAttributesEnum): boolean {
    return !isEmpty(
      this.roleAttributes.find(
        ({ attribute }) => attribute.name === attributeName,
      ),
    );
  }

  onChangeDistrict(option: App.DropdownOption): void {
    this.changeDistrict(option);
    this.$formulate.setValues(this.formName, {
      ...this.formData,
      districtId: option.id,
    });
    this.changeInput();
  }

  initData(): void {
    const { address, countryId, districtId, provinceId } = this.data;
    this.initBusinessName();
    this.$formulate.setValues(this.formName, {
      ...this.formData,
      address: address,
    });
    this.fetchDataLocation(countryId, provinceId, districtId);
  }

  initBusinessName() {
    const { name } = this.data;
    if (name && this.hasAttribute(OSIDAttributesEnum.BUSINESS_NAME)) {
      this.$formulate.setValues(this.formName, {
        ...this.formData,
        businessName: name,
      });
    }
  }

  renderLocation(): JSX.Element {
    return (
      <LocationForm
        disabledCountry
        disabledProvince
        disabledDistrict={this.disabledDistrict}
        disabledAddress
        countries={this.countries}
        provinces={this.provinces}
        districts={this.districts}
        selectedCountry={this.selectedCountry}
        selectedProvince={this.selectedProvince}
        selectedDistrict={this.selectedDistrict}
        changeDistrict={this.onChangeDistrict}
      />
    );
  }

  renderBusinessName(): JSX.Element {
    if (this.hasAttribute(OSIDAttributesEnum.BUSINESS_NAME)) {
      return (
        <Styled.Column>
          <Input
            height="48px"
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
  }

  render(): JSX.Element {
    return (
      <fragment>
        {this.renderBusinessName()}
        {this.renderLocation()}
      </fragment>
    );
  }
}
