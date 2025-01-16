import { Vue, Component, Prop } from 'vue-property-decorator';
import { PartnerTypeEnum } from 'enums/onboard';
import Input from 'components/FormUI/Input';
import MessageError from 'components/FormUI/MessageError';
import Dropdown from 'components/FormUI/Dropdown';
import * as Styled from '../styled';

@Component
export default class BusinessInfo extends Vue {
  @Prop({ required: true }) type: PartnerTypeEnum;
  @Prop({ default: null }) facility: Auth.Facility;
  @Prop({ default: null }) readonly messageErrors: App.MessageError;
  @Prop({ default: false }) readonly disabled: boolean;
  @Prop({ default: [] }) readonly facilityTypeOptions: App.DropdownOption;
  @Prop({ default: null }) readonly selectedFacilityType: App.DropdownOption;
  @Prop() changeFacilityType: (value: App.DropdownOption) => void;
  @Prop({
    default: () => {
      //
    },
  })
  changeInput: () => void;

  get showOarId(): boolean {
    return this.facility && this.type === PartnerTypeEnum.PROCESSING_FACILITY;
  }

  get showFacilityType(): boolean {
    return (
      this.type === PartnerTypeEnum.TRANSFORMATION_PARTNER ||
      this.type === PartnerTypeEnum.PROCESSING_FACILITY
    );
  }

  get showBusinessNumber(): boolean {
    return this.showOarId || this.type === PartnerTypeEnum.BROKER;
  }

  get optionalBusinessCode(): boolean {
    return (
      this.type === PartnerTypeEnum.BROKER ||
      this.type === PartnerTypeEnum.TRANSPORTER
    );
  }

  get businessCodeLabel(): string {
    if (this.optionalBusinessCode) {
      return this.$t('item_optional', {
        item: this.$t('business_code'),
      });
    }
    return this.$t('business_code');
  }

  renderFacilityType(): JSX.Element {
    if (this.showFacilityType) {
      return (
        <Styled.Column>
          <Dropdown
            title={this.$t('type')}
            height="48px"
            options={this.facilityTypeOptions}
            width="100%"
            value={this.selectedFacilityType}
            changeOptionValue={this.changeFacilityType}
            placeholder={this.$t('type')}
            disabled={this.disabled}
            allowEmpty={false}
            overflow
          />
        </Styled.Column>
      );
    }
    return null;
  }

  renderBusinessName(): JSX.Element {
    return (
      <Styled.Column>
        <Input
          height="48px"
          maxlength={255}
          label={this.$t('business_name')}
          name="businessName"
          placeholder={this.$t('business_name')}
          validation="bail|required"
          disabled={this.disabled}
          autoTrim
          changeValue={this.changeInput}
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
      </Styled.Column>
    );
  }

  renderOarId(): JSX.Element {
    if (this.showOarId) {
      return (
        <Styled.Column>
          <Input
            height="48px"
            label={this.$t('os_id')}
            name="oarId"
            placeholder={this.$t('os_id')}
            disabled={this.disabled}
          />
        </Styled.Column>
      );
    }
    return null;
  }

  renderBusinessNumber(): JSX.Element {
    if (this.showBusinessNumber) {
      return (
        <Styled.Column>
          <Input
            height="48px"
            maxlength={255}
            name="businessRegisterNumber"
            label={this.businessCodeLabel}
            placeholder={this.businessCodeLabel}
            validation={this.optionalBusinessCode ? '' : 'bail|required'}
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
    return null;
  }

  render(): JSX.Element {
    return (
      <fragment>
        {this.renderBusinessName()}
        {this.renderOarId()}
        {this.renderBusinessNumber()}
        {this.renderFacilityType()}
      </fragment>
    );
  }
}
