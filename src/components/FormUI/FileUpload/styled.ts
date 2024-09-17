import styled, { css } from 'vue-styled-components';

const containerProps = {
  variant: String,
  isSelectedFile: Boolean,
  disabled: Boolean,
  multiple: Boolean,
};

const uploadFileStyle = css`
  flex-direction: column;
  justify-content: center;
  border-radius: 8px;
  border: 1px dashed ${({ theme }) => theme.colors.envy};

  .file-uploads {
    padding: 30px 12px;
  }
`;

const uploadAnotherFileStyle = css`
  display: ${(props) => (props.multiple ? 'flex' : 'none')};
  width: max-content;
  flex-direction: row;
  margin: 10px ${(props) => (props.variant === 'primary' ? '0' : 'auto')};
  font-size: 14px;
  color: ${({ theme }) => theme.colors.sandyBrown};

  .file-uploads {
    display: flex;
    gap: 10px;
  }
`;

export const Container = styled('div', containerProps)`
  display: flex;
  pointer-events: ${(props) => (props.disabled ? 'none' : 'inherit')};

  .file-uploads {
    width: 100%;
    box-sizing: border-box;

    label {
      cursor: pointer;
    }
  }

  ${(props) =>
    props.isSelectedFile ? uploadAnotherFileStyle : uploadFileStyle}
`;

export const ButtonRemove = styled.div`
  cursor: pointer;
`;

const fileListProps = {
  variant: String,
};

const fileListCSS = {
  secondary: css`
    padding: 10px;
    border-radius: 8px;
    background-color: ${({ theme }) => theme.colors.wildSand};
  `,
};

export const FileList = styled('div', fileListProps)`
  display: flex;
  flex-direction: column;
  gap: 15px;

  ${(props) => fileListCSS[props.variant]}
`;

export const FileBox = styled.div`
  display: flex;
  flex-direction: column;
`;

const fileItemProps = {
  isError: Boolean,
  variant: String,
};

const itemErrorCSS = css`
  border-color: ${({ theme }) => theme.colors.red};
  color: ${({ theme }) => theme.colors.red};
`;

const itemCSS = css`
  border-color: transparent;
  color: ${({ theme }) => theme.colors.envy};
`;

const fileItemCSS = {
  primary: `padding: 15px 20px;`,
  secondary: `padding: 5px;`,
};

export const FileItem = styled('div', fileItemProps)`
  display: flex;
  background-color: ${({ theme }) => theme.background.white};
  box-shadow: 0px 0px 4px ${({ theme }) => theme.colors.blackTransparent3};
  align-items: center;
  border-width: 1px;
  border-style: solid;
  gap: 10px;
  ${(props) => fileItemCSS[props.variant]}
  ${({ isError }) => (isError ? itemErrorCSS : itemCSS)};
`;

export const FileName = styled.div`
  font-size: 14px;
  flex: 1;
  word-break: break-all;
`;

const labelProps = {
  variant: String,
};

export const Label = styled('div', labelProps)`
  font-size: 14px;
  text-align: center;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.sandyBrown};
`;

export const Error = styled.div`
  font-size: 14px;
  line-height: 20px;
  color: ${({ theme }) => theme.colors.red};
  text-align: right;
  margin-top: 5px;
`;

export const Action = styled.div`
  display: flex;
  justify-content: end;
`;
