import { Vue, Component, Prop } from 'vue-property-decorator';
import * as Styled from './styled';

@Component
export default class YesNo extends Vue {
  @Prop({}) readonly changeValue: (value: string) => void;
  @Prop({ default: '' }) readonly value: string;
  @Prop({ required: true }) readonly options: App.CheckboxGroup[];

  @Prop({ default: false }) readonly readOnly: boolean;

  private radioValue: string = null;

  created(): void {
    if (this.value) {
      this.radioValue = this.value;
    }
  }

  onChange(value: string): void {
    if (this.changeValue) {
      this.changeValue(value);
    }
  }

  render(): JSX.Element {
    return (
      <Styled.YesNo readOnly={this.readOnly}>
        <formulate-input
          vModel={this.radioValue}
          options={this.options}
          type="radio"
          vOn:input={this.onChange}
        />
      </Styled.YesNo>
    );
  }
}
