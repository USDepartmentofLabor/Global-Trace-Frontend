import styled, { css } from 'vue-styled-components';

const labelProps = {
  isStrong: Boolean,
  isFail: Boolean,
};

const variantProp = {
  variant: String,
};

export const Wrapper = styled.div`
  display: flex;
  label[for='uploadFile'] {
    cursor: pointer;
  }

  .file-uploads {
    label {
      cursor: pointer;
    }
  }
`;

const containerCSS = {
  default: css`
    padding: 20px;
    gap: 30px;
  `,
  circle: css`
    background: ${({ theme }) => theme.background.white};
    padding: 40px;
    gap: 50px;
  `,
};

export const Container = styled('div', variantProp)`
  display: flex;
  align-items: center;
  max-width: 1160px;
  ${({ variant }) => containerCSS[variant]}

  @media (max-width: 992px) {
    flex-direction: column;
  }
`;

const contentCSS = {
  default: css`
    width: 320px;
    height: 420px;
    background: ${({ theme }) => theme.background.wildSand};

    @media (max-width: 992px) {
      width: 100%;
      height: 100%;
    }
  `,
  circle: css`
    width: 460px;
    height: 460px;
    background: ${({ theme }) => theme.background.white};
    border-radius: 50%;
    border: 3px dashed ${({ theme }) => theme.colors.cornflowerBlue};

    @media (max-width: 992px) {
      width: 100%;
      height: 100%;
      border: none;
    }
  `,
};

export const Content = styled('div', variantProp)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  ${({ variant }) => contentCSS[variant]}
`;

export const Information = styled.div`
  margin-bottom: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
`;

export const Label = styled('span', labelProps)`
  font-weight: ${({ isStrong }) => (isStrong ? '600' : '400')};
  font-size: 12px;
  line-height: 15px;
  color: ${({ isFail, theme }) =>
    isFail ? theme.colors.red : theme.colors.highland};
  text-align: center;
  max-width: ${({ isStrong }) => (isStrong ? '320px' : '260px')};
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

export const Actions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 16px;
  button {
    font-size: 14px;
    line-height: 22px;
  }
`;

const validationDetailCSS = {
  default: css`
    flex: 1;
    padding: 20px;
  `,
  circle: css`
    width: 567px;
    padding: 20px 30px 30px;

    @media (max-width: 992px) {
      width: 100%;
    }
  `,
};

export const ValidationDetail = styled('div', variantProp)`
  display: flex;
  flex-direction: column;
  gap: 12px;
  border: 3px dashed ${({ theme }) => theme.colors.cornflowerBlue};
  border-radius: 6px;
  ${({ variant }) => validationDetailCSS[variant]}
`;

export const Head = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  button {
    font-size: 12px;
  }
`;

export const Text = styled.span`
  font-weight: 600;
  font-size: 14px;
  line-height: 18px;
  color: ${({ theme }) => theme.colors.highland};
  text-decoration: underline;
`;

export const TextDanger = styled.span`
  font-weight: 600;
  font-size: 16px;
  line-height: 20px;
  color: ${({ theme }) => theme.colors.red};
`;

export const List = styled.div`
  background: ${({ theme }) => theme.background.wildSand};
  height: 300px;
  padding-top: 12px;
  .ps {
    height: 100%;
    padding-right: 14px;
  }
`;

export const Error = styled.div`
  font-weight: 400;
  font-size: 14px;
  line-height: 18px;
  color: ${({ theme }) => theme.colors.stormGray};
  margin: 0 14px 12px;
  white-space: pre-line;
`;

export const ErrorBlock = styled.div`
  margin-bottom: 18px;
`;

export const ErrorLabel = styled.div`
  font-weight: 600;
`;

export const ErrorText = styled.div`
  margin-top: 5px;
`;
