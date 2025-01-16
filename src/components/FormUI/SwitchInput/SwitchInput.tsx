import { Vue, Component, Prop } from 'vue-property-decorator';
import * as Styled from './styled';

@Component
export default class SwitchInput extends Vue {
  @Prop({ default: false }) value: boolean;
  @Prop({
    default: () => {
      // TODO
    },
  })
  readonly change: (value: boolean) => void;

  private inputValue = false;

  get label(): string {
    return this.value ? this.$t('on') : this.$t('off');
  }

  created() {
    this.inputValue = this.value;
  }

  toggle(): void {
    this.inputValue = !this.inputValue;
    if (this.change) {
      this.change(this.inputValue);
    }
  }

  render(): JSX.Element {
    return (
      <Styled.Switch vOn:click={this.toggle}>
        <Styled.Label>{this.label}</Styled.Label>
        <Styled.InputContainer isActivated={this.inputValue} />
      </Styled.Switch>
    );
  }
}
