import { Vue, Component, Prop } from 'vue-property-decorator';
import { get } from 'lodash';
import { PartnerTypeEnum } from 'enums/onboard';
import Button from 'components/FormUI/Button';
import LocationForm from 'components/FormUI/Location/LocationForm';
import BusinessInfo from '../Business/BusinessInfo';
import * as Styled from '../styled';

const PartnerModal = () => import('modals/PartnerModal');

@Component
export default class BrokerInfo extends Vue {
  @Prop({ required: true }) type: PartnerTypeEnum;
  @Prop({ default: null }) facility: Auth.Facility;
  @Prop({ default: null }) readonly messageErrors: App.MessageError;
  @Prop({ default: false }) readonly disabled: boolean;
  @Prop({ default: false }) readonly isSubmitting: boolean;
  @Prop({ default: null }) readonly facilityTypeDefault: string;
  @Prop() changeInput: () => void;
  @Prop({ default: [] }) readonly countries: Location.Country[];
  @Prop({ default: [] }) readonly provinces: Location.Province[];
  @Prop({ default: [] }) readonly districts: Location.District[];
  @Prop({ default: null }) readonly selectedCountry: App.DropdownOption;
  @Prop({ default: null }) readonly selectedProvince: App.DropdownOption;
  @Prop({ default: null }) readonly selectedDistrict: App.DropdownOption;
  @Prop({ default: [] }) readonly addedPartners: Onboard.Partner[];
  @Prop({ default: false }) readonly changeableAddedPartners: boolean;
  @Prop({ default: [] }) readonly facilityTypeOptions: App.DropdownOption;
  @Prop({ default: null }) readonly selectedFacilityType: App.DropdownOption;
  @Prop() changeFacilityType: (value: App.DropdownOption) => void;
  @Prop() init: () => void;
  @Prop() changeCountry: (value: App.DropdownOption) => void;
  @Prop() changeProvince: (value: App.DropdownOption) => void;
  @Prop() changeDistrict: (value: App.DropdownOption) => void;
  @Prop() changeAddedPartners: (partners: Onboard.Partner[]) => void;
  @Prop() removeAddedPartner: (index: number) => void;

  get partnerList(): Onboard.PartnerOption[] {
    return this.addedPartners.map((addedPartner) => ({
      id: addedPartner.facilityId,
      name: addedPartner.businessName,
      disabled: !addedPartner.addNew,
    }));
  }

  get formName(): string {
    return this.$formulate.registry.keys().next().value;
  }

  get formData(): Onboard.ProfileRequestParams {
    return this.$formulate.registry.get(this.formName).proxy;
  }

  get facilityMessageError(): App.MessageError {
    return get(this.messageErrors, 'facility.children');
  }

  get isTransporter(): boolean {
    return this.type === PartnerTypeEnum.TRANSPORTER;
  }

  convertCountryToOption(country: Location.Country): App.DropdownOption {
    return {
      id: country.id,
      name: country.country,
    };
  }

  convertProvinceToOption(province: Location.Province): App.DropdownOption {
    return {
      id: province.id,
      name: province.province,
    };
  }

  convertDistrictToOption(district: Location.District): App.DropdownOption {
    return {
      id: district.id,
      name: district.district,
    };
  }

  openModalAddPartner(): void {
    this.$modal.show(
      PartnerModal,
      {
        type: PartnerTypeEnum.TRANSFORMATION_PARTNER,
        onSuccess: this.addPartner,
      },
      {
        width: '776px',
        height: 'auto',
        classes: 'overflow-visible',
        clickToClose: false,
        adaptive: true,
      },
    );
  }

  addPartner(partner: Onboard.Partner): void {
    partner.id = partner.facilityId;
    partner.addNew = true;
    this.changeAddedPartners([...this.addedPartners, partner]);
  }

  renderAddBusinessInformation(): JSX.Element {
    if (this.type === PartnerTypeEnum.BROKER) {
      return (
        <Styled.Box>
          <Styled.Container>
            <Styled.Title>
              {this.$t('partnerModal.add_business_partner_information')}
            </Styled.Title>
            <Styled.PartnerInfoContainer>
              <Styled.Container>
                {this.partnerList.map((partner, index) => (
                  <Styled.ListItem disabled={partner.disabled}>
                    <Styled.Name>{partner.name}</Styled.Name>
                    {!partner.disabled && (
                      <font-icon
                        name="remove"
                        size="16"
                        color="ghost"
                        vOn:click_native={() => this.removeAddedPartner(index)}
                      />
                    )}
                  </Styled.ListItem>
                ))}
              </Styled.Container>
            </Styled.PartnerInfoContainer>
            <Styled.Action>
              <Button
                width="312px"
                type="button"
                icon="plus"
                variant="transparentWarning"
                label={this.$t('partnerModal.add_business_partner')}
                disabled={this.isSubmitting}
                click={this.openModalAddPartner}
              />
            </Styled.Action>
          </Styled.Container>
        </Styled.Box>
      );
    }
  }

  render(): JSX.Element {
    return (
      <Styled.Box>
        <Styled.Container>
          <Styled.Title>
            {this.$t('user_information', {
              field: this.$t(this.type.toLowerCase()),
            })}
          </Styled.Title>
          <Styled.InformationLayout isTransporter={this.isTransporter}>
            <BusinessInfo
              type={this.type}
              disabled={this.disabled}
              messageErrors={this.facilityMessageError}
              facilityTypeOptions={this.facilityTypeOptions}
              selectedFacilityType={this.selectedFacilityType}
              changeInput={this.changeInput}
              changeFacilityType={this.changeFacilityType}
            />
            <LocationForm
              disabled={this.disabled}
              messageErrors={this.facilityMessageError}
              countries={this.countries}
              provinces={this.provinces}
              districts={this.districts}
              selectedCountry={this.selectedCountry}
              selectedProvince={this.selectedProvince}
              selectedDistrict={this.selectedDistrict}
              optionalAddress
              changeCountry={this.changeCountry}
              changeProvince={this.changeProvince}
              changeDistrict={this.changeDistrict}
              changeInput={this.changeInput}
            />
          </Styled.InformationLayout>
        </Styled.Container>
        {this.renderAddBusinessInformation()}
      </Styled.Box>
    );
  }
}
