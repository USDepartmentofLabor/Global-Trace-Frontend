import { Component, Mixins, Prop } from 'vue-property-decorator';
import { isNull, omit } from 'lodash';
import { saveProfile } from 'api/brand-onboard';
import LocationMixin from 'components/FormUI/Location/LocationMixin';
import Button from 'components/FormUI/Button';
import SpinLoading from 'components/Loaders/SpinLoading';
import LocationForm from 'components/FormUI/Location/LocationForm';
import Input from 'components/FormUI/Input';
import { handleError } from 'components/Toast';
import UploadLogo from 'components/FormUI/UploadLogo';
import * as Styled from './styled';

@Component
export default class BrandEditProfileModal extends Mixins(LocationMixin) {
  @Prop({ required: true }) profile: Auth.Facility;
  @Prop({ required: true }) onSuccess: () => void;

  private isSubmitting: boolean = false;
  private messageErrors: App.MessageError = null;
  private logo: File = null;
  private formInput: BrandOnboard.RequestParams = {
    name: null,
    businessRegisterNumber: null,
    logo: null,
    countryId: null,
    provinceId: null,
    districtId: null,
    address: null,
  };

  get disabled(): boolean {
    return (
      this.isSubmitting ||
      isNull(this.selectedCountry) ||
      isNull(this.selectedProvince) ||
      isNull(this.formInput.address)
    );
  }

  created(): void {
    this.fetchDataLocation(
      this.profile.countryId,
      this.profile.provinceId,
      this.profile.districtId,
    );
    this.initData();
  }

  initData(): void {
    this.formInput = {
      ...this.formInput,
      name: this.profile.name,
      businessRegisterNumber: this.profile.businessRegisterNumber,
      address: this.profile.address,
    };
  }

  async onSubmit(): Promise<void> {
    try {
      this.isSubmitting = true;
      let data = {
        ...this.formInput,
        ...this.getLocationParams(),
      };
      if (isNull(this.logo)) {
        data = omit(data, 'logo');
      } else {
        data.logo = this.logo;
      }
      await saveProfile(data);
      this.closeModal();
      this.$toast.success(this.$t('brandEditProfileModal.update_success'));
      this.onSuccess();
    } catch (error) {
      handleError(error as App.ResponseError);
    } finally {
      this.isSubmitting = false;
    }
  }

  closeModal() {
    this.$emit('close');
  }

  onClearMessageErrors(): void {
    if (this.messageErrors) {
      this.messageErrors = null;
    }
  }

  onChangeFile(selectedFile: App.SelectedFile): void {
    if (selectedFile) {
      this.logo = selectedFile.file;
    }
  }

  renderBrandContainer(): JSX.Element {
    return (
      <Styled.BrandContainer>
        <Styled.Grid>
          <Styled.Col>
            <Input
              label={this.$t('brandOnboardPage.brand_name')}
              placeholder={this.$t('brandOnboardPage.brand_name')}
              name="name"
              height="48px"
              maxlength={255}
              validation="bail|required"
              disabled={this.isSubmitting}
              changeValue={this.onClearMessageErrors}
              validationMessages={{
                required: this.$t('validation.required', {
                  field: this.$t('brandOnboardPage.brand_name').toLowerCase(),
                  interpolation: { escapeValue: false },
                }),
              }}
            />
            <Input
              label={this.$t('business_number')}
              placeholder={this.$t('business_number')}
              name="businessRegisterNumber"
              height="48px"
              validation="bail|required|uuid"
              disabled={this.isSubmitting}
              changeValue={this.onClearMessageErrors}
              validationMessages={{
                required: this.$t('validation.required', {
                  field: this.$t('business_number').toLowerCase(),
                }),
                uuid: this.$t('validation.invalid', {
                  field: this.$t('business_number'),
                }),
              }}
            />
          </Styled.Col>
          {this.renderUploadLogo()}
        </Styled.Grid>
      </Styled.BrandContainer>
    );
  }

  renderHeadQuarterContainer(): JSX.Element {
    return (
      <Styled.BrandContainer>
        <Styled.HeadQuarter>
          <LocationForm
            disabled={this.isSubmitting}
            addressPlaceholder={this.$t('brandOnboardPage.headquarter')}
            variant="default"
            countries={this.countries}
            provinces={this.provinces}
            districts={this.districts}
            selectedCountry={this.selectedCountry}
            selectedProvince={this.selectedProvince}
            selectedDistrict={this.selectedDistrict}
            changeCountry={this.onChangeCountry}
            changeProvince={this.onChangeProvince}
            changeDistrict={this.changeDistrict}
            changeValue={this.onClearMessageErrors}
          />
        </Styled.HeadQuarter>
      </Styled.BrandContainer>
    );
  }

  renderUploadLogo(): JSX.Element {
    return (
      <UploadLogo
        disabled={this.isSubmitting}
        inputId="uploadLogo"
        logoUrl={this.profile.logo}
        changeFile={this.onChangeFile}
      />
    );
  }

  renderActions(hasErrors: boolean): JSX.Element {
    return (
      <Styled.Row>
        <Button
          label={this.$t('common.action.cancel')}
          variant="transparentPrimary"
          width="100%"
          disabled={this.isSubmitting}
          click={this.closeModal}
        />
        <Button
          type="submit"
          label={this.$t('common.action.save_changes')}
          variant="primary"
          width="100%"
          isLoading={this.isSubmitting}
          disabled={this.disabled || hasErrors}
        />
      </Styled.Row>
    );
  }

  renderForm(): JSX.Element {
    return (
      <formulate-form
        name="brandUpdateProfile"
        v-model={this.formInput}
        vOn:submit={this.onSubmit}
        scopedSlots={{
          default: ({ hasErrors }: { hasErrors: boolean }) => (
            <Styled.FormContainer>
              <Styled.Container>
                <Styled.Form>{this.renderBrandContainer()}</Styled.Form>
                <Styled.Text>
                  {this.$t('brandOnboardPage.headquarter')}
                </Styled.Text>
                <Styled.Form>{this.renderHeadQuarterContainer()}</Styled.Form>
              </Styled.Container>
              <Styled.Action>{this.renderActions(hasErrors)}</Styled.Action>
            </Styled.FormContainer>
          ),
        }}
      />
    );
  }

  render(): JSX.Element {
    return (
      <modal-layout
        title={this.$t('brandEditProfileModal.title')}
        closeModal={this.closeModal}
        showCloseIcon={false}
      >
        <Styled.Wrapper>
          {this.renderForm()}
          {this.isLoadingLocation && <SpinLoading isInline={false} />}
        </Styled.Wrapper>
      </modal-layout>
    );
  }
}
