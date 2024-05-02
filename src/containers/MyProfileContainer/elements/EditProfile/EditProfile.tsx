import { Component, Prop, Mixins } from 'vue-property-decorator';
import moment from 'moment';
import { get, isNull } from 'lodash';
import { updateProfile } from 'api/user-setting';
import { getUserFacility } from 'utils/user';
import { convertDateToTimestamp, currentTimestamp } from 'utils/date';
import Button from 'components/FormUI/Button';
import LocationMixin from 'components/FormUI/Location/LocationMixin';
import { SpinLoading } from 'components/Loaders';
import ContactProfile from './ContactProfile';
import BusinessInfo from './BusinessInfo';
import BusinessModel from './BusinessModel';
import * as Styled from './styled';

const SAQResultModal = () => import('modals/SAQResultModal');

@Component
export default class EditProfile extends Mixins(LocationMixin) {
  @Prop({ required: true }) userInfo: Auth.User;
  @Prop({
    type: Function,
    default: () => {
      //
    },
  })
  updated: () => void;
  @Prop({
    type: Function,
    default: () => {
      //
    },
  })
  cancel: () => void;

  private isSubmitting: boolean = false;
  private messageErrors: App.MessageError = null;
  private formInput: UserProfile.ProfileRequestParams = {
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: '',
    businessName: '',
    businessRegisterNumber: '',
    oarId: '',
    certification: '',
    chainOfCustody: '',
    reconciliationStartAt: null,
    reconciliationDuration: '',
    goods: [],
  };
  private selectedCertification: App.DropdownOption = null;
  private selectedChainOfCustody: App.DropdownOption = null;
  private selectedReconciliationDuration: App.DropdownOption = null;
  private selectedCommodities: App.DropdownOption[] = [];

  get userFacility(): Auth.Facility {
    return getUserFacility(this.userInfo);
  }

  get facilityMessageError(): App.MessageError {
    return get(this.messageErrors, 'facility.children');
  }

  get userMessageError(): App.MessageError {
    return get(this.messageErrors, 'user.children');
  }

  created(): void {
    this.initContactValue();
    this.initFacilityInfoValue();
    this.initFacilityAddressValue();
    this.initBusinessModelValue();
  }

  initContactValue(): void {
    if (!isNull(this.userInfo)) {
      const { firstName, lastName, phoneNumber, email } = this.userInfo;
      this.formInput.firstName = firstName;
      this.formInput.lastName = lastName;
      this.formInput.phoneNumber = phoneNumber;
      this.formInput.email = email;
    }
  }

  initFacilityInfoValue(): void {
    if (this.userFacility) {
      const { name, businessRegisterNumber, oarId } = this.userFacility;
      this.formInput.businessName = name;
      this.formInput.businessRegisterNumber = businessRegisterNumber;
      this.formInput.oarId = oarId;
    }
  }

  initFacilityAddressValue(): void {
    if (this.userFacility) {
      const { countryId, provinceId, districtId, address, goods } =
        this.userFacility;
      this.fetchDataLocation(countryId, provinceId, districtId);
      this.formInput.address = address;
      this.formInput.goods = goods;
      this.selectedCommodities = goods.map((commodity) => ({
        id: commodity,
        name: commodity,
      }));
    }
  }

  initBusinessModelValue(): void {
    if (this.userFacility) {
      const {
        certification,
        chainOfCustody,
        reconciliationStartAt,
        reconciliationDuration,
      } = this.userFacility;
      this.formInput.certification = certification;
      this.formInput.chainOfCustody = chainOfCustody;
      this.formInput.reconciliationStartAt = reconciliationStartAt;
      this.formInput.reconciliationDuration = reconciliationDuration;
    }
  }

  getUserParams(): Auth.User {
    const { firstName, lastName, email, phoneNumber } = this.formInput;
    return {
      firstName,
      lastName,
      email,
      phoneNumber: this.getInputOptionalParam(phoneNumber),
      updatedProfileAt: currentTimestamp(),
    };
  }

  getInputOptionalParam(value: string): string | null {
    return value ? value : null;
  }

  getBusinessModelParams(): Onboard.BusinessModelParams {
    const { reconciliationStartAt } = this.formInput;
    return {
      certification: get(this.selectedCertification, 'id').toString(),
      chainOfCustody: get(this.selectedChainOfCustody, 'id').toString(),
      reconciliationStartAt: convertDateToTimestamp(
        moment(reconciliationStartAt).toDate(),
      ),
      reconciliationDuration: get(
        this.selectedReconciliationDuration,
        'id',
      ) as string,
    };
  }

  getFacilityParams(): Auth.Facility {
    const { businessName, businessRegisterNumber } = this.formInput;
    return {
      name: businessName,
      businessRegisterNumber,
      ...this.getBusinessModelParams(),
    };
  }

  getFormParams(): Onboard.ProfileFormData {
    return {
      user: this.getUserParams(),
      facility: this.getFacilityParams(),
    };
  }

  changeCertification(option: App.DropdownOption): void {
    this.selectedCertification = option;
  }

  changeChainOfCustody(option: App.DropdownOption): void {
    this.selectedChainOfCustody = option;
  }

  changeReconciliationDuration(option: App.DropdownOption): void {
    this.selectedReconciliationDuration = option;
  }

  async onSubmit(): Promise<void> {
    try {
      this.isSubmitting = true;
      await updateProfile(this.getFormParams());
      this.$toast.success(this.$t('profile_updated'));
      this.updated();
    } catch (error) {
      this.messageErrors = get(error, 'errors');
    } finally {
      this.isSubmitting = false;
    }
  }

  onClearMessageErrors(): void {
    if (this.messageErrors) {
      this.messageErrors = null;
    }
  }

  showSAQResultModal(): void {
    this.$modal.show(
      SAQResultModal,
      {},
      { width: '100%', height: '100%', clickToClose: false },
    );
  }

  renderContact(): JSX.Element {
    return (
      <Styled.Content>
        <Styled.Title>{this.$t('contact')}</Styled.Title>
        <ContactProfile messageErrors={this.userMessageError} />
      </Styled.Content>
    );
  }

  renderBusinessInfo(): JSX.Element {
    return (
      <Styled.Content>
        <Styled.Title>{this.$t('information')}</Styled.Title>
        <BusinessInfo
          disabled={this.isSubmitting}
          messageErrors={this.facilityMessageError}
          countries={this.countries}
          provinces={this.provinces}
          districts={this.districts}
          selectedCommodities={this.selectedCommodities}
          selectedCountry={this.selectedCountry}
          selectedProvince={this.selectedProvince}
          selectedDistrict={this.selectedDistrict}
          changeCountry={this.onChangeCountry}
          changeProvince={this.onChangeProvince}
          changeDistrict={this.changeDistrict}
          changeInput={this.onClearMessageErrors}
        />
        {this.isLoadingLocation && <SpinLoading isInline={false} />}
      </Styled.Content>
    );
  }

  renderBusinessModel(): JSX.Element {
    return (
      <Styled.Content>
        <Styled.Title>
          {this.$t('myProfilePage.certification_and_custody_model')}
        </Styled.Title>
        <BusinessModel
          disabled={this.isSubmitting}
          messageErrors={this.facilityMessageError}
          userInfo={this.userInfo}
          changeCertification={this.changeCertification}
          changeChainOfCustody={this.changeChainOfCustody}
          changeReconciliationDuration={this.changeReconciliationDuration}
          changeInput={this.onClearMessageErrors}
        />
        {this.isLoadingLocation && <SpinLoading isInline={false} />}
      </Styled.Content>
    );
  }

  renderActions(hasErrors: boolean): JSX.Element {
    return (
      <Styled.Actions>
        <Button
          width="100%"
          variant="outlinePrimary"
          label={this.$t('common.action.cancel')}
          click={this.cancel}
        />
        <Button
          width="100%"
          type="submit"
          variant="primary"
          label={this.$t('save')}
          isLoading={this.isSubmitting}
          disabled={this.isSubmitting || hasErrors || this.hasEmptyLocation}
        />
      </Styled.Actions>
    );
  }

  render(): JSX.Element {
    return (
      <formulate-form
        name="MyProfile"
        v-model={this.formInput}
        vOn:submit={this.onSubmit}
        scopedSlots={{
          default: ({ hasErrors }: { hasErrors: boolean }) => {
            return (
              <Styled.Container>
                <Styled.SelfAssessment vOn:click={this.showSAQResultModal}>
                  {this.$t('onboardPage.self_assessment_questionnaire')}
                  <font-icon name="arrow_forward" color="highland" size="14" />
                </Styled.SelfAssessment>
                {this.renderContact()}
                {this.renderBusinessInfo()}
                {this.renderBusinessModel()}
                {this.renderActions(hasErrors)}
              </Styled.Container>
            );
          },
        }}
      />
    );
  }
}
