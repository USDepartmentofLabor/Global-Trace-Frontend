import { Vue, Component, Prop } from 'vue-property-decorator';
import Input from 'components/FormUI/Input';
import MessageError from 'components/FormUI/MessageError';
import LocationForm from 'components/FormUI/Location/LocationForm';
import Dropdown from 'components/FormUI/Dropdown';
import * as Styled from './styled';

@Component
export default class BusinessInfo extends Vue {
  @Prop({ default: null }) readonly messageErrors: App.MessageError;
  @Prop({ default: false }) readonly disabled: boolean;
  @Prop({ default: [] }) readonly countries: Location.Country[];
  @Prop({ default: [] }) readonly provinces: Location.Province[];
  @Prop({ default: [] }) readonly districts: Location.District[];
  @Prop({ default: [] }) readonly selectedCommodities: App.DropdownOption[];
  @Prop({ default: null }) readonly selectedCountry: App.DropdownOption;
  @Prop({ default: null }) readonly selectedProvince: App.DropdownOption;
  @Prop({ default: null }) readonly selectedDistrict: App.DropdownOption;
  @Prop({
    default: () => {
      //
    },
  })
  changeInput: () => void;
  @Prop() changeCountry: (value: App.DropdownOption) => void;
  @Prop() changeProvince: (value: App.DropdownOption) => void;
  @Prop() changeDistrict: (value: App.DropdownOption) => void;

  renderBusinessName(): JSX.Element {
    return (
      <Styled.Input>
        <Input
          height="48px"
          maxlength={255}
          variant="material"
          label={this.$t('business_name')}
          name="businessName"
          placeholder={this.$t('business_name')}
          disabled={true}
          autoTrim
        />
      </Styled.Input>
    );
  }

  renderBusinessNumber(): JSX.Element {
    return (
      <Styled.Input>
        <Input
          height="48px"
          maxlength={255}
          variant="material"
          label={this.$t('business_code')}
          name="businessRegisterNumber"
          placeholder={this.$t('business_code')}
          validation="bail|required"
          disabled={this.disabled}
          changeValue={this.changeInput}
          autoTrim
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

  renderOarId(): JSX.Element {
    return (
      <Styled.Input>
        <Input
          height="48px"
          variant="material"
          label={this.$t('os_id')}
          name="oarId"
          placeholder={this.$t('os_id')}
          disabled={true}
        />
      </Styled.Input>
    );
  }

  renderCommodities(): JSX.Element {
    return (
      <Dropdown
        title={this.$t('select_goods')}
        height="48px"
        variant="material"
        width="100%"
        isMultiple
        value={this.selectedCommodities}
        options={this.selectedCommodities}
        placeholder={this.$t('select_goods')}
        disabled
        overflow
        limit={1}
        taggable
      />
    );
  }

  render(): JSX.Element {
    return (
      <Styled.InputGroup>
        <Styled.FormContentFull>
          {this.renderBusinessNumber()}
          {this.renderOarId()}
          {this.renderBusinessName()}
        </Styled.FormContentFull>
        <Styled.FormContent>
          <LocationForm
            disabled={true}
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
          {this.renderCommodities()}
        </Styled.FormContent>
      </Styled.InputGroup>
    );
  }
}
