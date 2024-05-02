import { Vue, Component, Prop, PropSync } from 'vue-property-decorator';
import { get } from 'lodash';
import icons from 'assets/data/icons.json';
import { dashedAlphaNumber } from 'utils/helpers';
import { InputType } from 'enums/app';
import * as Styled from './styled';

@Component
export default class InputProductCode extends Vue {
  @PropSync('value') syncedValue!: string;
  @Prop() readonly label: string;
  @Prop({ required: true }) readonly name: string;
  @Prop({ default: InputType.TEXT }) readonly type: InputType;
  @Prop({ default: '100%' }) readonly width: string;
  @Prop({ default: '40px' }) readonly height: string;
  @Prop({ default: '' }) readonly prefixIcon: string;
  @Prop({ default: '' }) readonly suffixIcon: string;
  @Prop({ default: '16' }) readonly iconSize: string;
  @Prop({ default: 'spunPearl' }) readonly iconColor: string;
  @Prop({ default: '' }) readonly placeholder: string;
  @Prop({ default: false }) readonly disabled: boolean;
  @Prop({ default: false }) readonly required: boolean;
  @Prop({ default: false }) readonly keepDash: boolean;
  @Prop({ default: 11 }) readonly maxLength: number;
  @Prop({ default: '' }) readonly validation: string;
  @Prop({ default: () => ({}) }) readonly validationRules: {};
  @Prop({ default: () => ({}) }) readonly validationMessages: {};
  @Prop({
    default: 'blur',
    validator(this, value) {
      return ['blur', 'live', 'submit'].includes(value);
    },
  })
  readonly errorBehavior: string;
  @Prop({
    default: 'default',
    validator(this, value) {
      return ['default', 'material'].includes(value);
    },
  })
  readonly variant: string;
  @Prop({
    type: Function,
    default: () => {
      //
    },
  })
  readonly changeValue: (value: string) => void;
  @Prop({
    type: Function,
    default: () => {
      //
    },
  })
  readonly clickSuffixIcon: () => void;

  private productCode: string = '';

  mounted(): void {
    if (this.syncedValue) {
      this.productCode = this.format(this.syncedValue);
    }
  }

  get hasModel(): boolean {
    return this.syncedValue !== undefined;
  }

  get inputProps(): App.InputProps {
    return !this.hasModel
      ? { name: this.name }
      : { formulateValue: this.syncedValue };
  }

  get productCodeNumber(): string {
    return this.unFormat(this.productCode);
  }

  get attributes(): Record<string, string> {
    return this.$attrs;
  }

  get iconError(): string {
    return get(icons, ['warning']);
  }

  onChangeHandler(value: string) {
    const productCode = this.keepDash
      ? this.productCode
      : this.unFormat(this.productCode);
    this.changeValue && this.changeValue(productCode);
    if (this.hasModel) {
      this.syncedValue = value;
    }
  }

  onInputHandler(): void {
    this.process(this.productCode);
  }

  process(value: string): void {
    this.productCode = this.format(value);
    this.update(value);
  }

  update(value: string): void {
    this.onChangeHandler(value);
    this.$emit('input', value);
  }

  format(value: string): string {
    if (value) {
      return dashedAlphaNumber(value);
    }
  }

  unFormat(value: string): string {
    if (value) {
      return value.replaceAll('-', '');
    }
  }

  handleInput(event: KeyboardEvent): void {
    const rule = new RegExp('^[a-zA-Z0-9-]+$');
    if (!rule.test(event.key)) {
      event.preventDefault();
    }
  }

  renderLabel(): JSX.Element {
    if (this.label) {
      return (
        <Styled.LabelWrapper slot="label">
          <Styled.Label
            class="input-label"
            prefixIcon={this.prefixIcon}
            required={this.required}
          >
            {this.label}
          </Styled.Label>
          {this.$slots.labelSuffix}
        </Styled.LabelWrapper>
      );
    }
    return null;
  }

  renderSuffixIcon(): JSX.Element {
    return (
      <fragment slot="suffix">
        <Styled.SuffixIcon vOn:click={this.clickSuffixIcon}>
          <font-icon
            name={this.suffixIcon}
            size={this.iconSize}
            color={this.iconColor}
          />
        </Styled.SuffixIcon>
      </fragment>
    );
  }

  render(): JSX.Element {
    return (
      <Styled.Wrapper
        width={this.width}
        height={this.height}
        prefixIcon={this.prefixIcon}
        suffixIcon={this.suffixIcon}
        iconError={this.iconError}
        disabled={this.disabled}
        variant={this.variant}
      >
        <formulate-input
          {...{ attrs: this.attributes }}
          {...{ props: this.inputProps }}
          vModel={this.productCode}
          type={this.type}
          disabled={this.disabled}
          placeholder={this.placeholder}
          validation={this.validation}
          validationRules={this.validationRules}
          validationMessages={this.validationMessages}
          error-behavior={this.errorBehavior}
          autocomplete="off"
          maxLength={this.maxLength}
          vOn:input={this.onInputHandler}
          scopedSlots={{
            element: this.$scopedSlots.element,
            label: this.renderLabel,
          }}
          vOn:keydown={this.handleInput}
        >
          {this.suffixIcon && this.renderSuffixIcon()}
        </formulate-input>
      </Styled.Wrapper>
    );
  }
}
