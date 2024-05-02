import { Vue, Component, Prop } from 'vue-property-decorator';
import Dropdown from 'components/FormUI/Dropdown';
import InputProductCode from 'components/FormUI/Input/InputProductCode';
import * as Styled from './styled';

@Component
export default class ProductHistory extends Vue {
  @Prop({ required: true }) isSubmitting: boolean;
  @Prop({ required: true }) selectedRequestFacility: App.DropdownOption;
  @Prop({ required: true }) requestFacilityOptions: App.DropdownOption[];
  @Prop({ required: true }) selectedProductSupplier: App.DropdownOption;
  @Prop({ required: true }) productSupplierOptions: App.DropdownOption[];
  @Prop({ required: true }) changeRequestFacility: (
    option: App.DropdownMenuOption,
  ) => void;
  @Prop({ required: true }) changeProductSupplier: (
    option: App.DropdownMenuOption,
  ) => void;
  @Prop({ required: true }) changeProductId: (value: string) => void;

  renderRequestFacility(): JSX.Element {
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
      <InputProductCode
        label={this.$t('product_id')}
        placeholder={this.$t('product_id')}
        name="productId"
        maxLength={19}
        validation="bail|required"
        validationMessages={{
          required: this.$t('validation.required', {
            field: this.$t('product_id'),
          }),
        }}
        vOn:input={this.changeProductId}
      />
    );
  }

  render(): JSX.Element {
    return (
      <fragment>
        <Styled.Title>
          {this.$t('createDNATestModal.product_history')}
        </Styled.Title>
        <Styled.Container>
          {this.renderRequestFacility()}
          {this.renderProductSupplier()}
          {this.renderProductId()}
        </Styled.Container>
      </fragment>
    );
  }
}
