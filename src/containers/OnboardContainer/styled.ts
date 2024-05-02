import styled, { css } from 'vue-styled-components';
import { RESOURCES } from 'config/constants';

export const Wrapper = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  min-height: calc(100svh - 90px);
  box-sizing: border-box;
  background: ${({ theme }) => theme.background.wildSand};

  @media (max-width: 767px) {
    min-height: calc(100svh - 68px);
  }
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 28px;
  width: 100%;

  @media (max-width: 768px) {
    padding: 0 16px;
  }
`;

export const Title = styled.div`
  font-weight: 800;
  font-size: 32px;
  line-height: 40px;
  color: ${({ theme }) => theme.colors.highland};
`;

export const Description = styled.div`
  font-size: 14px;
  line-height: 18px;
  color: ${({ theme }) => theme.colors.spunPearl};
`;

export const MenuContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-width: 460px;

  @media (max-width: 768px) {
    min-width: 100%;
  }
`;

export const MenuItem = styled.div`
  display: flex;
  align-items: center;
  height: 88px;
  flex-direction: row;
  padding: 0 20px;
  gap: 12px;
  border-radius: 8px;
  cursor: pointer;
  background: ${({ theme }) => theme.background.white};
  box-shadow: 0px 4px 4px ${({ theme }) => theme.colors.blackTransparent1};
`;

export const MenuNumber = styled.div`
  font-weight: 800;
  font-size: 20px;
  line-height: 25px;
  color: ${({ theme }) => theme.colors.ghost};
`;

export const MenuName = styled.div`
  font-weight: 800;
  font-size: 20px;
  line-height: 25px;
  color: ${({ theme }) => theme.colors.stormGray};
  flex: 1;
`;

export const MenuWrapper = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  top: 90px;
  right: 0;
  bottom: 0;
  left: 0;
  overflow-y: auto;
  background: ${({ theme }) => theme.background.wildSand};

  @media (max-width: 767px) {
    top: 67px;
  }
`;

export const MenuContent = styled.div`
  position: relative;
  width: 640px;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  margin: 26px auto;

  @media (max-width: 992px) {
    width: 100%;

    form {
      width: 100%;
    }
  }
`;

export const Logo = styled.img.attrs({
  src: RESOURCES.LOGO,
})`
  width: 120px;
  height: 32px;
  margin-top: 76px;
  margin-bottom: 140px;
`;

export const CloseButton = styled.div`
  position: absolute;
  top: 26px;
  left: -124px;
  width: 48px;
  height: 48px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  cursor: pointer;

  background-color: ${({ theme }) => theme.background.white};
  box-shadow: 0px 4px 4px ${({ theme }) => theme.colors.blackTransparent5};

  @media (max-width: 992px) {
    top: 0px;
    left: 16px;
    width: 30px;
    height: 30px;
  }
`;

export const MenuTitle = styled.div`
  font-weight: 800;
  font-size: 32px;
  line-height: 40px;
  text-align: center;
  color: ${({ theme }) => theme.colors.highland};

  @media (max-width: 768px) {
    padding: 0 46px;
  }
`;

export const Actions = styled.div`
  width: 240px;
`;

const checkboxIconProps = {
  variant: String,
};

const checkboxIconCSS = {
  checked: css`
    background-color: ${({ theme }) => theme.background.highland};
  `,
  fail: css`
    background-color: ${({ theme }) => theme.background.ghost};
  `,
  uncheck: css`
    background-color: ${({ theme }) => theme.background.white};
    border: 2px solid ${({ theme }) => theme.colors.ghost};
  `,
};

export const CheckboxIcon = styled('div', checkboxIconProps)`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  box-sizing: border-box;
  ${(props) => checkboxIconCSS[props.variant]};
`;
