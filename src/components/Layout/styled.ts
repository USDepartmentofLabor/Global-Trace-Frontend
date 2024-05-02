import styled, { css, injectGlobal } from 'vue-styled-components';
import fontIconEOT from 'assets/fonts/usdol.eot';
import fontIconTTF from 'assets/fonts/usdol.ttf';
import fontIconWOFF from 'assets/fonts/usdol.woff';
import globalStyled from 'styles/global-styled';
import { RESOURCES } from 'config/constants';

export const MasterLayout = styled.div`
  ul,
  ol {
    list-style: none;
  }

  font-family: 'Sora';
`;

const dashboardLayoutProps = {
  isColumn: Boolean,
};

export const DashboardLayout = styled('div', dashboardLayoutProps)`
  display: flex;
  flex-direction: ${(props) => (props.isColumn ? 'row' : 'column')};
`;

export const Container = styled.div`
  flex: 1 1 auto;
  height: 100%;
  display: flex;
  flex-direction: column;
  height: calc(100svh - 90px);
  overflow-y: auto;

  @media screen and (max-width: 768px) {
    width: 100%;
    padding-top: 68px;
    height: calc(100svh - 68px);
  }
`;

export const ColumnContainer = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  background: ${({ theme }) => theme.background.wildSand};
`;

const scrollbarContainerProps = {
  size: String,
  showHeader: Boolean,
};

export const ScrollbarContainer = styled('div', scrollbarContainerProps)`
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
`;

const headerProps = {
  showStroker: Boolean,
  isOnlyAction: Boolean,
  height: String,
};

const headerStrokeCSS = css`
  border-bottom: 1px solid ${({ theme }) => theme.background.ghost};
`;

export const Header = styled('div', headerProps)`
  width: 100%;
  display: flex;
  align-items: center;
  padding: 14px 40px;
  justify-content: ${(props) => (props.isOnlyAction ? 'flex-end' : 'inherit')};
  box-sizing: border-box;
  background-color: ${({ theme }) => theme.background.wildSand};

  ${(props) => props.showStroker && headerStrokeCSS};

  @media screen and (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    gap: 24px;
    padding: 24px;
  }

  @media (max-width: 920px) {
    padding: 14px;
  }
`;

const headerTitleProps = {
  align: String,
};

export const HeaderTitle = styled('div', headerTitleProps)`
  flex: 1;
  text-align: ${(props) => props.align};
  font-weight: 800;
  font-size: 24px;
  line-height: 30px;
  color: ${({ theme }) => theme.background.stormGray};

  @media screen and (max-width: 768px) {
    flex: unset;
  }
`;

export const BackIcon = styled.div``;

export const DashboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export const SupplierLayout = styled.div`
  width: 100%;
  height: 100svh;
  background: ${({ theme }) => theme.background.white};
`;

export const GuestLayout = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: ${({ theme }) => theme.background.wildSand};
  width: 100%;
  height: 100svh;
`;

export const GuestContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
`;

const logoContainerProps = {
  size: String,
};

const logoSizeCss = {
  medium: `
    width: 120px;
  `,
  large: `
    width: 239px;
  `,
};

export const LogoContainer = styled('div', logoContainerProps)`
  position: absolute;
  top: 46px;
  ${({ size }) => logoSizeCss[size]}

  @media screen and (max-width: 768px) {
    top: 44px;
    left: 38px;
    width: 132px;
  }
`;

export const Logo = styled.img.attrs({
  src: RESOURCES.LOGO,
})`
  width: 100%;
`;

export const ModalLayout = styled.div`
  border-radius: 8px;
  background-color: ${({ theme }) => theme.background.white};

  @media screen and (max-width: 992px) {
    max-height: 100svh;
    overflow-y: auto;
    position: relative;
  }
`;

export const Title = styled.div`
  font-size: 34px;
  font-weight: 700;
  line-height: 40px;
  text-align: center;
  margin-top: 30px;
  word-break: break-word;
  padding-left: 16px;
  padding-right: 16px;

  color: ${({ theme }) => theme.colors.highland};

  @media screen and (max-width: 768px) {
    font-size: 24px;
    line-height: 28px;
  }
`;

export const CloseIcon = styled.div`
  position: absolute;
  right: 16px;
  top: 16px;
  cursor: pointer;
`;

export const Back = styled.div`
  position: absolute;
  left: 30px;
  top: 30px;
  cursor: pointer;

  @media (max-width: 767px) {
    left: 12px;
  }
`;

injectGlobal`
  @charset "UTF-8";

  @font-face {
    font-family: 'font-icons';
    font-weight: normal;
    font-style: normal;
    src: url(${fontIconEOT});
    src:
      url(${fontIconEOT}) format('embedded-opentype'),
      url(${fontIconTTF}) format('truetype'),
      url(${fontIconWOFF}) format('woff');
  }

  body {
    min-height: 100svh;
    min-height: -webkit-fill-available;
    overflow: hidden;
  }

  ${globalStyled}
`;

export const LanguageDropdown = styled.div`
  position: absolute;
  top: 46px;
  right: 46px;

  @media screen and (max-width: 768px) {
    top: 38px;
    right: 38px;
  }
`;

export const ServiceLayout = styled.div`
  width: 100%;
  height: 100vh;
  overflow-y: auto;
`;

export const ServiceContainer = styled.div`
  max-width: 1100px;
  padding: 20px;
  margin: 60px auto 0;

  a {
    text-decoration: underline;
    color: ${({ theme }) => theme.colors.stTropaz};
  }

  .principle-title {
    font-size: 16px;
    color: ${({ theme }) => theme.colors.eastBay};
    font-weight: bolder;
    margin: 0 0 16px;
  }

  .principle-description {
    font-size: 16px;
    color: ${({ theme }) => theme.colors.eastBay};
    line-height: 1.4;
    white-space: pre-wrap;
    text-align: justify;
    margin: 0 0 22px;
    margin-left: 20px;
  }

  .description {
    font-size: 16px;
    color: ${({ theme }) => theme.colors.eastBay};
    line-height: 1.4;
    white-space: pre-wrap;
    text-align: justify;
    margin: 0 0 22px;
  }
`;

export const ServiceLogo = styled.div`
  width: 225px;
  margin-bottom: 30px;
`;

export const ServiceTitle = styled.div`
  font-weight: bolder;
  font-size: 30px;
  color: ${({ theme }) => theme.colors.stTropaz};
  line-height: 28px;
  margin-top: 0;
  margin-bottom: 30px;
`;
