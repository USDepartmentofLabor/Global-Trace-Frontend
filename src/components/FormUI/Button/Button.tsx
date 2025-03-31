import { Vue, Component, Prop } from 'vue-property-decorator';
import { ButtonType } from 'enums/app';
import * as Styled from './styled';

@Component
export default class Button extends Vue {
  @Prop({
    default: ButtonType.BUTTON,
    validator(this, value) {
      return [ButtonType.BUTTON, ButtonType.SUBMIT].includes(value);
    },
  })
  readonly type: string;
  @Prop({
    default: 'primary',
    validator(this, value) {
      return [
        'primary',
        'outlinePrimary',
        'transparentPrimary',
        'transparentSecondary',
        'warning',
        'lightWarning',
        'outlineWarning',
        'transparentWarning',
        'danger',
        'outlineDanger',
      ].includes(value);
    },
  })
  readonly variant: string;
  @Prop({
    default: 'prefix',
    validator(this, value) {
      return ['prefix', 'suffix'].includes(value);
    },
  })
  readonly iconPosition: string;
  @Prop({
    default: 'medium',
    validator(this, value) {
      return ['tiny', 'small', 'medium', 'extraMedium', 'large'].includes(
        value,
      );
    },
  })
  readonly size: string;
  @Prop({
    default: 'center',
    validator(this, value) {
      return ['left', 'right', 'center'].includes(value);
    },
  })
  readonly textAlign: string;
  @Prop({ default: 'auto' }) readonly width: string;
  @Prop({ default: '' }) readonly icon: string;
  @Prop({ default: '24' }) readonly iconSize: string;
  @Prop({ default: '' }) readonly label: string;
  @Prop({ default: false }) readonly underlineLabel: boolean;
  @Prop({ default: false }) readonly disabled: boolean;
  @Prop({ default: false }) readonly isLoading: boolean;
  @Prop() readonly click: (e: Event) => void;

  onClickButton(e: Event): void {
    if (this.type === ButtonType.BUTTON && !this.disabled && this.click) {
      this.click(e);
    }
  }

  renderIcon(): JSX.Element {
    if (!this.isLoading && this.icon !== '') {
      return <font-icon name={this.icon} size={this.iconSize} />;
    }
    return null;
  }

  renderLabel(): JSX.Element {
    if (this.isLoading) {
      return <Styled.Loading variant={this.variant} />;
    }
    return (
      <Styled.Label
        underline={this.underlineLabel}
        domProps={{
          innerHTML: this.label,
        }}
      />
    );
  }

  render(): JSX.Element {
    return (
      <Styled.Wrapper
        width={this.width}
        variant={this.variant}
        size={this.size}
        label={this.label}
        textAlign={this.textAlign}
        isLoading={this.isLoading}
        iconPosition={this.iconPosition}
      >
        <formulate-input
          type={this.type}
          disabled={this.disabled || this.isLoading}
          onClick={this.onClickButton}
        >
          {this.iconPosition === 'prefix' && this.renderIcon()}
          {this.renderLabel()}
          {this.iconPosition === 'suffix' && this.renderIcon()}
        </formulate-input>
      </Styled.Wrapper>
    );
  }
}
