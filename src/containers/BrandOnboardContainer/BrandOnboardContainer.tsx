import { Component, Mixins } from 'vue-property-decorator';
import { isNull } from 'lodash';
import { getUserInfo } from 'api/user-setting';
import { setUserInfo } from 'utils/cookie';
import { handleError } from 'components/Toast';
import { saveProfile } from 'api/brand-onboard';
import { SpinLoading } from 'components/Loaders';
import LocationMixin from 'components/FormUI/Location/LocationMixin';
import Input from 'components/FormUI/Input';
import Button from 'components/FormUI/Button';
import LocationForm from 'components/FormUI/Location/LocationForm';
import UploadLogo from 'components/FormUI/UploadLogo';
import * as Styled from './styled';

@Component
export default class BrandOnboardContainer extends Mixins(LocationMixin) {
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
      isNull(this.logo) ||
      isNull(this.selectedCountry) ||
      isNull(this.selectedProvince) ||
      isNull(this.formInput.address)
    );
  }

  created(): void {
    this.fetchDataLocation();
  }

  async onUpdateSuccess(): Promise<void> {
    const user = await getUserInfo();
    setUserInfo(user);
    this.$toast.success(this.$t('brandOnboardPage.update_profile_success'));
    this.$router.push({ name: 'BrandProfile' });
  }

  async onSubmit(): Promise<void> {
    try {
      this.isSubmitting = true;
      const data = {
        ...this.formInput,
        ...this.getLocationParams(),
        logo: this.logo,
      };
      await saveProfile(data);
      this.onUpdateSuccess();
    } catch (error) {
      handleError(error as App.ResponseError);
    } finally {
      this.isSubmitting = false;
    }
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
        changeFile={this.onChangeFile}
      />
    );
  }

  renderAction(hasErrors: boolean): JSX.Element {
    return (
      <Button
        type="submit"
        label={this.$t('save')}
        variant="primary"
        width="244px"
        isLoading={this.isSubmitting}
        disabled={this.disabled || hasErrors}
      />
    );
  }

  renderForm(): JSX.Element {
    return (
      <formulate-form
        name="onBoardUpdateProfile"
        v-model={this.formInput}
        vOn:submit={this.onSubmit}
        scopedSlots={{
          default: ({ hasErrors }: { hasErrors: boolean }) => (
            <Styled.FormContainer>
              <Styled.Container>
                <Styled.Text>{this.$t('brand')}</Styled.Text>
                <Styled.Form>{this.renderBrandContainer()}</Styled.Form>
                <Styled.Text>
                  {this.$t('brandOnboardPage.headquarter')}
                </Styled.Text>
                <Styled.Form>{this.renderHeadQuarterContainer()}</Styled.Form>
              </Styled.Container>
              <Styled.Action>{this.renderAction(hasErrors)}</Styled.Action>
            </Styled.FormContainer>
          ),
        }}
      />
    );
  }

  renderContent(): JSX.Element {
    return (
      <Styled.Wrapper>
        <Styled.Title>{this.$t('brandOnboardPage.title')}</Styled.Title>
        {this.renderForm()}
      </Styled.Wrapper>
    );
  }

  render(): JSX.Element {
    return (
      <dashboard-layout>
        {this.renderContent()}
        {this.isLoadingLocation && <SpinLoading isInline={false} />}
      </dashboard-layout>
    );
  }
}
