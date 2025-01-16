import styled, { css } from 'vue-styled-components';
import { RESOURCES } from 'config/constants';

const wrapperProps = {
  type: String,
};

const menuListProps = {
  type: String,
};

const menuItemProps = {
  type: String,
  isActive: Boolean,
};

const menuItemMobileProps = {
  isActive: Boolean,
};

const myAccountProps = {
  type: String,
  isActive: Boolean,
};

const logoContainerProps = {
  size: String,
};

const wrapperStyles = {
  horizontal: `
    flex-direction: row;
    width: 100%;
    height: 90px;
    padding: 20px;

    & > .ps {
      flex: 1;
      z-index: 0;
    }
  `,
  vertical: `
    flex-direction: column;
    width: 280px;
    height: 100svh;
    padding: 100px 24px;
    flex-shrink: 0;
  `,
};

export const Wrapper = styled('div', wrapperProps)`
  display: flex;
  background: ${({ theme }) => theme.background.stormGray};
  position: relative;
  box-sizing: border-box;

  a {
    text-decoration: none;
  }

  & > .ps .ps__rail-y,
  & > .ps .ps__rail-x {
    opacity: 0.6;
  }

  ${({ type }) => wrapperStyles[type]}

  @media screen and (max-width: 768px) {
    display: none;
  }
`;

const menuListStyles = {
  horizontal: `
    display: flex;
  `,
};

export const MenuList = styled('div', menuListProps)`
  flex: 1;
  ${({ type }) => menuListStyles[type]}
`;

const activeStyled = css`
  background-color: ${({ theme }) => theme.background.highland};
`;

const menuItemStyles = {
  horizontal: `
    padding: 13px 20px;
  `,
  vertical: `
    padding: 20px;
  `,
};

export const MenuItem = styled('span', menuItemProps)`
  display: flex;
  gap: 15px;
  cursor: pointer;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.wildSand};
  border-radius: 10px;
  font-size: 16px;

  ${({ isActive }) => isActive && activeStyled}
  ${({ type }) => menuItemStyles[type]}
`;

export const MenuLabel = styled('span', menuItemProps)`
  font-size: 16px;
  line-height: 24px;
  text-transform: capitalize;
  white-space: nowrap;
`;

export const UserMenuItem = styled.span`
  font-size: 16px;
  line-height: 24px;
  display: flex;
  align-items: center;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.white};
  gap: 17px;
  font-weight: 700;
`;

const myAccountStyles = {
  horizontal: `
    padding: 10px 24px;
    flex-direction: row;
    align-items: center;
  `,
  vertical: `
    padding: 20px 24px;
    flex-direction: column;
  `,
};

export const MyAccount = styled('div', myAccountProps)`
  display: flex;
  gap: 50px;

  ${({ type }) => myAccountStyles[type]}
`;

export const WrapperMobile = styled.div`
  display: none;

  @media screen and (max-width: 768px) {
    position: fixed;
    width: 100%;
    top: 0;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 18px 24px;
    background-color: ${({ theme }) => theme.background.stormGray};
    z-index: 10;
  }
`;

const logoSizeCss = {
  default: `
    width: 189px;
    margin-right: 16px;
  `,
  mobile: `
    width: 113px;
  `,
};

export const LogoContainer = styled('div', logoContainerProps)`
  flex-shrink: 0;
  ${({ size }) => logoSizeCss[size]}
`;

export const Logo = styled.img.attrs({
  src: RESOURCES.LOGO_MENU,
})`
  width: 100%;
`;

export const MenuIcon = styled.img.attrs({
  src: RESOURCES.ICON_MENU,
})`
  width: 24px;
  height: 24px;
  cursor: pointer;
`;

export const MenuCloseIcon = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 8px 24px;
  cursor: pointer;
`;

export const MenuListMobileContainer = styled.div`
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 67px;
  width: 100%;
  max-height: calc(100svh - 68px);
  background-color: ${({ theme }) => theme.background.white};
  z-index: 9;
  transition: 0.4s;
  animation: slideDown 0.4s forwards;

  @keyframes slideDown {
    0% {
      top: -100%;
    }
    100% {
      top: 67px;
    }
  }
`;

export const MenuListMobile = styled.div`
  a {
    text-decoration: none;
  }
`;

const activeMobileStyled = css`
  background-color: ${({ theme }) => theme.background.surfCrest};
`;

export const MenuItemMobile = styled('span', menuItemMobileProps)`
  display: flex;
  align-items: center;
  gap: 8px;
  height: 32px;
  padding: 8px 13px;
  border-bottom: 1px solid var(--green-600, #d8e5d6);

  ${({ isActive }) => isActive && activeMobileStyled}
`;

export const MenuLabelMobile = styled('span', menuItemMobileProps)`
  font-size: 14px;
  font-weight: 400;
  text-transform: capitalize;
  white-space: nowrap;
  color: ${({ theme }) => theme.colors.stormGray};
`;

export const Arrow = styled.div`
  position: absolute;
  right: 24px;
  transform: rotate(90deg); ;
`;

export const Overlay = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  background: rgba(45, 45, 52, 0.75);
  filter: blur(1px);
  backdrop-filter: blur(4px);
  z-index: 9;
`;
