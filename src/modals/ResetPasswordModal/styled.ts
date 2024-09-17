import styled, { css } from 'vue-styled-components';

export const formProps = {
  variant: String,
};

const formCSS = {
  default: css`
    width: 312px;
    margin: 32px auto 44px;
    gap: 20px;
  `,
  primary: css`
    width: 417px;
    margin: 30px auto 20px;
    row-gap: 10px;
  `,
};

export const Form = styled('div', formProps)`
  margin: 32px auto 44px;
  display: flex;
  flex-direction: column;
  ${({ variant }) => formCSS[variant]}

  @media (max-width: 767px) {
    width: 100%;
    padding: 0 16px;
    box-sizing: border-box;
  }
`;

const actionCSS = {
  default: css`
    width: 100%;
  `,
  primary: css`
    width: 298px;
  `,
};

export const Actions = styled('div', formProps)`
  display: grid;
  row-gap: 4px;
  margin: 20px auto 0;
  ${({ variant }) => actionCSS[variant]}

  @media (max-width: 767px) {
    width: 100%;
    padding: 0 16px;
    box-sizing: border-box;
  }
`;

export const Row = styled.div`
  display: flex;
  flex-direction: column;
`;
