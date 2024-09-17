import styled, { css } from 'vue-styled-components';

const wrapperProps = {
  showPanelContent: Boolean,
};

const panelProps = {
  isActive: Boolean,
  isDisabled: Boolean,
};

const panelWrapperProps = {
  isColumnLayout: Boolean,
};

export const Wrapper = styled('div', wrapperProps)`
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: ${(props) =>
    props.showPanelContent ? '1fr 1fr' : 'inherit'};
  background: ${({ theme }) => theme.background.wildSand};
`;

export const Loading = styled.div`
  display: flex;
  justify-content: center;
`;

export const PanelWrapper = styled('div', panelWrapperProps)`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  min-height: calc(100svh - 90px);
  background: ${({ theme }) => theme.background.wildSand};

  @media (max-width: 576px) {
    padding: 0 15px;
  }

  @media (max-width: 768px) {
    min-height: calc(100svh - 68px);
  }
`;

const miniBoxCss = css`
  width: 100%;
`;

const boxProps = {
  showPanelContent: Boolean,
};

export const Box = styled('div', boxProps)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  padding: 24px 0;

  ${(props) => !props.showPanelContent && miniBoxCss}
`;

const panelActiveCss = css`
  outline: 4px solid ${({ theme }) => theme.colors.envy};
`;

const panelDisabledCss = css`
  background: ${({ theme }) => theme.colors.ghost};
  cursor: not-allowed;
  pointer-events: none;
`;

export const Panel = styled('div', panelProps)`
  width: 420px;
  overflow: hidden;
  border-radius: 8px;
  cursor: pointer;
  background: ${({ theme }) => theme.background.white};
  box-shadow: 0px 0px 4px rgba(109, 111, 126, 0.12);
  ${(props) => props.isActive && panelActiveCss}
  ${(props) => props.isDisabled && panelDisabledCss}

  @media (max-width: 576px) {
    width: 100%;
  }
`;

export const PanelFooter = styled.div`
  padding: 12px 20px;
  font-weight: bold;
  font-size: 16px;
  line-height: 20px;
  color: ${({ theme }) => theme.colors.highland};
  background: ${({ theme }) => theme.background.white};
`;

export const Container = styled.div`
  overflow-y: auto;
  max-height: calc(100svh - 68px);
`;

export const Content = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  top: 90px;
  right: 0;
  bottom: 0;
  left: 0;
  background: ${({ theme }) => theme.background.wildSand};

  @media (max-width: 767px) {
    top: 67px;
  }
`;

export const CloseIcon = styled.div`
  position: absolute;
  top: 26px;
  left: 124px;
  z-index: 1;
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
    top: 15px;
    left: 15px;
    width: 30px;
    height: 30px;
  }
`;

const imgProps = {
  name: String,
};

export const PanelImage = styled('img', imgProps)`
  width: 420px;
  height: 84px;

  @media (max-width: 576px) {
    width: 100%;
  }
`;
