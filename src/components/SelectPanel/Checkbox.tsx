import { Vue, Component, Prop } from 'vue-property-decorator';
import Checkbox from '../FormUI/Checkbox';

@Component
export default class CheckboxPanel extends Vue {
  @Prop({ default: [] }) readonly defaultValues: string[];
  @Prop({ required: true }) readonly option: App.SelectPanel;
  @Prop({ required: true }) readonly name: string;
  @Prop({}) readonly change: (values: boolean) => void;

  private value = false;

  created() {
    this.value = this.defaultValues.includes(this.option.id);
  }

  changeCheckbox(value: boolean): void {
    this.value = value;
    this.change(value);
  }

  render(): JSX.Element {
    return (
      <Checkbox
        name={this.name}
        label={this.option.label}
        value={this.value}
        valueChange={this.changeCheckbox}
      />
    );
  }
}
