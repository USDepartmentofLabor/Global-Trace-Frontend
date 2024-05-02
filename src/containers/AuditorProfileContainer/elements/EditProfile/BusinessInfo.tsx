import { Vue, Component, Prop } from 'vue-property-decorator';
import Input from 'components/FormUI/Input';
import MessageError from 'components/FormUI/MessageError';
import LocationForm from 'components/FormUI/Location/LocationForm';
import * as Styled from './styled';

@Component
export default class BusinessInfo extends Vue {
  @Prop({ default: null }) readonly messageErrors: App.MessageError;
  @Prop({ default: false }) readonly disabled: boolean;
  @Prop({ default: [] }) readonly countries: Location.Country[];
  @Prop({ default: [] }) readonly provinces: Location.Province[];
  @Prop({ default: [] }) readonly districts: Location.District[];
  @Prop({ default: null }) readonly selectedCountry: App.DropdownOption;
  @Prop({ default: null }) readonly selectedProvince: App.DropdownOption;
  @Prop({ default: null }) readonly selectedDistrict: App.DropdownOption;
  @Prop() changeCountry: (value: App.DropdownOption) => void;
  @Prop() changeProvince: (value: App.DropdownOption) => void;
  @Prop() changeDistrict: (value: App.DropdownOption) => void;
  @Prop({
    default: () => {
      //
    },
  })
  changeInput: () => void;

  renderBusinessName(): JSX.Element {
    const label = this.$t('business_name');
    return (
      <Styled.Input>
        <Input
          width="100%"
          height="48px"
          maxlength={255}
          variant="material"
          label={label}
          name="businessName"
          placeholder={this.$t('business_name')}
          validation="bail|required"
          disabled={this.disabled}
          changeValue={this.changeInput}
          autoTrim
          validationMessages={{
            required: this.$t('validation.required', {
              field: this.$t('business_name').toLowerCase(),
            }),
          }}
        />
        {this.messageErrors && (
          <MessageError field="name" messageErrors={this.messageErrors} />
        )}
      </Styled.Input>
    );
  }

  renderBusinessNumber(): JSX.Element {
    return (
      <Styled.Input>
        <Input
          width="100%"
          height="48px"
          maxlength={255}
          variant="material"
          label={this.$t('business_code')}
          name="businessRegisterNumber"
          placeholder={this.$t('business_code')}
          validation="bail|required"
          disabled={this.disabled}
          changeValue={this.changeInput}
          validationMessages={{
            required: this.$t('validation.required', {
              field: this.$t('business_code').toLowerCase(),
            }),
          }}
        />
        {this.messageErrors && (
          <MessageError
            field="businessRegisterNumber"
            messageErrors={this.messageErrors}
          />
        )}
      </Styled.Input>
    );
  }

  render(): JSX.Element {
    return (
      <Styled.BusinessFormContent>
        {this.renderBusinessName()}
        {this.renderBusinessNumber()}
        <LocationForm
          disabled={this.disabled}
          countries={this.countries}
          provinces={this.provinces}
          districts={this.districts}
          selectedCountry={this.selectedCountry}
          selectedProvince={this.selectedProvince}
          selectedDistrict={this.selectedDistrict}
          changeCountry={this.changeCountry}
          changeProvince={this.changeProvince}
          changeDistrict={this.changeDistrict}
          changeValue={this.changeInput}
        />
      </Styled.BusinessFormContent>
    );
  }
}
