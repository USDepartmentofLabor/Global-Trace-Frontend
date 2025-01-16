import { Component, Prop, Mixins } from 'vue-property-decorator';
import { get } from 'lodash';
import { updateProfile } from 'api/user-setting';
import { getUserFacility } from 'utils/user';
import auth from 'store/modules/auth';
import { currentTimestamp } from 'utils/date';
import { getInputValue } from 'utils/helpers';
import Button from 'components/FormUI/Button';
import LocationMixin from 'components/FormUI/Location/LocationMixin';
import { SpinLoading } from 'components/Loaders';
import ContactProfile from './ContactProfile';
import BusinessInfo from './BusinessInfo';
import * as Styled from './styled';

@Component
export default class EditProfile extends Mixins(LocationMixin) {
  @Prop({ required: true }) userInfo: Auth.User;
  @Prop({
    type: Function,
    default: () => {
      //
    },
  })
  exit: (reload: boolean) => void;

  private isSubmitting: boolean = false;
  private messageErrors: App.MessageError = null;
  private formInput: AuditorProfile.ProfileRequestParams = {
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: '',
    businessName: '',
    businessRegisterNumber: '',
    countryId: '',
    provinceId: '',
    districtId: '',
    address: '',
  };

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
  }

  initContactValue(): void {
    const { firstName, lastName, email, phoneNumber } = this.userInfo;
    this.formInput.firstName = firstName;
    this.formInput.lastName = lastName;
    this.formInput.email = email;
    this.formInput.phoneNumber = phoneNumber;
  }

  initFacilityInfoValue(): void {
    if (this.userFacility) {
      const { name, businessRegisterNumber } = this.userFacility;
      this.formInput.businessName = name;
      this.formInput.businessRegisterNumber = businessRegisterNumber;
    }
  }

  initFacilityAddressValue(): void {
    if (this.userFacility) {
      const { countryId, provinceId, districtId, address } = this.userFacility;
      this.fetchDataLocation(countryId, provinceId, districtId);
      this.formInput.address = address;
    }
  }

  getUserParams(): Auth.User {
    const { firstName, lastName, email, phoneNumber } = this.formInput;
    return {
      firstName,
      lastName,
      email,
      phoneNumber,
      updatedProfileAt: currentTimestamp(),
    };
  }

  getFacilityAddressParams(): Onboard.BusinessAddressParams {
    const { address } = this.formInput;
    return {
      ...this.getLocationParams(),
      address: getInputValue(address),
    };
  }

  getFacilityParams(): Auth.Facility {
    if (auth.isFirstUser) {
      const { businessName, businessRegisterNumber } = this.formInput;
      return {
        name: businessName,
        businessRegisterNumber,
        ...this.getFacilityAddressParams(),
      };
    }
  }

  getFormParams(): Onboard.ProfileFormData {
    return {
      user: this.getUserParams(),
      facility: this.getFacilityParams(),
    };
  }

  async onSubmit(): Promise<void> {
    try {
      this.isSubmitting = true;
      await updateProfile(this.getFormParams());
      this.$toast.success(this.$t('profile_updated'));
      this.exit(true);
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

  renderContact(): JSX.Element {
    return (
      <Styled.Content>
        <Styled.Title>{this.$t('contact')}</Styled.Title>
        <ContactProfile messageErrors={this.userMessageError} />
      </Styled.Content>
    );
  }

  renderOrganization(): JSX.Element {
    return (
      <Styled.Content>
        <Styled.Title>{this.$t('organization_details')}</Styled.Title>
        <BusinessInfo
          disabled
          messageErrors={this.facilityMessageError}
          countries={this.countries}
          provinces={this.provinces}
          districts={this.districts}
          selectedCountry={this.selectedCountry}
          selectedProvince={this.selectedProvince}
          selectedDistrict={this.selectedDistrict}
          changeInput={this.onClearMessageErrors}
          changeCountry={this.onChangeCountry}
          changeProvince={this.onChangeProvince}
          changeDistrict={this.changeDistrict}
        />
        {this.isLoadingLocation && <SpinLoading isInline={false} />}
      </Styled.Content>
    );
  }

  renderAction(hasErrors: boolean): JSX.Element {
    return (
      <Styled.Action>
        <Button
          label={this.$t('common.action.cancel')}
          variant="transparentPrimary"
          click={() => {
            this.exit(false);
          }}
          disabled={this.isSubmitting}
        />
        <Button
          width="240px"
          type="submit"
          variant="primary"
          label={this.$t('common.action.save_changes')}
          isLoading={this.isSubmitting}
          disabled={this.isSubmitting || hasErrors || this.hasEmptyLocation}
        />
      </Styled.Action>
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
                {this.renderContact()}
                {this.renderOrganization()}
                {this.renderAction(hasErrors)}
              </Styled.Container>
            );
          },
        }}
      />
    );
  }
}
