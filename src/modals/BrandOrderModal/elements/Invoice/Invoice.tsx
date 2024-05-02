import { Vue, Component, Prop } from 'vue-property-decorator';
import Input from 'components/FormUI/Input';
import * as Styled from '../../styled';

@Component
export default class Invoice extends Vue {
  @Prop({ default: false }) readonly isSubmitting: boolean;
  @Prop() changeInvoiceNumber: (value: string) => void;
  @Prop() changePackingListNumber: (value: string) => void;

  render(): JSX.Element {
    return (
      <Styled.Row>
        <Input
          label={this.$t('brandOrderModal.invoice_number')}
          name="invoiceNumber"
          maxLength={255}
          disabled={this.isSubmitting}
          height="48px"
          autoTrim
          changeValue={this.changeInvoiceNumber}
        />
        <Input
          label={this.$t('brandOrderModal.packing_list_number')}
          name="packingListNumber"
          maxLength={255}
          disabled={this.isSubmitting}
          height="48px"
          autoTrim
          changeValue={this.changePackingListNumber}
        />
      </Styled.Row>
    );
  }
}
