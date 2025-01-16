import { Vue, Component, Prop } from 'vue-property-decorator';
import { isNull } from 'lodash';
import auth from 'store/modules/auth';
import { PartnerTypeEnum } from 'enums/onboard';
import { TransformPartnerTypeEnum } from 'enums/user';
import { getPartnerTypeShortName, getUserRole } from 'utils/user';
import LocationForm from 'components/FormUI/Location/LocationForm';
import BusinessInfo from '../Business/BusinessInfo';
import * as Styled from '../styled';

@Component
export default class TransformationPartnerInfo extends Vue {
  @Prop({ required: true }) type: PartnerTypeEnum;
  @Prop({ default: null }) facility: Auth.Facility;
  @Prop({ default: null }) readonly messageErrors: App.MessageError;
  @Prop({ default: false }) readonly disabled: boolean;
  @Prop({ default: [] }) readonly countries: Location.Country[];
  @Prop({ default: [] }) readonly provinces: Location.Province[];
  @Prop({ default: [] }) readonly districts: Location.District[];
  @Prop({ default: null }) readonly selectedCountry: App.DropdownOption;
  @Prop({ default: null }) readonly selectedProvince: App.DropdownOption;
  @Prop({ default: null }) readonly selectedDistrict: App.DropdownOption;
  @Prop({ default: [] }) readonly facilityTypeOptions: App.DropdownOption;
  @Prop({ default: null }) readonly selectedFacilityType: App.DropdownOption;
  @Prop() changeCountry: (value: App.DropdownOption) => void;
  @Prop() changeProvince: (value: App.DropdownOption) => void;
  @Prop() changeDistrict: (value: App.DropdownOption) => void;
  @Prop() changeFacilityType: (value: App.DropdownOption) => void;
  @Prop({
    type: Function,
    default: () => {
      //
    },
  })
  changeInput: () => void;

  get userInfo(): Auth.User {
    return auth.user;
  }

  get userRole(): RoleAndPermission.Role {
    return getUserRole(this.userInfo);
  }

  get formName(): string {
    return this.$formulate.registry.keys().next().value;
  }

  get formData(): Onboard.PartnerRequestParams {
    return this.$formulate.registry.get(this.formName).proxy;
  }

  get facilityType(): TransformPartnerTypeEnum {
    return this.formData.role;
  }

  set facilityType(value: TransformPartnerTypeEnum) {
    this.$formulate.setValues(this.formName, {
      ...this.formData,
      role: value,
    });
  }

  get showBusinessAddress(): boolean {
    return (
      this.type === PartnerTypeEnum.TRANSFORMATION_PARTNER ||
      !isNull(this.facility)
    );
  }

  get informationLayout(): string {
    if (this.type === PartnerTypeEnum.PROCESSING_FACILITY) {
      return this.facility ? 'facilityCustom' : 'facilityDefault';
    }
    return 'partnerDefault';
  }

  get showAddress(): boolean {
    return this.type === PartnerTypeEnum.PROCESSING_FACILITY;
  }

  renderTitle(): JSX.Element {
    return (
      <Styled.Title>
        {this.$t('user_information', {
          field: this.$t(getPartnerTypeShortName(this.type)),
        })}
      </Styled.Title>
    );
  }

  renderBusinessAddress(): JSX.Element {
    if (this.showBusinessAddress) {
      return (
        <LocationForm
          disabledCountry={this.disabled}
          disabledProvince={this.disabled}
          disabledDistrict={this.disabled}
          disabledAddress={this.disabled}
          messageErrors={this.messageErrors}
          countries={this.countries}
          provinces={this.provinces}
          districts={this.districts}
          selectedCountry={this.selectedCountry}
          selectedProvince={this.selectedProvince}
          selectedDistrict={this.selectedDistrict}
          showAddress={this.showAddress}
          changeCountry={this.changeCountry}
          changeProvince={this.changeProvince}
          changeDistrict={this.changeDistrict}
          changeInput={this.changeInput}
          overflow
        />
      );
    }
    return null;
  }

  render(): JSX.Element {
    return (
      <Styled.Box>
        <Styled.Container>
          {this.renderTitle()}
          <Styled.InformationLayout layout={this.informationLayout}>
            <BusinessInfo
              type={this.type}
              facility={this.facility}
              disabled={this.disabled}
              messageErrors={this.messageErrors}
              selectedFacilityType={this.selectedFacilityType}
              facilityTypeOptions={this.facilityTypeOptions}
              changeInput={this.changeInput}
              changeFacilityType={this.changeFacilityType}
            />
            {this.renderBusinessAddress()}
          </Styled.InformationLayout>
        </Styled.Container>
      </Styled.Box>
    );
  }
}
