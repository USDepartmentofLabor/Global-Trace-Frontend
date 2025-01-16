import { Vue, Component, Prop } from 'vue-property-decorator';
import { SelectPanelEnum } from 'enums/app';
import Checkbox from './Checkbox';
import * as Styled from './styled';
import Radio from '../FormUI/Radio/Radio';

@Component
export default class SelectPanel extends Vue {
  @Prop({ default: '' }) readonly label: string;
  @Prop({ default: null }) readonly defaultValues: string[] | string;
  @Prop({ required: true }) readonly name: string;
  @Prop({
    default: SelectPanelEnum.CHECKBOX,
    validator(this, value) {
      return [SelectPanelEnum.CHECKBOX, SelectPanelEnum.RADIO].includes(value);
    },
  })
  type: string;
  @Prop({ default: [] }) readonly options: App.SelectPanel[];
  @Prop({}) readonly changeValue: (values: string[] | string) => void;

  private values: string[] | string = null;

  created() {
    this.values = this.defaultValues;
  }

  changeCheckboxValue(index: number, value: boolean) {
    const id = this.options[index].id;
    if (value) {
      (this.values as string[]).push(id);
    } else {
      this.values = (this.values as string[]).filter(
        (valueId) => valueId !== id,
      );
    }
    this.changeValue(this.values);
  }

  changeRadioValue(value: string) {
    this.values = value;
    this.changeValue(value);
  }

  renderInput(option: App.SelectPanel, index: number): JSX.Element {
    if (this.type === SelectPanelEnum.CHECKBOX) {
      return (
        <Checkbox
          defaultValues={this.defaultValues}
          name={option.id}
          option={option}
          change={(value: boolean) => this.changeCheckboxValue(index, value)}
        />
      );
    }
    return (
      <Radio
        name={this.name}
        label={option.label}
        value={this.values}
        checkboxValue={option.id}
        changeValue={this.changeRadioValue}
      />
    );
  }

  renderOption(option: App.SelectPanel, index: number): JSX.Element {
    return (
      <fragment>
        {this.renderInput(option, index)}
        <img src={option.image} />
      </fragment>
    );
  }

  renderContent(): JSX.Element {
    return (
      <Styled.Content>
        {this.options.map((option, index: number) => (
          <Styled.Panel key={index}>
            {this.renderOption(option, index)}
          </Styled.Panel>
        ))}
      </Styled.Content>
    );
  }

  render(): JSX.Element {
    return (
      <Styled.Wrapper>
        <Styled.Label>{this.label}</Styled.Label>
        {this.renderContent()}
      </Styled.Wrapper>
    );
  }
}
