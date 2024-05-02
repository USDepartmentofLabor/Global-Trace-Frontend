import { Vue, Component, Prop, PropSync } from 'vue-property-decorator';
import { Context } from '@braid/vue-formulate';
import { get, last } from 'lodash';
import icons from 'assets/data/icons.json';
import { InputType } from 'enums/app';
import * as Styled from './styled';

@Component
export default class Input extends Vue {
  @PropSync('value') syncedValue!: string | number;
  @Prop({ default: InputType.TEXT }) readonly type: string;
  @Prop() readonly label: string;
  @Prop({ required: true }) readonly name: string;
  @Prop({ default: false }) readonly autoTrim: boolean;
  @Prop({ default: '100%' }) readonly width: string;
  @Prop({ default: '40px' }) readonly height: string;
  @Prop({ default: '' }) readonly prefixIcon: string;
  @Prop({ default: '' }) readonly suffixIcon: string;
  @Prop({ default: '16' }) readonly iconSize: string;
  @Prop({ default: 'spunPearl' }) readonly iconColor: string;
  @Prop({ default: '' }) readonly placeholder: string;
  @Prop({ default: false }) readonly disabled: boolean;
  @Prop({ default: false }) readonly required: boolean;
  @Prop({ default: '' }) readonly min: string;
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
  @Prop({
    default: () => {
      //
    },
  })
  readonly keyDownInput: (event?: KeyboardEvent) => void;
  @Prop({
    default: () => {
      //
    },
  })
  readonly blurInput: () => void;
  @Prop({
    default: () => {
      //
    },
  })
  readonly handlePaste: (event?: ClipboardEvent) => void;

  private isShowPassword: boolean = false;
  private inputType: string = InputType.TEXT;

  get isInputText(): boolean {
    return (
      this.type === InputType.TEXT ||
      this.type === InputType.TEXTAREA ||
      this.type === InputType.PASSWORD
    );
  }

  get hasModel(): boolean {
    return this.syncedValue !== undefined;
  }

  get inputProps(): App.InputProps {
    return !this.hasModel
      ? { name: this.name }
      : { formulateValue: this.syncedValue };
  }

  get attributes(): Record<string, string> {
    if (this.type === 'number') {
      return {
        ...this.$attrs,
        min: this.min,
      };
    }
    return this.$attrs;
  }

  get iconError(): string {
    return get(icons, ['warning']);
  }

  created(): void {
    this.inputType = this.type;
  }

  onChange(value: string): void {
    if (this.hasModel) {
      this.syncedValue = value;
    }
    if (this.changeValue) {
      this.changeValue(value);
    }
  }

  onToggleShowPassword(): void {
    this.isShowPassword = !this.isShowPassword;
    this.inputType = this.isShowPassword ? InputType.TEXT : InputType.PASSWORD;
  }

  onBlur(context: Context): void {
    if (this.autoTrim) {
      const formName = this.getFormName(context.id);
      const value = (context.model as string).trim();
      if (formName && this.isInputText) {
        const formData = this.getFormData(formName);
        formData[this.name] = value;
        this.$formulate.setValues(formName, formData);
      } else if (this.hasModel) {
        this.syncedValue = value;
      }
      if (this.changeValue) {
        this.changeValue(value);
      }
    }
    if (this.blurInput) {
      this.blurInput();
    }
  }

  getFormName(inputId: string): string {
    let formName = '';
    this.$formulate.registry.forEach((component: Vue) => {
      const elements = Array.from((component.$el as HTMLFormElement).elements);
      const inputElement = elements.find(({ id }) => id === inputId);
      if (inputElement) {
        formName = last(
          (component.$el as HTMLFormElement).className.split('-'),
        );
      }
    });
    return formName;
  }

  getFormData(formName: string): App.Any {
    return get(this.$formulate.registry.get(formName), 'proxy');
  }

  onKeyDown(event: KeyboardEvent): void {
    if (this.keyDownInput) {
      this.keyDownInput(event);
    }
  }

  onPaste(event: ClipboardEvent): void {
    if (this.handlePaste) {
      this.handlePaste(event);
    }
  }

  renderPrefixIcon(): JSX.Element {
    return (
      <fragment slot="prefix">
        <Styled.PrefixIcon>
          <font-icon
            name={this.prefixIcon}
            size={this.iconSize}
            color={this.iconColor}
          />
        </Styled.PrefixIcon>
      </fragment>
    );
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

  renderPasswordIcon(): JSX.Element {
    return (
      <fragment slot="suffix">
        <Styled.SuffixIcon>
          <font-icon
            name={this.isShowPassword ? 'eye-off' : 'eye'}
            color={this.isShowPassword ? 'spunPearl' : 'highland'}
            size="18"
            vOn:click_native={this.onToggleShowPassword}
          />
        </Styled.SuffixIcon>
      </fragment>
    );
  }

  renderLabel(): JSX.Element {
    if (this.label) {
      return (
        <Styled.LabelWrapper slot="label">
          <Styled.Label
            class="input-label"
            prefixIcon={this.prefixIcon}
            required={this.required}
            domProps={{
              innerHTML: this.label,
            }}
          />
          {this.$slots.labelSuffix}
        </Styled.LabelWrapper>
      );
    }
    return null;
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
          type={this.inputType}
          disabled={this.disabled}
          placeholder={this.placeholder}
          validation={this.validation}
          validationRules={this.validationRules}
          validationMessages={this.validationMessages}
          error-behavior={this.errorBehavior}
          autocomplete="off"
          vOn:input={this.onChange}
          vOn:blur-context={this.onBlur}
          vOn:keydown={this.onKeyDown}
          vOn:paste={this.onPaste}
          scopedSlots={{
            element: this.$scopedSlots.element,
            label: this.renderLabel,
          }}
        >
          {this.type === 'password' && this.renderPasswordIcon()}
          {this.prefixIcon && this.renderPrefixIcon()}
          {this.suffixIcon && this.renderSuffixIcon()}
        </formulate-input>
      </Styled.Wrapper>
    );
  }
}
