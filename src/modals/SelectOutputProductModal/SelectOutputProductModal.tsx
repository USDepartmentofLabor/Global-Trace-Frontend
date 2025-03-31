import { Vue, Component, Prop } from 'vue-property-decorator';
import SelectOutputProduct from 'components/SelectOutputProduct';
import { getSoldProductDefinitions } from 'api/assign-product';

@Component
export default class SelectOutputProductModal extends Vue {
  @Prop({
    default: () => {
      //
    },
  })
  onSuccess: (product: ProductManagement.Product) => Promise<void>;

  closeModal(): void {
    this.$emit('close');
  }

  handleSelect(product: ProductManagement.Product) {
    this.onSuccess(product);
    this.closeModal();
  }

  render(): JSX.Element {
    return (
      <modal-layout
        closeModal={this.closeModal}
        title={this.$t('select_output_product')}
      >
        <SelectOutputProduct
          request={getSoldProductDefinitions}
          select={this.handleSelect}
        />
      </modal-layout>
    );
  }
}
