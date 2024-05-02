import { Vue, Component, Prop } from 'vue-property-decorator';
import { AsyncComponent } from 'vue';
import { ThemeProvider } from 'vue-styled-components';
import { get } from 'lodash';
import icons from 'assets/data/icons.json';
import theme from 'styles/theme';
import * as Styled from './styled';

@Component
export default class Toast extends Vue {
  @Prop({ default: '' }) readonly content: string | AsyncComponent;
  @Prop({ default: 'success' }) readonly type: 'success' | 'error' | 'info';
  @Prop({ default: 5000 }) readonly duration: number;
  @Prop({ default: true }) readonly showIcon: boolean;
  @Prop({ default: 'OK' }) readonly closeLabel: string;

  private wrapper: HTMLElement;

  get icon(): string {
    switch (this.type) {
      case 'success':
        return 'check';
      case 'info':
        return 'circle_warning';
      case 'error':
        return 'warning_outline';
      default:
        return '';
    }
  }

  get iconName(): string {
    return get(icons, [this.icon], '');
  }

  beforeMount(): void {
    const className = 'custom-toast';
    if (typeof document !== 'undefined') {
      this.wrapper = document.querySelector(`.${className}`);
      if (!this.wrapper) {
        this.wrapper = document.createElement('div');
        this.wrapper.className = className;
        document.body.appendChild(this.wrapper);
      }
    }
  }

  mounted(): void {
    if (this.$el.innerHTML) {
      this.wrapper.insertAdjacentElement('afterbegin', this.$el);
      setTimeout(() => {
        this.$destroy();
      }, this.duration);
    }
  }

  isDuplicate(): boolean {
    for (const childrenEl of this.wrapper.children) {
      if ((childrenEl as HTMLElement).innerText === this.content) {
        return true;
      }
    }
    return false;
  }

  onClose(): void {
    this.$destroy();
  }

  destroyed(): void {
    if (typeof this.$el.remove !== 'undefined') {
      this.$el.remove();
    } else {
      this.$el.parentNode.removeChild(this.$el);
    }
  }

  renderContent(): JSX.Element | string {
    if (typeof this.content === 'string') {
      return this.content;
    }
    const ToastComponent = this.content as unknown as typeof Vue;
    return <ToastComponent />;
  }

  render(): JSX.Element {
    if (!this.isDuplicate()) {
      return (
        <ThemeProvider theme={theme} class="custom-toast__body">
          <Styled.Wrapper vOn:click={this.onClose}>
            <Styled.Content
              showIcon={this.showIcon}
              icon={this.iconName}
              type={this.type}
            >
              <text-direction>{this.renderContent()}</text-direction>
            </Styled.Content>
          </Styled.Wrapper>
        </ThemeProvider>
      );
    }
  }
}
