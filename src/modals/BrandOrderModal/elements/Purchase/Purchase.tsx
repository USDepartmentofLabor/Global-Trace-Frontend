import { Vue, Component, Prop } from 'vue-property-decorator';
import moment from 'moment';
import { DATE_FORMAT } from 'config/constants';
import Input from 'components/FormUI/Input';
import DatePicker from 'components/FormUI/DatePicker';
import * as Styled from '../../styled';

@Component
export default class Purchase extends Vue {
  @Prop({ default: false }) readonly isSubmitting: boolean;
  @Prop({ default: false }) purchasedAt: Date;
  @Prop({ required: true }) changeDateTime: (date: string) => void;
  @Prop({ required: true }) clearMessageErrors: () => void;

  disabledDate(date: Date): boolean {
    const validDate = moment().toDate();
    return date > validDate;
  }

  render(): JSX.Element {
    return (
      <Styled.Row>
        <Input
          label={this.$t('purchase_order_number')}
          name="purchaseOrderNumber"
          maxLength={255}
          disabled={this.isSubmitting}
          height="48px"
          autoTrim
          changeValue={this.clearMessageErrors}
          validation="bail|required"
          validationMessages={{
            required: this.$t('validation.required', {
              field: this.$t('purchase_order_number').toLowerCase(),
            }),
          }}
        />
        <DatePicker
          label={this.$t('purchase_date')}
          placeholder={this.$t('brandOrderModal.purchase_date_placeholder')}
          name="purchasedAt"
          height="48px"
          type="date"
          value={this.purchasedAt}
          selectDate={this.changeDateTime}
          disabled={this.isSubmitting}
          disabledDate={this.disabledDate}
          format={DATE_FORMAT}
        />
      </Styled.Row>
    );
  }
}
