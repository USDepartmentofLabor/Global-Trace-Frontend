import { Vue, Component, Prop } from 'vue-property-decorator';
import MultipleTagSelect from 'components/FormUI/MultipleTagSelect';
import Input from 'components/FormUI/Input';
import { SpinLoading } from 'components/Loaders';
import MessageError from 'components/FormUI/MessageError';
import InputGroup from 'components/FormUI/InputGroup';
import BusinessInfo from './BusinessInfo';
import * as Styled from './styled';

@Component
export default class ModalContent extends Vue {
  @Prop({ default: null }) readonly supplier: Auth.Facility;
  @Prop({ default: false }) readonly isEdit: boolean;
  @Prop({ default: null }) readonly messageErrors: App.MessageError;
  @Prop({ default: false }) readonly disabled: boolean;
  @Prop({ default: false }) readonly disabledFacilityType: boolean;
  @Prop({ default: null }) readonly facilityTypeDefault: App.DropdownOption;
  @Prop({ default: [] }) readonly facilityTypeOptions: App.DropdownOption[];
  @Prop({ default: [] }) readonly partnerOptions: App.DropdownOption[];
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
  changeBusinessPartners: (option: App.DropdownOption[]) => void;
  @Prop({
    type: Function,
    default: () => {
      //
    },
  })
  changeName: (value: string) => void;

  private isLoading: boolean = false;
  private selectedPartners: App.DropdownOption[] = [];

  created(): void {
    if (this.isEdit) {
      this.setPartnerSelected();
    }
  }

  setPartnerSelected(): void {
    this.supplier.facilityPartners.forEach(({ partnerId }) => {
      const partner = this.partnerOptions.find(({ id }) => id === partnerId);
      if (partner) {
        this.selectedPartners.push(partner);
      }
    });
  }

  onSetFacility(facility: Auth.Facility = null): void {
    this.setFacility(facility);
    this.selectedPartners = [];
  }

  handleChangeType(option: App.DropdownOption): void {
    this.changeType(option);
    this.selectedPartners = [];
  }

  changeTag(option: App.DropdownOption[]): void {
    this.selectedPartners = option;
    this.changeBusinessPartners(this.selectedPartners);
  }

  removeTag(option: App.DropdownOption): void {
    this.selectedPartners = this.selectedPartners.filter(
      (partner) => partner.id !== option.id,
    );
    this.changeBusinessPartners(this.selectedPartners);
  }

  renderFirstName(): JSX.Element {
    return (
      <Styled.Column>
        <Input
          label={this.$t('first_name')}
          name="firstName"
          height="48px"
          maxlength={255}
          placeholder={this.$t('first_name')}
          validation="bail|required|nameValidator"
          changeValue={this.changeInput}
          autoTrim
          validationMessages={{
            required: this.$t('validation.required', {
              field: this.$t('first_name').toLowerCase(),
            }),
          }}
          disabled={this.disabled || this.isEdit}
        />
        {this.messageErrors && (
          <MessageError field="firstName" messageErrors={this.messageErrors} />
        )}
      </Styled.Column>
    );
  }

  renderLastName(): JSX.Element {
    return (
      <Styled.Column>
        <Input
          label={this.$t('last_name')}
          name="lastName"
          height="48px"
          maxlength={255}
          placeholder={this.$t('last_name')}
          validation="bail|required|nameValidator"
          changeValue={this.changeInput}
          autoTrim
          validationMessages={{
            required: this.$t('validation.required', {
              field: this.$t('last_name').toLowerCase(),
            }),
          }}
          disabled={this.disabled || this.isEdit}
        />
        {this.messageErrors && (
          <MessageError field="lastName" messageErrors={this.messageErrors} />
        )}
      </Styled.Column>
    );
  }

  renderFullName(): JSX.Element {
    return (
      <fragment>
        {this.renderFirstName()}
        {this.renderLastName()}
      </fragment>
    );
  }

  renderEmail(): JSX.Element {
    return (
      <fragment>
        <Styled.Column>
          <Input
            label={this.$t('email')}
            name="email"
            height="48px"
            placeholder="Name@email.com"
            validation="bail|required|emailValid"
            changeValue={this.changeInput}
            autoTrim
            validationMessages={{
              required: this.$t('validation.required', {
                field: this.$t('email').toLowerCase(),
              }),
              emailValid: this.$t('validation.email'),
            }}
            disabled={this.disabled || this.isEdit}
          />
          {this.messageErrors && (
            <MessageError field="email" messageErrors={this.messageErrors} />
          )}
        </Styled.Column>
      </fragment>
    );
  }

  renderOption(option: App.DropdownOption): JSX.Element {
    return (
      <Styled.Option>
        <Styled.OptionLabel>{option.name}</Styled.OptionLabel>
      </Styled.Option>
    );
  }

  renderBusinessPartners(): JSX.Element {
    return (
      <MultipleTagSelect
        title={this.$t('supplier_immediate_business_partners')}
        placeholder={this.$t(
          'please_select_business_partners_that_supplier_work_with_directly',
        )}
        height="48px"
        width="100%"
        options={this.partnerOptions}
        changeOptionValue={this.changeTag}
        removeOptionValue={this.removeTag}
        value={this.selectedPartners}
        overflow
        scopedSlots={{
          tagName: ({ option }: { option: App.DropdownOption }) => option.name,
          optionBody: ({ option }: { option: App.DropdownOption }) =>
            this.renderOption(option),
        }}
      />
    );
  }

  render(): JSX.Element {
    return (
      <Styled.Wrapper>
        <perfect-scrollbar>
          {this.isLoading && <SpinLoading isInline={false} />}
          <InputGroup>
            <InputGroup column={2}>
              <BusinessInfo
                isEdit={this.isEdit}
                messageErrors={this.messageErrors}
                disabled={this.disabled || this.isEdit}
                disabledFacilityType={this.disabledFacilityType}
                facilityTypeDefault={this.facilityTypeDefault}
                facilityTypeOptions={this.facilityTypeOptions}
                setFacility={this.onSetFacility}
                changeInput={this.changeInput}
                changeType={this.handleChangeType}
                changeName={this.changeName}
              />
              {this.renderFullName()}
            </InputGroup>
            <InputGroup>
              {this.renderEmail()}
              {this.renderBusinessPartners()}
            </InputGroup>
          </InputGroup>
        </perfect-scrollbar>
      </Styled.Wrapper>
    );
  }
}
