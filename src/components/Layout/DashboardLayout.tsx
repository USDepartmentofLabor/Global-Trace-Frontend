import { Vue, Component, Prop, Ref } from 'vue-property-decorator';
import { isEmpty } from 'lodash';
import { SidebarType } from 'enums/app';
import auth from 'store/modules/auth';
import Menu from 'components/Menu/Menu';
import MenuMobile from 'components/Menu/MenuMobile';
import MasterLayout from './MasterLayout';
import * as Styled from './styled';

@Component
export default class DashboardLayout extends Vue {
  @Prop({ default: '' }) headerTitle: string;
  @Prop({ default: 'left' }) headerTitleAlign: string;
  @Prop({ default: '68px' }) height: string;
  @Prop({ default: false }) headerStroke: boolean;
  @Prop({ default: false }) showBack: boolean;
  @Prop({
    default: () => {
      //
    },
  })
  back: () => void;

  @Ref('scrollBar')
  readonly scrollBar!: Vue;

  get showHeader(): boolean {
    return (
      Boolean(this.headerTitle) ||
      this.showBack ||
      Boolean(this.$slots.headerAction)
    );
  }

  get isOnlyHeaderAction(): boolean {
    return isEmpty(this.headerTitle) && !isEmpty(this.$slots.headerAction);
  }

  get sidebarType(): string {
    return SidebarType.HORIZONTAL;
  }

  get scrollBarSize(): string {
    if (!this.showHeader && auth.isColumnLayout) {
      return 'veryLarge';
    } else if (this.showHeader && auth.isColumnLayout) {
      return 'large';
    } else if (!this.showHeader && !auth.isColumnLayout) {
      return 'medium';
    } else {
      return 'small';
    }
  }

  scrollToTop(): void {
    if (this.scrollBar) {
      this.scrollBar.$el.scrollTop = 0;
    }
  }

  scrollToPosition(position: number): void {
    if (this.scrollBar) {
      this.scrollBar.$el.scrollTop = position;
    }
  }

  renderHeader(): JSX.Element {
    if (this.headerTitle || this.showBack || this.$slots.headerAction) {
      return (
        <Styled.Header
          showStroker={this.headerStroke}
          isOnlyAction={this.isOnlyHeaderAction}
          height={this.height}
        >
          {this.showBack && (
            <Styled.BackIcon vOn:click={this.back}>
              <font-icon name="arrow_left" size="20" color="black" />
            </Styled.BackIcon>
          )}
          {this.headerTitle && (
            <Styled.HeaderTitle align={this.headerTitleAlign}>
              {this.headerTitle}
            </Styled.HeaderTitle>
          )}
          {this.$slots.headerAction}
        </Styled.Header>
      );
    }
    return null;
  }

  render(): JSX.Element {
    return (
      <MasterLayout>
        <Styled.DashboardLayout>
          <Menu type={this.sidebarType} />
          <MenuMobile />
          <Styled.Container>
            {this.renderHeader()}
            <Styled.ScrollbarContainer
              size={this.scrollBarSize}
              showHeader={this.showHeader}
            >
              {this.$slots.default}
            </Styled.ScrollbarContainer>
          </Styled.Container>
        </Styled.DashboardLayout>
      </MasterLayout>
    );
  }
}
