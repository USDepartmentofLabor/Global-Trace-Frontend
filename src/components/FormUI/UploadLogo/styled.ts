import styled, { css } from 'vue-styled-components';

const PreviewProp = {
  img: String,
};

const containerProps = {
  disabled: Boolean,
  hasLogo: Boolean,
};

const uploadCSS = css`
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.surfCrest};
  height: 145px;
`;

export const Container = styled('div', containerProps)`
  display: flex;
  flex-direction: column;
  pointer-events: ${({ disabled }) => (disabled ? 'none' : 'inherit')};
  ${({ hasLogo }) => !hasLogo && uploadCSS}

  .file-uploads {
    width: 100%;
    box-sizing: border-box;

    label {
      cursor: pointer;
    }
  }
`;

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

export const EditContainer = styled.div`
  padding: 26px;
  border-radius: 8px;
  border: 1px dashed ${({ theme }) => theme.colors.surfCrest};
  height: 145px;
`;

export const PreviewImage = styled('div', PreviewProp)`
  width: 100%;
  background-image: url('${({ img }) => img}');
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
  height: 145px;
  border-radius: 8px;
`;

export const Action = styled.span`
  display: flex;
  padding-left: 12px;
  font-weight: 400;
  font-size: 12px;
  line-height: 22px;
  color: ${({ theme }) => theme.colors.highland};
  text-decoration: underline;
`;

export const Label = styled.span`
  margin-left: 12px;
  margin-bottom: 4px;
  font-size: 14px;
  line-height: 20px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.highland};
`;

export const UploadContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 145px;
`;

export const UploadLabel = styled.div`
  font-size: 14px;
  text-align: center;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.highland};
  text-decoration: underline;
`;

export const Error = styled.span`
  font-size: 12px;
  line-height: 20px;
  color: ${({ theme }) => theme.colors.red};
  text-align: left;
  margin-top: 5px;
`;
