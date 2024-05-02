import styled, { css } from 'vue-styled-components';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

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

const riskProps = {
  level: String,
};

export const Title = styled('div', riskProps)`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.white};
  ${({ level }) => riskStyles[level]}
`;

export const Sources = styled.div`
  display: flex;
  gap: 8px;
  padding: 8px;
  flex-wrap: wrap;
`;
