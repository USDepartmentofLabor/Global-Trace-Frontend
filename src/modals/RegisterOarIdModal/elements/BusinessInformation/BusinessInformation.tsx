import { Mixins, Component, Prop } from 'vue-property-decorator';
import { isEmpty, uniqBy } from 'lodash';
import { OarIdStatusEnum } from 'enums/onboard';
import { requestFacilityOarId } from 'api/onboard';
import Button from 'components/FormUI/Button';
import Input from 'components/FormUI/Input';
import LocationMixin from 'components/FormUI/Location/LocationMixin';
import MessageError from 'components/FormUI/MessageError';
import LocationForm from 'components/FormUI/Location/LocationForm';
import { handleError } from 'components/Toast';
import * as Styled from './styled';

@Component
export default class BusinessInformation extends Mixins(LocationMixin) {
  @Prop({ default: false }) disabledSubmit: boolean;
  @Prop({
    default: () => {
      //
    },
  })
  success: (
    data: Onboard.OarIdItem,
    oarIdRequest: Onboard.RegisterOarIdParams,
  ) => void;

  private formInput: Onboard.RegisterOarIdParams = {
    name: '',
    countryId: '',
    provinceId: '',
    districtId: '',
    address: '',
  };
  private isSubmitting: boolean = false;
  private messageErrors: App.MessageError = null;
  private hasErrorMatching: boolean = false;
  private formName: string = 'businessForm';

  get isEmptyCountry(): boolean {
    return isEmpty(this.selectedCountry);
  }

  get isEmptyProvince(): boolean {
    return isEmpty(this.selectedProvince);
  }

  get isEmptyDistrict(): boolean {
    return isEmpty(this.selectedDistrict);
  }

  get isDisabled(): boolean {
    return (
      this.isSubmitting ||
      this.isEmptyCountry ||
      this.isEmptyProvince ||
      this.isEmptyDistrict ||
      isEmpty(this.formInput.address) ||
      this.hasErrorMatching
    );
  }

  created(): void {
    this.getCountries();
  }

  onSubmit(): void {
    this.searchFacilityOar();
  }

  async searchFacilityOar(): Promise<void> {
    this.isSubmitting = true;
    try {
      const payload = {
        ...this.formInput,
        ...this.getLocationParams(),
      };
      const oarItem = await requestFacilityOarId(payload);
      if (oarItem.status == OarIdStatusEnum.ERROR_MATCHING) {
        this.hasErrorMatching = true;
      }
      if (oarItem && oarItem.status != OarIdStatusEnum.ERROR_MATCHING) {
        oarItem.matches = uniqBy(oarItem.matches, (oar) => oar.oarId);
        this.success(oarItem, payload);
      }
    } catch (error) {
      this.hasErrorMatching = true;
      handleError(error as App.ResponseError);
    } finally {
      this.isSubmitting = false;
    }
  }

  resetFormInput(): void {
    this.formInput.name = '';
    this.selectedCountry = null;
    this.selectedProvince = null;
    this.selectedDistrict = null;
    this.formInput.address = '';
    this.$formulate.resetValidation(this.formName);
  }

  onClearMessageErrors(): void {
    if (this.messageErrors) {
      this.messageErrors = null;
    }
    this.hasErrorMatching = false;
  }

  renderBusinessName(): JSX.Element {
    return (
      <fragment>
        <Input
          height="48px"
          variant="material"
          label={this.$t('business_name')}
          name="name"
          placeholder={this.$t('business_name')}
          validation="bail|required"
          disabled={this.isSubmitting}
          autoTrim
          changeValue={this.onClearMessageErrors}
          validationMessages={{
            required: this.$t('validation.required', {
              field: this.$t('business_name').toLowerCase(),
            }),
          }}
        />
        {this.messageErrors && (
          <MessageError
            field="businessName"
            messageErrors={this.messageErrors}
          />
        )}
      </fragment>
    );
  }

  renderLocation(): JSX.Element {
    return (
      <LocationForm
        disabled={this.isSubmitting}
        countries={this.countries}
        provinces={this.provinces}
        districts={this.districts}
        selectedCountry={this.selectedCountry}
        selectedProvince={this.selectedProvince}
        selectedDistrict={this.selectedDistrict}
        changeCountry={this.onChangeCountry}
        changeProvince={this.onChangeProvince}
        changeDistrict={this.changeDistrict}
        changeInput={this.onClearMessageErrors}
      />
    );
  }

  renderActions(hasErrors: boolean) {
    return (
      <Styled.Action>
        {this.hasErrorMatching && (
          <Styled.Error>
            {this.$t('registerOsIdModal.invalid_data')}
          </Styled.Error>
        )}
        <Button
          width="312px"
          type="submit"
          variant="warning"
          label={this.$t('registerOsIdModal.request_os_id')}
          isLoading={this.isSubmitting}
          disabled={this.disabledSubmit || this.isDisabled || hasErrors}
        />
      </Styled.Action>
    );
  }

  renderForm(): JSX.Element {
    return (
      <formulate-form
        v-model={this.formInput}
        name={this.formName}
        vOn:submit={this.onSubmit}
        scopedSlots={{
          default: ({ hasErrors }: { hasErrors: boolean }) => (
            <Styled.Form>
              <Styled.Content>
                {this.renderBusinessName()}
                {this.renderLocation()}
              </Styled.Content>
              {this.renderActions(hasErrors)}
            </Styled.Form>
          ),
        }}
      />
    );
  }

  render(): JSX.Element {
    return (
      <fragment>
        <Styled.Title>
          {this.$t('registerOsIdModal.business_information')}
        </Styled.Title>
        {this.renderForm()}
      </fragment>
    );
  }
}
