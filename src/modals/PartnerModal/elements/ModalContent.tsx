import { Vue, Component, Prop } from 'vue-property-decorator';
import { get } from 'lodash';
import { PartnerTypeEnum } from 'enums/onboard';
import Contact from './Contact/Contact';
import TransformationPartnerInfo from './Information/TransformationPartnerInfo';
import BrokerInfo from './Information/BrokerInfo';
import * as Styled from './styled';

@Component
export default class ModalContent extends Vue {
  @Prop({ required: true }) type: PartnerTypeEnum;
  @Prop({ required: true }) hasLocation: boolean;
  @Prop({ default: null }) facility: Auth.Facility;
  @Prop({ default: null }) readonly messageErrors: App.MessageError;
  @Prop({ default: false }) readonly disabled: boolean;
  @Prop({ default: false }) readonly isSubmitting: boolean;
  @Prop({ default: [] }) readonly countries: Location.Country[];
  @Prop({ default: [] }) readonly provinces: Location.Province[];
  @Prop({ default: [] }) readonly districts: Location.District[];
  @Prop({ default: null }) readonly selectedCountry: App.DropdownOption;
  @Prop({ default: null }) readonly selectedProvince: App.DropdownOption;
  @Prop({ default: null }) readonly selectedDistrict: App.DropdownOption;
  @Prop({ default: [] }) readonly facilityTypeOptions: App.DropdownOption;
  @Prop({ default: null }) readonly selectedFacilityType: App.DropdownOption;
  @Prop({ default: [] }) readonly addedPartners: Onboard.Partner[];
  @Prop() changeInput: () => void;
  @Prop() changeCountry: (value: App.DropdownOption) => void;
  @Prop() changeProvince: (value: App.DropdownOption) => void;
  @Prop() changeDistrict: (value: App.DropdownOption) => void;
  @Prop() changeFacilityType: (value: App.DropdownOption) => void;
  @Prop() changeAddedPartners: (partners: Onboard.Partner[]) => void;
  @Prop() removeAddedPartner: (index: number) => void;

  get facilityMessageError(): App.MessageError {
    return get(this.messageErrors, 'facility.children');
  }

  renderContact(): JSX.Element {
    return (
      <Contact
        type={this.type}
        facility={this.facility}
        disabled={this.disabled}
        messageErrors={this.messageErrors}
        changeInput={this.changeInput}
      />
    );
  }

  renderBrokerInfo(): JSX.Element {
    return (
      <Styled.BusinessContainer>
        <BrokerInfo
          facility={this.facility}
          type={this.type}
          disabled={this.disabled}
          isSubmitting={this.isSubmitting}
          messageErrors={this.facilityMessageError}
          countries={this.countries}
          provinces={this.provinces}
          districts={this.districts}
          selectedCountry={this.selectedCountry}
          selectedProvince={this.selectedProvince}
          selectedDistrict={this.selectedDistrict}
          addedPartners={this.addedPartners}
          facilityTypeOptions={this.facilityTypeOptions}
          selectedFacilityType={this.selectedFacilityType}
          changeCountry={this.changeCountry}
          changeProvince={this.changeProvince}
          changeDistrict={this.changeDistrict}
          changeAddedPartners={this.changeAddedPartners}
          removeAddedPartner={this.removeAddedPartner}
          changeFacilityType={this.changeFacilityType}
        />
      </Styled.BusinessContainer>
    );
  }

  renderTransformationInfo(): JSX.Element {
    return (
      <Styled.BusinessContainer>
        <TransformationPartnerInfo
          facility={this.facility}
          type={this.type}
          disabled={this.disabled}
          messageErrors={this.facilityMessageError}
          countries={this.countries}
          provinces={this.provinces}
          districts={this.districts}
          selectedCountry={this.selectedCountry}
          selectedProvince={this.selectedProvince}
          selectedDistrict={this.selectedDistrict}
          facilityTypeOptions={this.facilityTypeOptions}
          selectedFacilityType={this.selectedFacilityType}
          changeCountry={this.changeCountry}
          changeProvince={this.changeProvince}
          changeDistrict={this.changeDistrict}
          changeInput={this.changeInput}
          changeFacilityType={this.changeFacilityType}
        />
      </Styled.BusinessContainer>
    );
  }

  renderInformation(): JSX.Element {
    switch (this.type) {
      case PartnerTypeEnum.BROKER:
      case PartnerTypeEnum.TRANSPORTER:
        return this.renderBrokerInfo();
      case PartnerTypeEnum.PROCESSING_FACILITY:
      case PartnerTypeEnum.TRANSFORMATION_PARTNER:
        return this.renderTransformationInfo();
    }
  }

  render(): JSX.Element {
    return (
      <Styled.PartnerInfo>
        <perfect-scrollbar>
          {this.renderContact()}
          {this.renderInformation()}
        </perfect-scrollbar>
      </Styled.PartnerInfo>
    );
  }
}
