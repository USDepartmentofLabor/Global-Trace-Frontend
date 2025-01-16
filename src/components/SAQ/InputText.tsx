import { Vue, Component, Prop } from 'vue-property-decorator';
import Input from 'components/FormUI/Input';
import { InputType } from 'enums/app';

@Component
export default class InputText extends Vue {
  @Prop({ default: false }) readonly isView: boolean;
  @Prop({ default: '' }) value: string;
  @Prop({ required: true }) name: string;
  @Prop({ required: true }) type: string;
  @Prop({ required: true }) placeholder: string;
  @Prop({
    default: () => {
      //
    },
  })
  changeValue: (type: string) => void;

  private inputValue: string = '';

  created(): void {
    this.inputValue = this.value;
  }

  changeInputValue(value: string): void {
    this.inputValue = value;
    this.changeValue(value);
  }

  keyDownInput(event: KeyboardEvent): void {
    if (this.type === InputType.NUMBER) {
      this.handleInputNumber(event);
    }
  }

  handleInputNumber(event: KeyboardEvent): void {
    const rule = new RegExp('^[0-9]|[Backspace|Delete|Tab]+$');
    if (!rule.test(event.key)) {
      event.preventDefault();
    }
  }

  render(): JSX.Element {
    return (
      <Input
        width="312px"
        value={this.inputValue}
        name={this.name}
        type={this.type}
        placeholder={this.placeholder}
        changeValue={this.changeInputValue}
        disabled={this.isView}
        keyDownInput={this.type === InputType.NUMBER && this.keyDownInput}
      />
    );
  }
}
