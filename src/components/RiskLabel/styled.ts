import styled, { css } from 'vue-styled-components';

const rickProps = {
  level: String,
  width: String,
  isUppercase: Boolean,
};

const riskStyles = {
  Extreme: css`
    background-color: ${({ theme }) => theme.colors.persimmon};
  `,
  High: css`
    background-color: ${({ theme }) => theme.colors.red};
  `,
  Medium: css`
    background-color: ${({ theme }) => theme.colors.sandyBrown};
  `,
  Low: css`
    background-color: ${({ theme }) => theme.colors.highland};
  `,
  'No weight': css`
    background-color: ${({ theme }) => theme.colors.alto};
  `,
};

export const Level = styled('div', rickProps)`
  display: inline-block;
  border-radius: 4px;
  word-break: break-word;
  box-sizing: border-box;
  font-weight: 700;
  font-size: 12px;
  text-align: center;
  padding: 5px 20px;
  text-transform: ${({ isUppercase }) =>
    isUppercase ? 'uppercase' : 'inherit'};
  color: ${({ theme }) => theme.colors.white};
  width: ${({ width }) => width};
  ${({ level }) => riskStyles[level]}
`;
