import { Vue, Component, Prop, PropSync } from 'vue-property-decorator';
import icons from 'assets/data/icons.json';
import * as Styled from './styled';

@Component
export default class Checkbox extends Vue {
  @PropSync('value', { type: Boolean }) syncedChecked!: boolean;
  @Prop({ default: '' }) readonly name: string;
  @Prop({ default: '' }) readonly label: string;
  @Prop({
    default: 'after',
    validator(this, value) {
      return ['before', 'after'].includes(value);
    },
  })
  readonly labelPosition: string;
  @Prop({ default: false }) readonly disabled: boolean;
  @Prop({
    type: Function,
    default: () => {
      //
    },
  })
  valueChange: (value: boolean) => void;

  render(): JSX.Element {
    return (
      <Styled.Wrapper
        label={this.label}
        labelPosition={this.labelPosition}
        icon={icons.check}
        disabled={this.disabled}
      >
        <formulate-input
          vModel={this.syncedChecked}
          name={this.name}
          type="checkbox"
          label={this.label}
          labelPosition={this.labelPosition}
          disabled={this.disabled}
          vOn:input={this.valueChange}
        />
      </Styled.Wrapper>
    );
  }
}
