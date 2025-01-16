import { Vue, Component, Prop } from 'vue-property-decorator';
import { isEqual } from 'lodash';
import { handleError } from 'components/Toast';
import { SpinLoading } from 'components/Loaders';
import { getBusinessDetail, updateBusinessDetail } from 'api/system-profile';
import Button from 'components/FormUI/Button';
import UploadLogo from 'components/FormUI/UploadLogo';
import SwitchInput from 'components/FormUI/SwitchInput';
import Input from 'components/FormUI/Input';
import { SettingTabEnum } from 'enums/setting';
import * as Styled from './styled';

@Component
export default class SiteSetting extends Vue {
  @Prop({
    default: () => {
      //
    },
  })
  finish: (name: SettingTabEnum) => void;

  private formName: string = 'SiteSetting';
  private isLoading = true;
  private isSubmitting = false;
  private businessDetail: SystemProfile.BusinessDetail = null;
  private logo: File = null;
  private logoUrl: string = null;
  private formInput: SystemProfile.BusinessDetailParams = {
    name: '',
    logo: null,
    isGpsEnabled: false,
  };
  private initialFormInput: SystemProfile.BusinessDetailParams = {
    name: '',
    logo: null,
    isGpsEnabled: false,
  };

  get formData(): SystemProfile.BusinessDetailParams {
    return this.$formulate.registry.get(this.formName).proxy;
  }

  get formHasChanged(): boolean {
    return !isEqual(this.formInput, this.initialFormInput);
  }

  get isDisabled(): boolean {
    return this.isLoading || this.isSubmitting || !this.formHasChanged;
  }

  created() {
    this.getBusinessDetail();
  }

  initData(): void {
    if (this.businessDetail) {
      const { name, logo, isGpsEnabled } = this.businessDetail;
      this.formInput.name = name;
      this.formInput.isGpsEnabled = isGpsEnabled;
      if (logo) {
        this.logoUrl = logo.link;
      }
      this.initialFormInput = { ...this.formInput };
    }
  }

  async getBusinessDetail(): Promise<void> {
    try {
      this.businessDetail = await getBusinessDetail();
      this.initData();
    } catch (error) {
      handleError(error as App.ResponseError);
    } finally {
      this.isLoading = false;
    }
  }

  onChangeFile(selectedFile: App.SelectedFile): void {
    if (selectedFile) {
      this.logo = selectedFile.file;
      this.formInput.logo = this.logo;
    }
  }

  changeGPS(value: boolean) {
    this.formInput.isGpsEnabled = value;
  }

  handleInputSearch(value: string): void {
    this.formInput.name = value;
  }

  async onSubmit(): Promise<void> {
    try {
      this.isSubmitting = true;
      const data = {
        ...this.formInput,
        logo: this.logo,
      };
      await updateBusinessDetail(data);
      this.initialFormInput = { ...this.formInput };
      this.finish(SettingTabEnum.SETUP_PROFILE);
    } catch (error) {
      handleError(error as App.ResponseError);
    } finally {
      this.isSubmitting = false;
    }
  }

  renderUploadLogo(): JSX.Element {
    return (
      <UploadLogo
        disabled={this.isSubmitting}
        inputId="uploadLogo"
        logoUrl={this.logoUrl}
        labelUpload={this.$t('upload_new_photo')}
        changeFile={this.onChangeFile}
      />
    );
  }

  renderAction(hasErrors: boolean): JSX.Element {
    return (
      <Button
        type="submit"
        label={this.$t('next')}
        variant="primary"
        width="244px"
        isLoading={this.isSubmitting}
        disabled={this.isDisabled || hasErrors}
      />
    );
  }

  renderName(): JSX.Element {
    return (
      <Styled.Column>
        <Input
          label={this.$t('system_name')}
          name="name"
          height="48px"
          placeholder={this.$t('enter_system_name')}
          validation="bail|required"
          disabled={this.isSubmitting}
          autoTrim
          maxLength={255}
          changeValue={(value: string) => {
            this.handleInputSearch(value);
          }}
          validationMessages={{
            required: this.$t('validation.required', {
              field: this.$t('system_name').toLowerCase(),
            }),
          }}
        />
      </Styled.Column>
    );
  }

  renderGPS(): JSX.Element {
    return (
      <Styled.GPS>
        <Styled.GPSInfo>
          <Styled.GPSService>
            <font-icon name="location" color="highland" size="20" />
            {this.$t('location_services')}
          </Styled.GPSService>
          <Styled.GPSServiceDetails>
            {this.$t('allow_GPS_details')}
          </Styled.GPSServiceDetails>
        </Styled.GPSInfo>
        <SwitchInput
          value={this.formInput.isGpsEnabled}
          change={this.changeGPS}
        />
      </Styled.GPS>
    );
  }

  renderForm(): JSX.Element {
    return (
      <formulate-form
        name="SiteSetting"
        v-model={this.formInput}
        vOn:submit={this.onSubmit}
        scopedSlots={{
          default: ({ hasErrors }: { hasErrors: boolean }) => (
            <fragment>
              <Styled.Content>
                {this.renderName()}
                {this.renderUploadLogo()}
                {this.renderGPS()}
              </Styled.Content>
              <Styled.Action>{this.renderAction(hasErrors)}</Styled.Action>
            </fragment>
          ),
        }}
      />
    );
  }

  render(): JSX.Element {
    return (
      <Styled.Wrapper>
        {this.isLoading && <SpinLoading />}
        {!this.isLoading && this.renderForm()}
      </Styled.Wrapper>
    );
  }
}
