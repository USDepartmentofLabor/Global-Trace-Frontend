import { Vue, Component, Prop, PropSync } from 'vue-property-decorator';
import * as Styled from './styled';

@Component
export default class RadioGroup extends Vue {
  @Prop({ default: null }) readonly options: App.CheckboxGroup[];
  @Prop({ default: '' }) readonly name: string;
  @Prop({}) readonly changeValue: (value: string) => void;
  @PropSync('value') radioValue: string;
  @Prop({ default: false }) readonly readOnly: boolean;
  @Prop({
    default: 'vertical',
    validator: (value) => ['vertical', 'horizontal'].indexOf(value) !== -1,
  })
  readonly direction: string;

  onChange(value: string): void {
    if (this.changeValue) {
      this.changeValue(value);
    }
  }

  render(): JSX.Element {
    return (
      <Styled.RadioGroup direction={this.direction} readOnly={this.readOnly}>
        <formulate-input
          name={this.name}
          vModel={this.radioValue}
          options={this.options}
          type="radio"
          vOn:input={this.onChange}
        />
      </Styled.RadioGroup>
    );
  }
}
