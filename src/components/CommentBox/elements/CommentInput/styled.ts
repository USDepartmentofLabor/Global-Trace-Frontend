import styled, { css } from 'vue-styled-components';

export const FileBox = styled.div`
  display: flex;
  gap: 8px;
  padding: 12px;
  align-items: center;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.highland};
`;

export const FileName = styled.div`
  font-size: 14px;
  font-weight: 400;
  flex: 1;
  color: ${({ theme }) => theme.colors.highland};
`;

export const ButtonRemove = styled.div`
  cursor: pointer;
`;

export const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 8px 2px 16px 16px;
  border-radius: 4px;

  border: 1px solid ${({ theme }) => theme.colors.surfCrest};
`;

const inputContainerProps = {
  isEdit: Boolean,
};

export const InputContainer = styled('div', inputContainerProps)`
  display: flex;
  gap: 8px;
  align-items: center;
  position: relative;

  .formulate-input .formulate-input-wrapper .formulate-input-element textarea {
    padding: 13px ${({ isEdit }) => (isEdit ? '52px' : '100px')} 0 52px;
    border: 0;
    min-height: 44px;

    &:hover,
    &:focus {
      border: 0;
    }
  }

  .file-uploads {
    position: absolute;
    right: ${({ isEdit }) => (isEdit ? '16px' : '60px')};
    top: 6px;
    cursor: pointer;

    label {
      cursor: pointer;
    }
  }
`;

export const SelectedFiles = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const avatarCss = css`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  width: 44px;
  height: 44px;
  box-sizing: border-box;
  font-size: 20px;
  font-weight: 800;
  border-radius: 4px;
  color: ${({ theme }) => theme.colors.highland}
  border: 1px solid ${({ theme }) => theme.colors.highland}
  background-color: ${({ theme }) => theme.background.surfCrest}
`;

export const Avatar = styled.div`
  position: absolute;
  top: 0px;
  left: 0px;
  ${avatarCss}
`;

export const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding: 0 8px;
`;
