import { Component, Prop, Vue } from 'vue-property-decorator';
import { get, isEmpty, isNull, values } from 'lodash';
import moment from 'moment';
import { getInputValue } from 'utils/helpers';
import { convertDateToTimestamp, currentTimestamp } from 'utils/date';
import { getUserInfo, updateProfile } from 'api/user-setting';
import { handleError } from 'components/Toast';
import { SpinLoading } from 'components/Loaders';
import Button from 'components/FormUI/Button';
import { ChainOfCustodyEnum } from 'enums/role';
import ContactProfile from './ContactProfile';
import BusinessInfo from './BusinessInfo';
import BusinessModel from './BusinessModel';
import * as Styled from './styled';

@Component
export default class MyProfile extends Vue {
  @Prop({ default: '' }) readonly chainOfCustody: string;
  @Prop({
    default: () => {
      //
    },
  })
  updated: () => void;

  private formInput: Onboard.ProfileRequestParams = {
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: '',
    businessName: '',
    businessRegisterNumber: '',
    oarId: '',
    countryId: '',
    provinceId: '',
    districtId: '',
    certification: '',
    reconciliationStartAt: null,
    reconciliationDuration: '',
    address: '',
    goods: [],
  };
  private isLoading: boolean = false;
  private formName: string = 'myProfile';
  private isSubmitting: boolean = false;
  public messageErrors: App.MessageError = null;
  private userInfo: Auth.User = null;

  get formData(): Onboard.ProfileRequestParams {
    return this.$formulate.registry.get(this.formName).proxy;
  }

  get userMessageErrors(): App.MessageError {
    return get(this.messageErrors, 'user.children');
  }

  get isMassBalance(): boolean {
    return this.chainOfCustody === ChainOfCustodyEnum.MASS_BALANCE;
  }

  get facilityMessageErrors(): App.MessageError {
    return get(this.messageErrors, 'facility.children');
  }

  get isDisabledSubmitButton(): boolean {
    const { countryId, certification, businessName, reconciliationStartAt } =
      this.formData;
    return (
      this.isLoading ||
      this.isSubmitting ||
      isEmpty(businessName) ||
      isEmpty(countryId) ||
      isEmpty(certification) ||
      (this.isMassBalance && isNull(reconciliationStartAt))
    );
  }

  created(): void {
    this.getUserInfo();
  }

  onClearMessageErrors(): void {
    if (this.messageErrors) {
      this.messageErrors = null;
    }
  }

  getUserParams(): Auth.User {
    const { firstName, lastName, email, phoneNumber } = this.formInput;
    return {
      firstName,
      lastName,
      email,
      phoneNumber: getInputValue(phoneNumber),
      updatedProfileAt: currentTimestamp(),
    };
  }

  getFacilityParams(): Auth.Facility {
    const {
      businessName,
      businessRegisterNumber,
      oarId,
      address,
      countryId,
      provinceId,
      districtId,
      goods,
    } = this.formInput;
    return {
      name: businessName,
      businessRegisterNumber: getInputValue(businessRegisterNumber),
      oarId,
      address: getInputValue(address),
      countryId,
      provinceId,
      goods,
      districtId,
      ...this.getBusinessModelParams(),
    };
  }

  getBusinessModelParams(): Onboard.BusinessModelParams {
    const { reconciliationStartAt, certification, reconciliationDuration } =
      this.formInput;
    return {
      certification,
      chainOfCustody: this.chainOfCustody,
      reconciliationStartAt: convertDateToTimestamp(
        moment(reconciliationStartAt).toDate(),
      ),
      reconciliationDuration,
    };
  }

  getFormParams(): Onboard.ProfileFormData {
    return {
      user: this.getUserParams(),
      facility: this.getFacilityParams(),
    };
  }

  initContactInputValue(user: Auth.User): void {
    const { firstName, lastName, email, phoneNumber } = user;
    this.formInput.firstName = firstName;
    this.formInput.lastName = lastName;
    this.formInput.email = email;
    this.formInput.phoneNumber = phoneNumber;
  }

  async getUserInfo(): Promise<void> {
    try {
      this.isLoading = true;
      const userInfo = await getUserInfo();
      this.userInfo = userInfo;
      this.initContactInputValue(userInfo);
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
      await updateProfile(this.getFormParams());
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

  renderActions(hasErrors: boolean): JSX.Element {
    return (
      <Styled.Action>
        <Button
          key={hasErrors}
          width="240px"
          type="submit"
          variant="primary"
          label={this.$t('next')}
          isLoading={this.isSubmitting}
          disabled={this.isDisabledSubmitButton || hasErrors}
        />
      </Styled.Action>
    );
  }

  renderContactProfile(): JSX.Element {
    return (
      <ContactProfile
        userInfo={this.userInfo}
        disabled={this.isSubmitting}
        messageErrors={this.userMessageErrors}
        changeInput={this.onClearMessageErrors}
      />
    );
  }

  renderBusinessInfo(): JSX.Element {
    return (
      <BusinessInfo
        userInfo={this.userInfo}
        disabled={this.isSubmitting}
        messageErrors={this.facilityMessageErrors}
        changeInput={this.onClearMessageErrors}
      />
    );
  }

  renderBusinessModel(): JSX.Element {
    return (
      <BusinessModel
        userInfo={this.userInfo}
        disabled={this.isSubmitting}
        isMassBalance={this.isMassBalance}
      />
    );
  }

  renderForm(): JSX.Element {
    return (
      <formulate-form
        v-model={this.formInput}
        name={this.formName}
        vOn:submit={this.onSubmit}
        scopedSlots={{
          default: ({ hasErrors }: { hasErrors: boolean }) => {
            return (
              <Styled.Form>
                {this.renderContactProfile()}
                {this.renderBusinessInfo()}
                {this.renderBusinessModel()}
                {this.renderActions(hasErrors)}
              </Styled.Form>
            );
          },
        }}
      />
    );
  }

  render(): JSX.Element {
    return (
      <fragment>
        {this.isLoading && <SpinLoading isInline={false} />}
        {!this.isLoading && this.renderForm()}
      </fragment>
    );
  }
}
