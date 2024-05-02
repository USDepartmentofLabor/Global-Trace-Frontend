import { Vue, Component, Prop, PropSync } from 'vue-property-decorator';
import { isNull } from 'lodash';
import VueDatePicker from 'vue2-datepicker';
import { DATE_FORMAT } from 'config/constants';
import * as Styled from './styled';

@Component
export default class DatePicker extends Vue {
  @PropSync('value') syncedValue!: Date | Date[];
  @Prop({ default: false }) disabled: boolean;
  @Prop({ default: false }) readOnly: boolean;
  @Prop({ default: false }) range: boolean;
  @Prop({ default: false }) inline: boolean;
  @Prop({}) disabledDate: (date: Date) => boolean;
  @Prop({}) disabledTime: (date: Date) => boolean;
  @Prop({ default: 'date' }) readonly type: string;
  @Prop({ default: '100%' }) readonly width: string;
  @Prop({ default: 'auto' }) readonly height: string;
  @Prop({ default: DATE_FORMAT }) format: string;
  @Prop({ default: true }) appendToBody: boolean;
  @Prop({ default: '' }) readonly label: string;
  @Prop({ default: '' }) readonly placeholder: string;
  @Prop({
    default: 'default',
    validator(this, value) {
      return ['default', 'material'].includes(value);
    },
  })
  readonly variant: string;
  @Prop({
    default: () => {
      //
    },
  })
  selectDate: (date: Date) => void;

  get hasValue(): boolean {
    return !isNull(this.syncedValue);
  }

  onSelectedDate(value: Date): void {
    if (this.selectDate) {
      this.selectDate(value);
    }
  }

  renderLabel(): JSX.Element {
    if (this.label) {
      return (
        <Styled.LabelWrapper>
          <Styled.Label class="date-picker-label">{this.label}</Styled.Label>
          {this.$slots.labelSuffix}
        </Styled.LabelWrapper>
      );
    }
  }

  render(): JSX.Element {
    return (
      <Styled.Wrapper
        width={this.width}
        height={this.height}
        variant={this.variant}
        hasValue={this.hasValue}
        readOnly={this.readOnly}
      >
        {this.renderLabel()}
        <VueDatePicker
          v-model={this.syncedValue}
          type={this.type}
          range={this.range}
          inline={this.inline}
          format={this.format}
          vOn:input={this.onSelectedDate}
          placeholder={this.placeholder}
          disabled={this.disabled}
          editable={!this.readOnly}
          clearable={!this.readOnly}
          popup-style={this.readOnly ? { visibility: 'hidden' } : {}}
          disabled-date={this.disabledDate}
          disabled-time={this.disabledTime}
          append-to-body={this.appendToBody}
          shortcuts={[{ text: this.$t('today'), onClick: () => new Date() }]}
        />
      </Styled.Wrapper>
    );
  }
}
