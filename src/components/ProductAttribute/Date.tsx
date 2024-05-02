import { Component, Prop, Vue } from 'vue-property-decorator';
import moment from 'moment';
import AppModule from 'store/modules/app';
import { DATE_TIME_FORMAT } from 'config/constants';
import { getAttributeProperties } from 'utils/product-attributes';
import DatePicker from 'components/FormUI/DatePicker';
import * as Styled from './styled';

@Component
export default class AttributeDate extends Vue {
  @Prop({ required: true }) isSubmitting: boolean;
  @Prop({ required: true })
  productAttribute: ProductAttribute.ProductDefinitionAttribute;
  @Prop() change: (params: ProductAttribute.AttributeParams) => void;

  private transactedAt: Date = null;

  get attributeProperties(): ProductAttribute.Entity {
    return getAttributeProperties(this.productAttribute);
  }

  get currentLocale(): string {
    return AppModule.locale;
  }

  onChangeDateTime(transactedAt: string): void {
    this.transactedAt = moment(transactedAt).toDate();
    this.change({
      isOptional: this.attributeProperties.isOptional,
      category: this.attributeProperties.category,
      type: this.attributeProperties.type,
      id: this.attributeProperties.id,
      value: this.transactedAt,
    });
  }

  disabledDatetime(date: Date): boolean {
    const validDate = moment().toDate();
    return date > validDate;
  }

  render(): JSX.Element {
    return (
      <Styled.Attribute>
        <DatePicker
          label={this.attributeProperties.label}
          height="48px"
          type="datetime"
          variant="material"
          placeholder={this.attributeProperties.label}
          value={this.transactedAt}
          disabledDate={this.disabledDatetime}
          disabledTime={this.disabledDatetime}
          selectDate={this.onChangeDateTime}
          disabled={this.isSubmitting}
          format={DATE_TIME_FORMAT}
        />
      </Styled.Attribute>
    );
  }
}
