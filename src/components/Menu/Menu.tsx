import { Component, Prop, Mixins } from 'vue-property-decorator';
import { isEmpty } from 'lodash';
import { SidebarType } from 'enums/app';
import LanguageDropdown from 'components/FormUI/Dropdown/LanguageDropdown';
import * as Styled from './styled';
import MenuMixin from './MenuMixin';

@Component
export default class Menu extends Mixins(MenuMixin) {
  @Prop({
    default: SidebarType.VERTICAL,
    validator(this, value) {
      return [SidebarType.VERTICAL, SidebarType.HORIZONTAL].includes(value);
    },
  })
  type: string;

  renderIcon(icon: string): JSX.Element {
    if (!isEmpty(icon)) {
      return <font-icon name={icon} />;
    }
    return null;
  }

  render(): JSX.Element {
    return (
      <Styled.Wrapper type={this.type}>
        <Styled.LogoContainer size="default">
          <Styled.Logo />
        </Styled.LogoContainer>
        <perfect-scrollbar>
          <Styled.MenuList type={this.type}>
            {this.menuList.map((menu, index) => (
              <router-link key={index} to={{ name: menu.name }}>
                <Styled.MenuItem
                  type={this.type}
                  isActive={this.isActiveMenu(menu)}
                >
                  {this.renderIcon(menu.icon)}
                  <Styled.MenuLabel isActive={this.isActiveMenu(menu)}>
                    {this.$t(menu.label, menu.params)}
                  </Styled.MenuLabel>
                </Styled.MenuItem>
              </router-link>
            ))}
          </Styled.MenuList>
        </perfect-scrollbar>
        <fragment>
          <Styled.MyAccount type={this.type}>
            <Styled.UserMenuItem onClick={this.logout}>
              <font-icon name="logout" />
              {this.$t('logout')}
            </Styled.UserMenuItem>
            <LanguageDropdown />
          </Styled.MyAccount>
        </fragment>
      </Styled.Wrapper>
    );
  }
}
