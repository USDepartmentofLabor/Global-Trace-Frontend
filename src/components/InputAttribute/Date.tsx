import { Component, Prop, Vue } from 'vue-property-decorator';
import moment from 'moment';
import { isNumber } from 'lodash';
import AppModule from 'store/modules/app';
import { DATE_TIME_FORMAT } from 'config/constants';
import { getAttributeProperties } from 'utils/product-attributes';
import DatePicker from 'components/FormUI/DatePicker';
import { convertTimestampToDate } from 'utils/date';
import * as Styled from './styled';

@Component
export default class AttributeDate extends Vue {
  @Prop({ required: true }) isSubmitting: boolean;
  @Prop({ required: true })
  productAttribute: ProductAttribute.ProductDefinitionAttribute;
  @Prop() change: (params: ProductAttribute.AttributeParams) => void;

  private value: Date = null;

  get attributeProperties(): ProductAttribute.Entity {
    return getAttributeProperties(this.productAttribute);
  }

  get currentLocale(): string {
    return AppModule.locale;
  }

  created() {
    if (isNumber(this.productAttribute.value)) {
      this.value = convertTimestampToDate(this.productAttribute.value);
    }
  }

  onChangeDateTime(value: string): void {
    this.value = value ? moment(value).toDate() : null;
    this.change({
      isOptional: this.attributeProperties.isOptional,
      category: this.attributeProperties.category,
      type: this.attributeProperties.type,
      id: this.attributeProperties.id,
      value: moment(value).unix(),
    });
  }

  render(): JSX.Element {
    return (
      <Styled.Attribute>
        <DatePicker
          label={this.attributeProperties.label}
          height="48px"
          type="datetime"
          placeholder={this.attributeProperties.label}
          value={this.value}
          selectDate={this.onChangeDateTime}
          disabled={this.isSubmitting}
          format={DATE_TIME_FORMAT}
        />
      </Styled.Attribute>
    );
  }
}
