import { Vue, Component, Prop } from 'vue-property-decorator';
import Input from 'components/FormUI/Input';

@Component
export default class Invoice extends Vue {
  @Prop({ default: false }) readonly isSubmitting: boolean;
  @Prop() changeInput: () => void;

  render(): JSX.Element {
    return (
      <fragment>
        <Input
          label={this.$t('invoice_number')}
          name="invoiceNumber"
          maxLength={255}
          disabled={this.isSubmitting}
          height="48px"
          autoTrim
          changeValue={this.changeInput}
        />
        <Input
          label={this.$t('package_list_number')}
          name="packingListNumber"
          maxLength={255}
          disabled={this.isSubmitting}
          height="48px"
          autoTrim
          changeValue={this.changeInput}
        />
      </fragment>
    );
  }
}
