import { Vue, Component, Prop } from 'vue-property-decorator';
import { get } from 'lodash';
import { SpinLoading } from 'components/Loaders';
import LocationForm from 'components/FormUI/Location/LocationForm';
import BusinessInfo from './BusinessInfo';
import * as Styled from './styled';

@Component
export default class BusinessDetail extends Vue {
  @Prop({ required: true }) readonly userInfo: Auth.User;
  @Prop({ default: null }) readonly messageErrors: App.MessageError;
  @Prop({ default: false }) readonly disabled: boolean;
  @Prop({ default: true }) readonly showBusinessRegisterNumber: boolean;
  @Prop({ default: [] }) readonly countries: Location.Country[];
  @Prop({ default: [] }) readonly provinces: Location.Province[];
  @Prop({ default: [] }) readonly districts: Location.District[];
  @Prop({ default: null }) readonly selectedCountry: App.DropdownOption;
  @Prop({ default: null }) readonly selectedProvince: App.DropdownOption;
  @Prop({ default: null }) readonly selectedDistrict: App.DropdownOption;
  @Prop() changeInput: () => void;
  @Prop() changeCountry: (value: App.DropdownOption) => void;
  @Prop() changeProvince: (value: App.DropdownOption) => void;
  @Prop() changeDistrict: (value: App.DropdownOption) => void;

  private isLoading: boolean = false;

  get organizationMessageError(): App.MessageError {
    return get(this.messageErrors, 'facility.children');
  }

  renderInformation(): JSX.Element {
    if (this.userInfo) {
      return (
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
      );
    }
    return null;
  }

  render(): JSX.Element {
    return (
      <Styled.Group>
        <Styled.Title>{this.$t('organization_details')}</Styled.Title>
        <Styled.Content>
          <BusinessInfo
            disabled={this.disabled}
            showBusinessRegisterNumber={this.showBusinessRegisterNumber}
            messageErrors={this.organizationMessageError}
            changeValue={this.changeInput}
          />
          {this.renderInformation()}
        </Styled.Content>
        {this.isLoading && <SpinLoading isInline={false} />}
      </Styled.Group>
    );
  }
}
