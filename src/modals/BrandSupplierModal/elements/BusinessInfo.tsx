import { Vue, Component, Prop } from 'vue-property-decorator';
import Input from 'components/FormUI/Input';
import Dropdown from 'components/FormUI/Dropdown';
import MessageError from 'components/FormUI/MessageError';
import SearchBox from './SearchBox';
import * as Styled from './styled';

@Component
export default class BusinessInfo extends Vue {
  @Prop({ default: false }) readonly isEdit: boolean;
  @Prop({ default: null }) readonly messageErrors: App.MessageError;
  @Prop({ default: false }) readonly disabled: boolean;
  @Prop({ default: false }) readonly disabledFacilityType: boolean;
  @Prop({ default: null }) readonly facilityTypeDefault: App.DropdownOption;
  @Prop({ default: [] }) readonly facilityTypeOptions: App.DropdownOption[];
  @Prop({
    type: Function,
    default: () => {
      //
    },
  })
  changeInput: () => void;
  @Prop({
    type: Function,
    default: () => {
      //
    },
  })
  setFacility: (facility: Auth.Facility) => void;
  @Prop({
    type: Function,
    default: () => {
      //
    },
  })
  changeType: (option: App.DropdownOption) => void;
  @Prop({
    type: Function,
    default: () => {
      //
    },
  })
  changeName: (value: string) => void;

  get formName(): string {
    return this.$formulate.registry.keys().next().value;
  }

  get formData(): BrandSupplier.SupplierRequestParams {
    return this.$formulate.registry.get(this.formName).proxy;
  }

  changeSearch(value: string): void {
    this.changeInput();
    this.setFacility(null);
    this.$formulate.resetValidation(this.formName);
    this.changeName(value);
  }

  renderBusinessName(): JSX.Element {
    return (
      <Styled.Column>
        {this.isEdit && (
          <Input
            label={this.$t('business_name')}
            name="name"
            placeholder={this.$t('business_name')}
            height="48px"
            iconSize="24"
            maxlength={255}
            changeValue={this.changeInput}
            disabled={this.disabled}
            autoTrim
            validation="bail|required"
            validationMessages={{
              required: this.$t('validation.required', {
                field: this.$t('business_name').toLowerCase(),
              }),
            }}
          />
        )}
        {!this.isEdit && (
          <SearchBox
            selectedFacility={this.formData.name}
            changeSearch={this.changeSearch}
            setFacility={this.setFacility}
          />
        )}
        {this.messageErrors && (
          <MessageError field="name" messageErrors={this.messageErrors} />
        )}
      </Styled.Column>
    );
  }

  renderBusinessRegisterNumber(): JSX.Element {
    return (
      <Styled.Column>
        <Input
          label={this.$t('business_number')}
          placeholder={this.$t('business_reg_number')}
          name="businessRegisterNumber"
          height="48px"
          maxlength={255}
          autoTrim
          disabled={this.disabled}
          changeValue={this.changeInput}
        />
        {this.messageErrors && (
          <MessageError
            field="businessRegisterNumber"
            messageErrors={this.messageErrors}
          />
        )}
      </Styled.Column>
    );
  }

  renderBusinessInfo(): JSX.Element {
    return (
      <fragment>
        {this.renderBusinessName()}
        {this.renderBusinessRegisterNumber()}
      </fragment>
    );
  }

  renderOarIdFacilityType(): JSX.Element {
    return (
      <fragment>
        <Styled.Column>
          <Input
            label={this.$t('os_id')}
            height="48px"
            maxlength={50}
            name="oarId"
            placeholder={this.$t('os_id')}
            disabled={this.disabled}
            autoTrim
            changeValue={this.changeInput}
          />
          {this.messageErrors && (
            <MessageError field="oarId" messageErrors={this.messageErrors} />
          )}
        </Styled.Column>
        <Styled.Column>
          <Dropdown
            title={this.$t('type')}
            options={this.facilityTypeOptions}
            width="100%"
            height="48px"
            value={this.facilityTypeDefault}
            changeOptionValue={this.changeType}
            placeholder={this.$t('select_type')}
            disabled={this.disabled || this.disabledFacilityType}
            overflow
          />
        </Styled.Column>
      </fragment>
    );
  }

  render(): JSX.Element {
    return (
      <fragment>
        {this.renderBusinessInfo()}
        {this.renderOarIdFacilityType()}
      </fragment>
    );
  }
}
