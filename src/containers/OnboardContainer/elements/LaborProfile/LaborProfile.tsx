import { Mixins, Component, Prop } from 'vue-property-decorator';
import { get, isEmpty, values } from 'lodash';
import { getUserInfo, updateProfile } from 'api/user-setting';
import { SpinLoading } from 'components/Loaders';
import LocationMixin from 'components/FormUI/Location/LocationMixin';
import { handleError } from 'components/Toast';
import Button from 'components/FormUI/Button';
import ContactProfile from './ContactProfile';
import BusinessDetail from './BusinessDetail';
import * as Styled from './styled';

@Component
export default class LaborProfile extends Mixins(LocationMixin) {
  @Prop({
    default: () => {
      //
    },
  })
  updated: () => void;

  private formInput: AuditorOnboard.ProfileRequestParams = {
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
  private isLoading: boolean = false;
  private isSubmitting: boolean = false;
  public messageErrors: App.MessageError = null;
  private userInfo: Auth.User = null;

  get showBusinessRegisterNumber(): boolean {
    return this.$route.name === 'AuditorOnboard';
  }

  get userMessageErrors(): App.MessageError {
    return get(this.messageErrors, 'user.children');
  }

  get isEmptyCountry(): boolean {
    return isEmpty(this.selectedCountry);
  }

  get isEmptyProvince(): boolean {
    return isEmpty(this.selectedProvince);
  }

  get isEmptyDistrict(): boolean {
    return isEmpty(this.selectedDistrict);
  }

  get isDisabledSubmitButton(): boolean {
    return (
      this.isLoading ||
      this.isSubmitting ||
      this.isEmptyCountry ||
      this.isEmptyProvince ||
      this.isEmptyDistrict
    );
  }

  get formParams(): AuditorOnboard.ProfileFormData {
    const {
      firstName,
      lastName,
      email,
      phoneNumber,
      businessName,
      businessRegisterNumber,
      address,
    } = this.formInput;
    return {
      user: {
        firstName,
        lastName,
        email,
        phoneNumber,
      },
      facility: {
        name: businessName,
        businessRegisterNumber: this.showBusinessRegisterNumber
          ? businessRegisterNumber
          : undefined,
        ...this.getLocationParams(),
        address: address,
      },
    };
  }

  created(): void {
    this.initUserInfo();
    this.fetchDataLocationDefault();
  }

  onClearMessageErrors(): void {
    if (this.messageErrors) {
      this.messageErrors = null;
    }
  }

  initContactInputValue(user: Auth.User): void {
    const { firstName, lastName, email, phoneNumber } = user;
    this.formInput = {
      ...this.formInput,
      firstName,
      lastName,
      email,
      phoneNumber,
    };
  }

  async initUserInfo(): Promise<void> {
    try {
      this.isLoading = true;
      const result = await getUserInfo();
      this.userInfo = result;
      this.initContactInputValue(result);
    } catch (error) {
      handleError(error as App.ResponseError);
      this.messageErrors = get(error, 'errors');
    } finally {
      this.isLoading = false;
    }
  }

  async onSubmit(): Promise<void> {
    try {
      this.isSubmitting = true;
      await updateProfile(this.formParams);
      this.$toast.success(this.$t('onboardPage.profile_updated'));
      this.updated();
    } catch (error) {
      const errors = get(error, 'errors');
      if (values(errors).length > 0) {
        this.messageErrors = errors;
      } else {
        handleError(error as App.ResponseError);
      }
    } finally {
      this.isSubmitting = false;
    }
  }

  renderAction(hasErrors: boolean): JSX.Element {
    return (
      <Styled.Actions>
        <Button
          width="240px"
          type="submit"
          variant="primary"
          label={this.$t('save')}
          isLoading={this.isSubmitting}
          disabled={this.isDisabledSubmitButton || hasErrors}
        />
      </Styled.Actions>
    );
  }

  renderUserInfo(): JSX.Element {
    return (
      <ContactProfile
        userInfo={this.userInfo}
        disabled={this.isSubmitting}
        messageErrors={this.userMessageErrors}
        changeInput={this.onClearMessageErrors}
      />
    );
  }

  renderOrganizationInfo(): JSX.Element {
    return (
      <fragment>
        <BusinessDetail
          userInfo={this.userInfo}
          disabled={this.isSubmitting}
          messageErrors={this.messageErrors}
          showBusinessRegisterNumber={this.showBusinessRegisterNumber}
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
      </fragment>
    );
  }

  render(): JSX.Element {
    return (
      <Styled.Wrapper>
        <formulate-form
          name="MyAuditorProfile"
          v-model={this.formInput}
          vOn:submit={this.onSubmit}
          scopedSlots={{
            default: ({ hasErrors }: { hasErrors: boolean }) => {
              return (
                <fragment>
                  {this.userInfo && (
                    <fragment>
                      {this.renderUserInfo()}
                      {this.renderOrganizationInfo()}
                    </fragment>
                  )}
                  {this.renderAction(hasErrors)}
                </fragment>
              );
            },
          }}
        />
      </Styled.Wrapper>
    );
  }
}
