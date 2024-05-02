/* eslint-disable max-lines */
import { Component, Prop, Mixins } from 'vue-property-decorator';
import { get, head, isEmpty, isNull, values } from 'lodash';
import {
  invitePartner,
  validateBusinessPartner,
  getBusinessPartners,
  getInviteRoles,
  invitePartnerTransporter,
  invitePartnerBrokers,
} from 'api/onboard';
import { PartnerTypeEnum } from 'enums/onboard';
import { getInputValue } from 'utils/helpers';
import auth from 'store/modules/auth';
import { getUserRole } from 'utils/user';
import Button from 'components/FormUI/Button';
import { SpinLoading } from 'components/Loaders';
import { handleError } from 'components/Toast';
import LocationMixin from 'components/FormUI/Location/LocationMixin';
import ModalContent from './elements/ModalContent';
import SearchBox from './elements/SearchBox/SearchBox';
import * as Styled from './styled';

@Component
export default class PartnerModal extends Mixins(LocationMixin) {
  @Prop({ required: true }) type: PartnerTypeEnum;
  @Prop({ default: null }) partner: Onboard.PartnerDetail;
  @Prop({
    type: Function,
    default: () => {
      //
    },
  })
  onSuccess: (partner: Onboard.Partner) => void;

  private formInput: Onboard.PartnerRequestParams = {
    role: '',
    businessName: '',
    oarId: '',
    businessRegisterNumber: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: '',
    countryId: '',
    provinceId: '',
    districtId: '',
  };
  private isSubmitting: boolean = false;
  private messageErrors: App.MessageError = null;
  private facility: Auth.Facility = null;
  private selectedFacilityType: App.DropdownOption = null;
  private addedPartners: Onboard.Partner[] = [];
  private formName: string;
  private typeOptions: App.DropdownOption[] = [];

  get user(): Auth.User {
    return auth.user;
  }

  get userRole(): Auth.User {
    return getUserRole(this.user);
  }

  get title(): string {
    if (this.type === PartnerTypeEnum.TRANSFORMATION_PARTNER) {
      return this.$t('add_item', {
        item: this.$t('business_partner'),
      });
    }
    switch (this.type) {
      case PartnerTypeEnum.BROKER:
        return this.$t('partnerModal.register_broker');
      case PartnerTypeEnum.PROCESSING_FACILITY:
        return this.$t('partnerModal.add_processing_facility');
      case PartnerTypeEnum.TRANSPORTER:
        return this.$t('partnerModal.register_transporter');
    }
  }

  get showBack(): boolean {
    return this.type === PartnerTypeEnum.TRANSFORMATION_PARTNER;
  }

  get isEdit(): boolean {
    return !isNull(this.facility);
  }

  get isDisabledInput(): boolean {
    return this.isSubmitting || this.isEdit;
  }

  get isEmptyFacility(): boolean {
    return isEmpty(this.facility);
  }

  get hasProcessingFacilityLocation(): boolean {
    return (
      this.type === PartnerTypeEnum.PROCESSING_FACILITY &&
      !isNull(this.facility)
    );
  }

  get hasLocation(): boolean {
    return (
      this.type === PartnerTypeEnum.BROKER ||
      this.type === PartnerTypeEnum.TRANSPORTER ||
      this.type === PartnerTypeEnum.TRANSFORMATION_PARTNER ||
      this.hasProcessingFacilityLocation
    );
  }

  get isInvalidLocation(): boolean {
    return (
      this.isEmptyFacility && this.hasEmptyLocation && this.hasEmptyLocation
    );
  }

  get isEmptyFacilityType(): boolean {
    return (
      (this.type === PartnerTypeEnum.PROCESSING_FACILITY ||
        this.type === PartnerTypeEnum.TRANSFORMATION_PARTNER) &&
      isEmpty(this.selectedFacilityType)
    );
  }

  created(): void {
    this.formName = `partnerModal${this.type}`;
    this.requestInviteRoles();
    if (this.hasLocation) {
      this.fetchDataLocation();
    }
  }

  async requestInviteRoles() {
    try {
      const response = await getInviteRoles({
        canInvite: true,
      });
      this.typeOptions = response.map((role) => ({
        id: role.id,
        name: role.name,
      }));
    } catch (error) {
      handleError(error as App.ResponseError);
    }
  }

  onClearMessageErrors(): void {
    if (this.messageErrors) {
      this.messageErrors = null;
    }
  }

  changeFacilityType(option: App.DropdownOption): void {
    this.selectedFacilityType = option;
  }

  changeAddedPartners(partners: Onboard.Partner[]): void {
    this.addedPartners = partners;
  }

  removeAddedPartner(index: number): void {
    this.addedPartners.splice(index, 1);
  }

  changeSearch(): void {
    this.setFacility();
    this.changeCountry(null);
    this.changeProvince(null);
    this.changeDistrict(null);
    this.$formulate.resetValidation(this.formName);
  }

  setFacility(facility: Auth.Facility = null): void {
    this.facility = facility;
    this.setFormInput(facility);
    this.setAddedPartners(facility);
  }

  async setAddedPartners(facility: Auth.Facility = null): Promise<void> {
    if (facility && this.type === PartnerTypeEnum.BROKER) {
      const partnerFacilities = await getBusinessPartners(facility.id);
      this.addedPartners = partnerFacilities.map((partner) => {
        return {
          businessName: partner.name,
          facilityId: partner.id,
        };
      });
    } else {
      this.addedPartners = [];
    }
  }

  setUserInfoFormInput(facility?: Auth.Facility): void {
    const users = get(facility, 'users');
    const user = head(users);
    this.formInput.firstName = get(user, 'firstName');
    this.formInput.lastName = get(user, 'lastName');
    this.formInput.phoneNumber = get(user, 'phoneNumber');
    this.formInput.email = get(user, 'email');
  }

  setBusinessInfoFormInput(facility?: Auth.Facility): void {
    this.formInput.role = get(this.selectedFacilityType, 'id');
    this.formInput.businessName = get(facility, 'name');
    this.formInput.businessRegisterNumber = get(
      facility,
      'businessRegisterNumber',
      '',
    );
    this.formInput.oarId = get(facility, 'oarId');
    facility && this.setFacilityType(facility);
  }

  setFacilityType(facility: Auth.Facility): void {
    const facilityTypeId = get(facility, 'type.id', '');
    const facilityTypeName = get(facility, 'type.name', '');
    const defaultOption = {
      value: facilityTypeId,
      name: facilityTypeName,
    };
    this.changeFacilityType(
      this.typeOptions.find(({ id }) => id === facilityTypeId) || defaultOption,
    );
  }

  setBusinessLocationFormInput(facility?: Auth.Facility): void {
    const countryDefault = get(facility, 'countryId');
    const provinceDefault = get(facility, 'provinceId');
    const districtDefault = get(facility, 'districtId');
    facility &&
      this.hasLocation &&
      this.fetchDataLocation(countryDefault, provinceDefault, districtDefault);
    this.formInput.address = get(facility, 'address');
  }

  setFormInput(facility?: Auth.Facility): void {
    this.setUserInfoFormInput(facility);
    this.setBusinessInfoFormInput(facility);
    this.setBusinessLocationFormInput(facility);
  }

  getBusinessInfoParams(): Onboard.BusinessRequestParams {
    const { businessName, businessRegisterNumber } = this.formInput;
    return {
      name: businessName,
      businessRegisterNumber: getInputValue(businessRegisterNumber),
    };
  }

  getBusinessLocationParams(): Onboard.Location {
    const { address } = this.formInput;
    return {
      ...this.getLocationParams(),
      address: getInputValue(address),
    };
  }

  getBrokerInformationRequestParams(): Auth.Facility {
    return {
      ...this.getBusinessInfoParams(),
      ...this.getBusinessLocationParams(),
      partners: this.getBrokerPartnersRequestParams(),
    };
  }

  getTransporterInformationRequestParams(): Auth.Facility {
    return {
      ...this.getBusinessInfoParams(),
      ...this.getBusinessLocationParams(),
    };
  }

  getUserInfoRequestParams(): Onboard.UserInfoRequestParams {
    const { firstName, lastName, email, phoneNumber } = this.formInput;
    return {
      firstName: firstName,
      lastName: lastName,
      email: email,
      phoneNumber: getInputValue(phoneNumber),
    };
  }

  getTransporterRequestParams(): Onboard.InvitePartner {
    const params: Onboard.InvitePartner = {};
    params.facilityId = this.facility ? this.facility.id : null;
    params.userInformation = this.getUserInfoRequestParams();
    params.transporterInformation =
      this.getTransporterInformationRequestParams();

    return params;
  }

  getFacilityRequestParams(): Onboard.InvitePartner {
    const params: Onboard.InvitePartner = {};
    params.facilityId = this.facility ? this.facility.id : null;
    params.userInformation = this.getUserInfoRequestParams();
    params.facilityInformation = {
      roleId: get(this.selectedFacilityType, 'id', '') as string,
      name: this.formInput.businessName,
      countryId: get(this.selectedCountry, 'id', '') as string,
      provinceId: get(this.selectedProvince, 'id', '') as string,
      districtId: get(this.selectedDistrict, 'id', '') as string,
    };

    return params;
  }

  getFacilityInformationRequestParams(): Auth.Facility {
    const { oarId } = this.formInput;
    return {
      ...this.getBusinessInfoParams(),
      oarId: oarId,
      ...this.getLocationParams(),
    };
  }

  getFacilityParams(): { facilityId: string } {
    return { facilityId: get(this.facility, 'id', null) };
  }

  getBrokerRequestParams(): Onboard.Partner {
    const params: Onboard.InvitePartner = {};
    params.facilityId = this.facility ? this.facility.id : null;
    params.userInformation = this.getUserInfoRequestParams();
    params.brokerInformation = this.getBrokerInformationRequestParams();
    params.partners = this.getBrokerPartnersRequestParams();

    return params;
  }

  getBusinessPartnerParams(): Onboard.BusinessPartnerParams {
    return {
      ...this.getFacilityParams(),
      ...this.getUserInfoRequestParams(),
      ...this.getLocationParams(),
      name: this.formInput.businessName,
    };
  }

  getPartnerInfoRequestParams(
    partner: Onboard.Partner,
  ): Onboard.UserInfoRequestParams {
    const { firstName, lastName, email, phoneNumber } = partner;
    return {
      firstName: firstName,
      lastName: lastName,
      email: email,
      phoneNumber: getInputValue(phoneNumber),
    };
  }

  getBrokerPartnersRequestParams(): Onboard.Partner[] {
    const newPartners = this.addedPartners.filter(({ addNew }) => addNew);
    return newPartners.map((partner) => {
      const { facilityId, role, userInformation, facilityInformation } =
        partner;
      const result = {
        facilityId: facilityId,
        role: !facilityId ? role : undefined,
        userInformation,
        partnerInformation: facilityInformation,
        ...this.getPartnerInfoRequestParams(partner),
      };
      result[`${role.toLowerCase()}Information`] =
        partner[`${role.toLowerCase()}Information`];
      return result;
    });
  }

  getFormParams(): Onboard.Partner {
    if (this.facility && this.type !== PartnerTypeEnum.BROKER) {
      return this.getFacilityParams();
    }
    switch (this.type) {
      case PartnerTypeEnum.BROKER:
        return this.getBrokerRequestParams();
      case PartnerTypeEnum.PROCESSING_FACILITY:
      case PartnerTypeEnum.TRANSFORMATION_PARTNER:
        return this.getFacilityRequestParams();
      case PartnerTypeEnum.TRANSPORTER:
        return this.getTransporterRequestParams();
      default:
        break;
    }
  }

  submitTransformationPartner(params: Onboard.Partner): void {
    params.facilityId = this.facility ? this.facility.id : null;
    params.role = (
      get(this.selectedFacilityType, 'id', '') as string
    ).toUpperCase();
    params.businessName = this.formInput.businessName;
    this.onSuccess(params);
  }

  async onSubmit(): Promise<void> {
    try {
      this.isSubmitting = true;
      const params = this.getFormParams();
      const partnerParams = this.getBusinessPartnerParams();

      if (this.type === PartnerTypeEnum.TRANSFORMATION_PARTNER) {
        if (!partnerParams.facilityId) {
          await validateBusinessPartner(partnerParams);
        }
        this.submitTransformationPartner(params);
      } else {
        switch (this.type) {
          case PartnerTypeEnum.BROKER:
            await invitePartnerBrokers(params);
            break;
          case PartnerTypeEnum.TRANSPORTER:
            await invitePartnerTransporter(params);
            break;
          default:
            await invitePartner(params);
            break;
        }
        this.onSuccess(params);
        this.$toast.success(
          this.$t(`add_success`, {
            field: this.$t(this.type),
          }),
        );
      }

      this.closeModal();
    } catch (error) {
      let errors: App.MessageError = null;
      if (this.type === PartnerTypeEnum.TRANSFORMATION_PARTNER) {
        errors = get(error, 'errors');
      } else {
        errors = get(error, 'errors.userInformation.children');
      }
      if (values(errors).length > 0) {
        this.messageErrors = errors;
      } else {
        handleError(error as App.ResponseError);
      }
    } finally {
      this.isSubmitting = false;
    }
  }

  closeModal(): void {
    this.$emit('close');
  }

  isDisabledSubmit(hasErrors: boolean): boolean {
    return (
      this.isSubmitting ||
      (this.isEmptyFacility && hasErrors) ||
      (this.hasLocation && this.isInvalidLocation) ||
      this.isEmptyFacilityType ||
      !isEmpty(this.messageErrors) ||
      (this.type === PartnerTypeEnum.BROKER && this.addedPartners.length === 0)
    );
  }

  renderActions(hasErrors: boolean): JSX.Element {
    return (
      <Styled.Action>
        <Button
          width="312px"
          type="button"
          variant="primary"
          label={this.$t('add')}
          isLoading={this.isSubmitting}
          disabled={this.isDisabledSubmit(hasErrors)}
          click={this.onSubmit}
        />
      </Styled.Action>
    );
  }

  renderForm(): JSX.Element {
    return (
      <formulate-form
        v-model={this.formInput}
        name={this.formName}
        scopedSlots={{
          default: ({ hasErrors }: { hasErrors: boolean }) => (
            <fragment>
              <ModalContent
                facility={this.facility}
                type={this.type}
                hasLocation={this.hasLocation}
                disabled={this.isDisabledInput}
                isSubmitting={this.isSubmitting}
                messageErrors={this.messageErrors}
                changeInput={this.onClearMessageErrors}
                changeCountry={this.onChangeCountry}
                countries={this.countries}
                provinces={this.provinces}
                districts={this.districts}
                selectedCountry={this.selectedCountry}
                selectedProvince={this.selectedProvince}
                selectedDistrict={this.selectedDistrict}
                facilityTypeOptions={this.typeOptions}
                selectedFacilityType={this.selectedFacilityType}
                addedPartners={this.addedPartners}
                changeProvince={this.onChangeProvince}
                changeDistrict={this.changeDistrict}
                changeFacilityType={this.changeFacilityType}
                changeAddedPartners={this.changeAddedPartners}
                removeAddedPartner={this.removeAddedPartner}
              />
              {this.renderActions(hasErrors)}
            </fragment>
          ),
        }}
      />
    );
  }

  render(): JSX.Element {
    return (
      <modal-layout
        title={this.title}
        showBack={this.showBack}
        showCloseIcon={!this.showBack}
        back={this.closeModal}
        closeModal={this.closeModal}
      >
        <Styled.ModalContent>
          <SearchBox
            type={this.type}
            facility={this.facility}
            setFacility={this.setFacility}
            changeSearch={this.changeSearch}
          />
          {this.renderForm()}
          {this.isLoadingLocation && <SpinLoading isInline={false} />}
        </Styled.ModalContent>
      </modal-layout>
    );
  }
}
