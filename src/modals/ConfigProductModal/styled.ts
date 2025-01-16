import styled, { css } from 'vue-styled-components';

const emptyContentCss = css`
  min-height: 140px;
`;

const ContentProp = {
  isEmpty: Boolean,
};

export const Actions = styled.div`
  display: flex;
  justify-content: center;
  gap: 16px;
  padding: 24px 32px;
`;

export const ButtonGroupEnd = styled.div`
  display: flex;
  gap: 16px;
  flex: 1;
  justify-content: flex-end;
`;

export const Header = styled.div`
  width: 100%;
  padding: 24px 32px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const Content = styled('div', ContentProp)`
  display: flex;
  margin: auto;
  padding: 0 30px 16px;
  flex-direction: column;
  justify-content: start;
  background-color: ${({ theme }) => theme.colors.wildSand};
  ${({ isEmpty }) => isEmpty && emptyContentCss}

  & > .ps {
    max-height: calc(100svh - 350px);
    margin: 0 -30px;
    padding: 0 30px;
  }

  .ghost-item {
    background-color: ${({ theme }) => theme.background.surfCrest};
  }
`;

export const Box = styled.div`
  display: flex;
  flex-direction: column;
  border-bottom: 1px solid ${({ theme }) => theme.colors.ghost};
`;

export const Col = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

export const Input = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const addManuallyProps = {
  disabled: Boolean,
};

export const AddManually = styled('div', addManuallyProps)`
  display: flex;
  justify-content: start;
  align-items: center;
  font-weight: 400;
  font-size: 16px;
  line-height: 20px;
  color: ${({ theme, disabled }) =>
    disabled ? theme.colors.spunPearl : theme.colors.highland};
  cursor: ${({ disabled }) => (disabled ? 'inherit' : 'pointer')};
  user-select: none;
`;

const cameraContainerParams = {
  show: Boolean,
};

export const CameraContainer = styled('div', cameraContainerParams)`
  position: fixed;
  top: ${(props) => (props.show ? 0 : '99999px')};
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

export const CameraBackDrop = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

export const CloseIcon = styled.div`
  position: absolute;
  right: 30px;
  top: 30px;
  cursor: pointer;
`;

export const OptionBody = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 10px;
  padding: 8px 13px;
  margin-bottom: 4px;
  font-size: 14px;
  font-weight: 400;
  color: ${({ theme }) => theme.colors.stormGray};
`;
