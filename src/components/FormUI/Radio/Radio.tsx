import { Vue, Component, Prop, PropSync } from 'vue-property-decorator';
import * as Styled from './styled';

@Component
export default class Radio extends Vue {
  @PropSync('value') syncedValue: string | number;
  @Prop({ default: '' }) name: string;
  @Prop({ default: '' }) readonly label: string;
  @Prop({ default: '' }) checkboxValue: string | number;
  @Prop({ default: false }) disabled: boolean;
  @Prop({ default: false }) readonly readOnly: boolean;
  @Prop({
    default: 'primary',
    validator(this, value) {
      return ['primary', 'warning'].includes(value);
    },
  })
  readonly variant: string;
  @Prop({}) readonly changeValue: (value: string) => void;

  get hasModel(): boolean {
    return this.syncedValue !== undefined;
  }

  get radioProps(): App.InputProps {
    if (!this.hasModel) {
      return {
        name: this.name,
      };
    }
    return {
      formulateValue: this.syncedValue,
    };
  }

  onChange(value: string): void {
    if (this.hasModel) {
      this.syncedValue = value;
    }
    this.changeValue && this.changeValue(value);
  }

  render(): JSX.Element {
    return (
      <Styled.Radio
        disabled={this.disabled}
        variant={this.variant}
        readOnly={this.readOnly}
      >
        <formulate-input
          {...{ props: this.radioProps }}
          type="radio"
          label={this.label}
          value={this.checkboxValue}
          vOn:input={this.onChange}
          disabled={this.disabled}
        />
      </Styled.Radio>
    );
  }
}
