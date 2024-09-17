import styled, { css } from 'vue-styled-components';

const wrapperProps = {
  direction: String,
};

export const Wrapper = styled('div', wrapperProps)`
  display: flex;
  flex-direction: ${({ direction }) => direction}
  align-items: center;
  gap: 10px;
`;

const rickProps = {
  level: String,
  width: String,
  isUppercase: Boolean,
  hasDot: Boolean,
};

const riskStyles = {
  Extreme: css`
    background-color: ${({ theme }) => theme.colors.crail};
  `,
  High: css`
    background-color: ${({ theme }) => theme.colors.treePoppy};
  `,
  Medium: css`
    background-color: ${({ theme }) => theme.colors.brightSun};
  `,
  Low: css`
    background-color: ${({ theme }) => theme.colors.jellyBean};
  `,
  'No weight': css`
    background-color: ${({ theme }) => theme.colors.alto};
  `,
};

export const Dot = styled('div', rickProps)`
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  border-radius: 2px;
  ${({ level }) => riskStyles[level]}
`;

export const Level = styled('div', rickProps)`
  display: inline-block;
  border-radius: 4px;
  word-break: break-word;
  box-sizing: border-box;
  font-weight: ${({ hasDot }) => (hasDot ? 400 : 700)};
  font-size: 12px;
  text-align: center;
  padding: ${({ hasDot }) => (hasDot ? 'inherit' : '5px 20px')};
  text-transform: ${({ isUppercase }) =>
    isUppercase ? 'uppercase' : 'inherit'};
  color: ${({ hasDot, theme }) =>
    hasDot ? theme.colors.shark : theme.colors.white};
  width: ${({ width }) => width};
  ${({ hasDot, level }) => (!hasDot ? riskStyles[level] : '')}
`;
