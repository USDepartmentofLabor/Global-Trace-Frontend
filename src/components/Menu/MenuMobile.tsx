import { Mixins, Component } from 'vue-property-decorator';
import app from 'store/modules/app';
import requestModule from 'store/modules/request';
import { getLanguageOptions } from 'utils/helpers';
import * as Styled from './styled';
import SidebarMixin from './Menu';
import Accordion from '../Accordion';
import FlagIcon from '../FlagIcon';

@Component
export default class MenuMobile extends Mixins(SidebarMixin) {
  private isShowMenu: boolean = false;
  private menuListOption: App.Menu[] = [];
  private showLanguageMenu = false;

  created(): void {
    this.menuListOption = this.menuList;
  }

  toggleMenu(): void {
    this.isShowMenu = !this.isShowMenu;
  }

  toggleLanguageMenu() {
    this.showLanguageMenu = !this.showLanguageMenu;
  }

  changeOptionValue(id: string): void {
    app.changeLanguage(id);
    requestModule.getIndicators({
      callback: {},
    });
    this.toggleMenu();
  }

  renderMenuToggle(): JSX.Element {
    return (
      <Styled.WrapperMobile>
        <Styled.LogoContainer size="mobile">
          <Styled.Logo />
        </Styled.LogoContainer>
        <Styled.MenuIcon onClick={this.toggleMenu} />
      </Styled.WrapperMobile>
    );
  }

  renderMenuSignOut(): JSX.Element {
    return (
      <Styled.MenuItemMobile onClick={this.logout}>
        <Styled.MenuLabelMobile>{this.$t('logout')}</Styled.MenuLabelMobile>
      </Styled.MenuItemMobile>
    );
  }

  renderMenuTranslation(): JSX.Element {
    return (
      <Accordion show={this.showLanguageMenu} toggle={this.toggleLanguageMenu}>
        <Styled.MenuItemMobile slot="title">
          <Styled.MenuLabelMobile>
            {this.$t('translation')}
          </Styled.MenuLabelMobile>
          <Styled.Arrow>
            <font-icon name="chevron_right" color="black" size="20" />
          </Styled.Arrow>
        </Styled.MenuItemMobile>
        <fragment slot="content">
          {getLanguageOptions().map((option) => (
            <Styled.MenuItemMobile
              onClick={() => this.changeOptionValue(option.id as string)}
            >
              <FlagIcon name={option.icon} />
              <Styled.MenuLabelMobile>{option.name}</Styled.MenuLabelMobile>
            </Styled.MenuItemMobile>
          ))}
        </fragment>
      </Accordion>
    );
  }

  renderMenuList(): JSX.Element {
    return (
      <Styled.MenuListMobileContainer>
        <Styled.MenuListMobile>
          {this.menuListOption.map((menu, index) => (
            <router-link
              key={index}
              to={{ name: menu.name }}
              vOn:click_native={this.toggleMenu}
            >
              <Styled.MenuItemMobile isActive={this.isActiveMenu(menu)}>
                <Styled.MenuLabelMobile isActive={this.isActiveMenu(menu)}>
                  {this.$t(menu.label, menu.params)}
                </Styled.MenuLabelMobile>
              </Styled.MenuItemMobile>
            </router-link>
          ))}
          {this.renderMenuSignOut()}
          {this.renderMenuTranslation()}
        </Styled.MenuListMobile>
      </Styled.MenuListMobileContainer>
    );
  }

  renderMenuContent(): JSX.Element {
    return (
      <fragment>
        <Styled.Overlay />
        {this.renderMenuList()}
        {this.renderMenuSignOut()}
        {this.renderMenuTranslation()}
      </fragment>
    );
  }

  render(): JSX.Element {
    return (
      <fragment>
        {this.renderMenuToggle()}
        {this.isShowMenu && this.renderMenuContent()}
      </fragment>
    );
  }
}
