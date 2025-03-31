import { Vue, Component, Prop, PropSync } from 'vue-property-decorator';
import { find, findIndex, get, map, omit } from 'lodash';
import { Context, OptionWithContext, Attributes } from '@braid/vue-formulate';
import icons from 'assets/data/icons.json';
import InformationTooltip from 'components/FormUI/InformationTooltip';
import * as Styled from './styled';

@Component
export default class CheckboxGroup extends Vue {
  @PropSync('values') checkboxValues: string[];
  @Prop({ default: '' }) readonly name: string;
  @Prop({ default: null }) readonly options: App.CheckboxGroup[];
  @Prop({}) readonly changeValue: (values: string[]) => void;
  @Prop({ default: false }) readonly disabled: boolean;
  @Prop({ default: false }) readonly readOnly: boolean;
  @Prop({ default: '' }) readonly label: string;
  @Prop({ default: false }) readonly bordered: boolean;
  @Prop({}) changeIsOther: (isOther: boolean, otherCode?: string) => void;

  get hasModel(): boolean {
    return this.checkboxValues !== undefined;
  }

  get checkboxGroupProps(): App.CheckboxGroupProps {
    const props: App.CheckboxGroupProps = {};
    const hasOptionsDisabled = this.options.some(
      (option) => 'disabled' in option,
    );
    if (!hasOptionsDisabled) {
      props.disabled = this.disabled;
    }
    if (this.hasModel) {
      props.formulateValue = this.checkboxValues;
    } else {
      props.name = this.name;
    }
    return props;
  }

  get icon(): string {
    return get(icons, ['check'], '');
  }

  onChange(values: string[]): void {
    if (this.hasModel) {
      this.checkboxValues = values;
    }
    if (this.changeValue) {
      this.changeValue(values);
    }
    const options = map(values, (v) =>
      find(this.options, (o) => o.value === v),
    );
    const otherOption = find(options, (o) => o.isOther);
    const isOther = findIndex(options, (o) => o.isOther) > -1;
    if (isOther) {
      this.changeIsOther(true, otherOption.value);
    } else if (this.changeIsOther) {
      this.changeIsOther(false);
    }
  }

  getOptionsWithContext(parentContext: Context): OptionWithContext[] {
    const context = omit(parentContext, [
      'blurHandler',
      'classification',
      'component',
      'getValidationErrors',
      'hasLabel',
      'hasValidationErrors',
      'isSubField',
      'isValid',
      'labelPosition',
      'options',
      'performValidation',
      'setErrors',
      'slotComponents',
      'slotProps',
      'validationErrors',
      'visibleValidationErrors',
      'showValidationErrors',
      'rootEmit',
      'help',
      'pseudoProps',
      'rules',
      'model',
    ]);
    const {
      attributes: { id, ...groupApplicableAttributes },
    } = context;
    return parentContext.options.map((option: App.CheckboxGroup) =>
      this.groupItemContext(context, option, groupApplicableAttributes),
    );
  }

  groupItemContext(
    context: Context,
    option: App.CheckboxGroup,
    groupAttributes: Attributes,
  ): OptionWithContext {
    const optionAttributes = { isGrouped: true };
    return Object.assign(
      {},
      context,
      option,
      groupAttributes,
      optionAttributes,
      !context.hasGivenName
        ? {
            name: true,
          }
        : {},
    );
  }

  renderLabel(optionContext: OptionWithContext): JSX.Element {
    if (this.$scopedSlots.optionLabel) {
      return (
        <label
          class={get(optionContext, 'classes.label', '')}
          for={optionContext.id}
        >
          {this.$scopedSlots.optionLabel(optionContext.label)}{' '}
        </label>
      );
    }
    return (
      <fragment>
        <label
          class={get(optionContext, 'classes.label', '')}
          for={optionContext.id}
        >
          <Styled.CheckboxGroupLabel disabled={optionContext.disabled}>
            {optionContext.label}
          </Styled.CheckboxGroupLabel>
        </label>
        {this.renderDescription(optionContext)}
      </fragment>
    );
  }

  renderDescription(optionContext: OptionWithContext): JSX.Element {
    const description = get(optionContext, 'description');
    if (description) {
      return (
        <InformationTooltip placement="top-center" tooltipContent={description}>
          <font-icon
            name="circle_warning"
            color="spunPearl"
            size="14"
            slot="content"
          />
        </InformationTooltip>
      );
    }
    return null;
  }

  renderElement(
    optionsWithContext: OptionWithContext[],
    context: Context,
  ): JSX.Element {
    return (
      <div role="group" class={get(context, 'classes.element', '')}>
        {optionsWithContext.map((optionContext: OptionWithContext) => (
          <fragment>
            <formulate-input
              {...{ props: optionContext }}
              key={optionContext.id}
              v-model={context.model}
              disable-errors={true}
              prevent-deregister={true}
              class="formulate-input-group-item"
              disabled={optionContext.disabled}
              vOn:input={this.onChange}
              vOn:blur={context.blurHandler}
              scopedSlots={{
                label: () => this.renderLabel(optionContext),
              }}
            />
            {this.$scopedSlots.extraCheckbox
              ? this.$scopedSlots.extraCheckbox(optionContext)
              : null}
          </fragment>
        ))}
      </div>
    );
  }

  render(): JSX.Element {
    return (
      <Styled.CheckboxGroupWrapper
        readOnly={this.readOnly}
        bordered={this.bordered}
        icon={this.icon}
      >
        <formulate-input
          {...{ props: this.checkboxGroupProps }}
          options={this.options}
          label={this.label}
          type="checkbox"
          vOn:input={this.onChange}
          scopedSlots={{
            element: (context: Context) => {
              const optionsWithContext = this.getOptionsWithContext(context);
              return this.renderElement(optionsWithContext, context);
            },
          }}
        />
      </Styled.CheckboxGroupWrapper>
    );
  }
}
