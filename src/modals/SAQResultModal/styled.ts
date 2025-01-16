import styled from 'vue-styled-components';
import { RESOURCES } from 'config/constants';

export const Wrapper = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: ${({ theme }) => theme.background.wildSand};

  .ps {
    height: 100svh;
  }
`;

export const Container = styled.div`
  position: relative;
  width: max-content;
  max-width: 100%;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  margin-left: auto;
  margin-right: auto;
`;

export const Logo = styled.img.attrs({
  src: RESOURCES.LOGO,
})`
  width: 120px;
  height: 32px;
  margin-top: 76px;
  margin-bottom: 140px;

  @media (max-width: 992px) {
    margin-bottom: 40px;
  }
`;

export const CloseButton = styled.div`
  position: absolute;
  top: 180px;
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
    left: 15px;
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
`;
