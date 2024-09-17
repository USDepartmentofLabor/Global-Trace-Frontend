import { Vue, Component, Prop } from 'vue-property-decorator';
import { isEmpty, get } from 'lodash';
import { AddDNAOptionEnum } from 'enums/dna';
import Dropdown from 'components/FormUI/Dropdown';
import MessageError from 'components/FormUI/MessageError';
import InputProductCode from 'components/FormUI/Input/InputProductCode';
import InputGroup from 'components/FormUI/InputGroup';
import * as Styled from './styled';

@Component
export default class ProductHistory extends Vue {
  @Prop({ required: true }) isSubmitting: boolean;
  @Prop({ required: true }) type: AddDNAOptionEnum;
  @Prop({ required: true }) selectedRequestFacility: App.DropdownOption;
  @Prop({ required: true }) requestFacilityOptions: App.DropdownOption[];
  @Prop({ required: true }) selectedProductSupplier: App.DropdownOption;
  @Prop({ required: true }) productSupplierOptions: App.DropdownOption[];
  @Prop({ default: null }) readonly messageErrors: App.MessageError;
  @Prop({ required: true }) changeRequestFacility: (
    option: App.DropdownMenuOption,
  ) => void;
  @Prop({ required: true }) changeProductSupplier: (
    option: App.DropdownMenuOption,
  ) => void;
  @Prop({ required: true }) changeProductId: (value: string) => void;

  get formData(): DNAManagement.CreateDNATestParams {
    return this.$formulate.registry.get('DNATest').proxy;
  }

  get productId(): string {
    const { productId } = this.formData;
    return productId;
  }

  get hasProductIdError(): boolean {
    return !isEmpty(get(this.messageErrors, 'productId', null));
  }

  get suffixIcon(): string {
    if (this.productId) {
      return this.hasProductIdError ? 'circle_warning2' : 'check_circle';
    }
  }

  get iconColor(): string {
    return this.hasProductIdError ? 'red' : 'green';
  }

  renderRequestFacility(): JSX.Element {
    if (this.type === AddDNAOptionEnum.SYNTHETIC) {
      return (
        <Dropdown
          title={this.$t('createDNATestModal.requesting_facility')}
          height="48px"
          options={this.requestFacilityOptions}
          width="100%"
          value={this.selectedRequestFacility}
          changeOptionValue={this.changeRequestFacility}
          placeholder={this.$t('createDNATestModal.requesting_facility')}
          disabled={this.isSubmitting}
          overflow
          allowEmpty={false}
        />
      );
    }
  }

  renderProductSupplier(): JSX.Element {
    return (
      <Dropdown
        title={this.$t('product_supplier')}
        height="48px"
        options={this.productSupplierOptions}
        width="100%"
        value={this.selectedProductSupplier}
        changeOptionValue={this.changeProductSupplier}
        placeholder={this.$t('supplier')}
        disabled={this.isSubmitting}
        overflow
        allowEmpty={false}
      />
    );
  }

  renderProductId(): JSX.Element {
    return (
      <Styled.Row>
        <InputProductCode
          label={this.$t('product_id')}
          placeholder={this.$t('product_id')}
          name="productId"
          maxLength={19}
          validation="bail|required"
          suffixIcon={this.suffixIcon}
          iconColor={this.iconColor}
          validationMessages={{
            required: this.$t('validation.required', {
              field: this.$t('product_id'),
            }),
          }}
          vOn:input={this.changeProductId}
        />
        {this.messageErrors && (
          <MessageError field="productId" messageErrors={this.messageErrors} />
        )}
      </Styled.Row>
    );
  }

  render(): JSX.Element {
    return (
      <fragment>
        <Styled.Title>
          {this.$t('createDNATestModal.product_history')}
        </Styled.Title>
        <Styled.Container>
          <InputGroup>
            {this.renderRequestFacility()}
            {this.renderProductSupplier()}
            {this.renderProductId()}
          </InputGroup>
        </Styled.Container>
      </fragment>
    );
  }
}
