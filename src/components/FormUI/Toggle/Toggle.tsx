import { Vue, Component, Prop, PropSync } from 'vue-property-decorator';
import * as Styled from './styled';

@Component
export default class Toggle extends Vue {
  @PropSync('value', { type: Boolean }) syncedSwitched!: boolean;
  @Prop({ default: '' }) readonly label: string;
  @Prop({ default: '' }) readonly name: string;
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
        disabled={this.disabled}
      >
        <formulate-input
          vModel={this.syncedSwitched}
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
