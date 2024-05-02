/* eslint-disable max-lines */
import { Vue, Component, Prop } from 'vue-property-decorator';
import { isEmpty, isEqual } from 'lodash';
import Dropdown from 'components/FormUI/Dropdown';
import location from 'store/modules/location';
import { handleError } from 'components/Toast';
import { SpinLoading } from 'components/Loaders';
import {
  getBusinessDetail,
  updateBusinessDetail,
  getCommodities,
} from 'api/system-profile';
import Button from 'components/FormUI/Button';
import UploadLogo from 'components/FormUI/UploadLogo';
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
  private selectedCountries: App.DropdownOption[] = [];
  private logo: File = null;
  private logoUrl: string = null;
  private formInput: SystemProfile.BusinessDetailParams = {
    name: '',
    commodities: [],
    logo: null,
    countryIds: [],
  };
  private initialFormInput: SystemProfile.BusinessDetailParams = {
    name: '',
    commodities: [],
    logo: null,
    countryIds: [],
  };
  private selectedCommodity: App.DropdownOption[] = [];
  private commodities: SystemProfile.Commodities[] = [];

  get countryOptions(): App.DropdownOption[] {
    return location.countries.map(({ id, country }) => ({ id, name: country }));
  }

  get commoditiesOptions(): App.DropdownOption[] {
    return this.commodities.map(({ commodity }, index) => ({
      id: index,
      name: commodity,
    }));
  }

  get formData(): SystemProfile.BusinessDetailParams {
    return this.$formulate.registry.get(this.formName).proxy;
  }

  get formHasChanged(): boolean {
    return !isEqual(this.formInput, this.initialFormInput);
  }

  get isDisabled(): boolean {
    return (
      this.isLoading ||
      this.isSubmitting ||
      isEmpty(this.selectedCountries) ||
      isEmpty(this.selectedCommodity) ||
      !this.formHasChanged
    );
  }

  created() {
    this.getBusinessDetail();
  }

  initLocation(): Promise<void> {
    return location.getCountries({
      callback: {
        onFailure: (error: App.ResponseError) => {
          handleError(error);
        },
      },
    });
  }

  initData(): void {
    if (this.businessDetail) {
      const { name, commodities, logo, countryIds } = this.businessDetail;
      this.formInput.name = name;
      const commoditiesOption = this.commoditiesOptions.filter(({ name }) =>
        commodities.includes(name),
      );
      if (commoditiesOption) {
        this.onChangeCommodity(commoditiesOption);
      }
      const countries = this.countryOptions.filter(({ id }) =>
        countryIds.includes(id as string),
      );
      if (countries) {
        this.onChangeCountry(countries);
      }
      if (logo) {
        this.logoUrl = logo.link;
      }
      this.initialFormInput = { ...this.formInput };
    }
  }

  async getBusinessDetail(): Promise<void> {
    try {
      await this.initLocation();
      this.businessDetail = await getBusinessDetail();
      await this.getCommodities();
      this.initData();
    } catch (error) {
      handleError(error as App.ResponseError);
    } finally {
      this.isLoading = false;
    }
  }

  async getCommodities(): Promise<void> {
    try {
      this.commodities = await getCommodities();
    } catch (error) {
      handleError(error as App.ResponseError);
    }
  }

  onChangeFile(selectedFile: App.SelectedFile): void {
    if (selectedFile) {
      this.logo = selectedFile.file;
      this.formInput.logo = this.logo;
    }
  }

  onChangeCountry(option: App.DropdownOption[] = []): void {
    this.selectedCountries = option;
    this.formInput.countryIds = this.selectedCountries.map(
      (item) => item.id as string,
    );
  }

  onChangeCommodity(option: App.DropdownOption[] = []): void {
    this.selectedCommodity = option;
    this.formInput.commodities = this.selectedCommodity.map(
      (item) => item.name,
    );
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

  renderOptionBody(option: App.DropdownOption): JSX.Element {
    const isCheckedCommodity = this.selectedCommodity.some(
      (item) => item.name === option.name,
    );
    const isCheckedCountry = this.selectedCountries.some(
      (item) => item.name === option.name,
    );
    return (
      <Styled.OptionBody>
        {option.name}
        {(isCheckedCommodity || isCheckedCountry) && (
          <font-icon name="check" color="highland" size="20" />
        )}
      </Styled.OptionBody>
    );
  }

  renderCommodities(): JSX.Element {
    return (
      <Dropdown
        title={this.$t('goods')}
        placeholder={this.$t('select_goods')}
        height="48px"
        isMultiple
        options={this.commoditiesOptions}
        width="100%"
        value={this.selectedCommodity}
        disable={this.isSubmitting}
        trackBy="id"
        closeOnSelect={false}
        changeOptionValue={this.onChangeCommodity}
        limit={1}
        taggable
        scopedSlots={{
          optionBody: (option: App.LanguageOption) =>
            this.renderOptionBody(option),
        }}
      />
    );
  }

  renderCountries(): JSX.Element {
    return (
      <Dropdown
        title={this.$t('country')}
        placeholder={this.$t('choose_country')}
        height="48px"
        isMultiple
        options={this.countryOptions}
        width="100%"
        value={this.selectedCountries}
        disable={this.isSubmitting}
        trackBy="id"
        closeOnSelect={false}
        changeOptionValue={this.onChangeCountry}
        limit={1}
        taggable
        scopedSlots={{
          optionBody: (option: App.LanguageOption) =>
            this.renderOptionBody(option),
        }}
      />
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
                {this.renderCountries()}
                {this.renderCommodities()}
                {this.renderUploadLogo()}
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
