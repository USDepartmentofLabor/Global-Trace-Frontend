import { Vue, Component, Prop } from 'vue-property-decorator';
import { DATE_FORMAT } from 'config/constants';
import Input from 'components/FormUI/Input';
import DatePicker from 'components/FormUI/DatePicker';
import InformationTooltip from 'components/FormUI/InformationTooltip';

@Component
export default class Purchase extends Vue {
  @Prop({ default: false }) readonly isSubmitting: boolean;
  @Prop({ default: false }) purchasedAt: Date;
  @Prop({ required: true }) changeDateTime: (date: string) => void;
  @Prop({ required: true }) changeInput: () => void;

  disabledDate(date: Date): boolean {
    return date > new Date();
  }

  renderPurchaseOrderNumber(): JSX.Element {
    return (
      <Input
        label={this.$t('purchase_order_number')}
        name="purchaseOrderNumber"
        maxLength={255}
        disabled={this.isSubmitting}
        height="48px"
        autoTrim
        changeValue={this.changeInput}
      />
    );
  }

  renderPurchaseDate(): JSX.Element {
    return (
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
      >
        <InformationTooltip
          slot="labelSuffix"
          placement="top-center"
          tooltipContent={this.$t('datetime_tooltip')}
        >
          <font-icon
            name="circle_warning"
            color="spunPearl"
            size="14"
            slot="content"
          />
        </InformationTooltip>
      </DatePicker>
    );
  }

  render(): JSX.Element {
    return (
      <fragment>
        {this.renderPurchaseOrderNumber()}
        {this.renderPurchaseDate()}
      </fragment>
    );
  }
}
