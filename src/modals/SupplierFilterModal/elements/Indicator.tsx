import { Vue, Component, Prop } from 'vue-property-decorator';
import { some, isEmpty, map, filter, flatMap } from 'lodash';
import AppModule from 'store/modules/app';
import CheckboxGroup from 'components/FormUI/Checkbox/CheckboxGroup';
import Checkbox from 'components/FormUI/Checkbox';
import * as Styled from './styled';

@Component
export default class Indicator extends Vue {
  @Prop({ default: '' }) search: string;
  @Prop({ required: true }) indicator: Auth.Category;
  @Prop({ default: [] }) defaultValues: string[];
  @Prop({ default: [] }) subIndicators: Auth.Category[];

  @Prop({
    default: () => {
      //
    },
  })
  setLogError: (name: string, hasError: boolean) => void;
  @Prop({
    default: () => {
      //
    },
  })
  change: (parentValue: boolean, values: string[]) => void;

  private values: string[] = [];
  private parentValue: boolean = false;
  private isOpen = false;

  get show(): boolean {
    const hasIndicator =
      this.indicatorName.toLowerCase().indexOf(this.search.toLowerCase()) > -1;
    const hasSubIndicator = !isEmpty(this.options);

    return hasIndicator || hasSubIndicator;
  }

  get options(): App.DropdownOption[] {
    return this.subIndicators
      .filter(
        ({ name }) =>
          name.toLowerCase().indexOf(this.search.toLowerCase()) > -1,
      )
      .map(({ id, name, translation }) => ({
        value: id,
        label: translation[this.currentLocale] || name,
      }));
  }

  get subPermissionIds(): string[] {
    return map(this.options, 'value');
  }

  get currentLocale(): string {
    return AppModule.locale;
  }

  get indicatorName(): string {
    return (
      this.indicator.translation[this.currentLocale] || this.indicator.name
    );
  }

  created(): void {
    this.handleSetValues();
  }

  handleSetValues(): void {
    this.changeParentValue(this.defaultValues.includes(this.indicator.id));
    this.initCheckboxGroup();
  }

  initCheckboxGroup(): void {
    const values = filter(this.defaultValues, (id: string) =>
      some(this.options, (option: App.DropdownOption) => option.value === id),
    );
    this.setValues(values);
    this.onChangeCheckboxGroup();
  }

  setValues(values: string[]) {
    this.values = values;
  }

  changeCheckboxGroup(values: string[]) {
    this.setValues(values);
    if (!isEmpty(values)) {
      this.parentValue = true;
    }
    this.onChangeCheckboxGroup();
  }

  changeParentValue(value: boolean) {
    if (!value) {
      this.setValues([]);
    } else {
      this.setValues(flatMap(this.subIndicators, 'id'));
    }
    this.parentValue = value;
    this.onChangeParent();
  }

  onChangeCheckboxGroup() {
    if (this.parentValue) {
      this.change(this.parentValue, this.values);
    } else {
      this.change(this.parentValue, []);
    }
  }

  onChangeParent() {
    this.onChangeCheckboxGroup();
  }

  onToggle() {
    this.isOpen = !this.isOpen;
  }

  renderCheckboxGroup(): JSX.Element {
    return (
      <CheckboxGroup
        name={this.indicator.id}
        values={this.values}
        options={this.options}
        changeValue={this.changeCheckboxGroup}
      />
    );
  }

  render(): JSX.Element {
    if (this.show) {
      return (
        <Styled.CheckboxGroup>
          <Styled.CheckboxWrapper vOn:click={this.onToggle}>
            <Checkbox
              value={this.parentValue}
              label={this.indicatorName}
              name={this.indicator.name}
              valueChange={this.changeParentValue}
            />
            {!isEmpty(this.options) && (
              <Styled.ExpandIcon isOpen={this.isOpen}>
                <font-icon name="expand_more" size="20" color="abbey" />
              </Styled.ExpandIcon>
            )}
          </Styled.CheckboxWrapper>
          {this.isOpen && (
            <Styled.CheckboxGroupWrapper>
              {this.renderCheckboxGroup()}
            </Styled.CheckboxGroupWrapper>
          )}
        </Styled.CheckboxGroup>
      );
    }
  }
}
