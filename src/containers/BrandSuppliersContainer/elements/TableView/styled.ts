import styled, { css } from 'vue-styled-components';

const riskStyles = {
  high: css`
    color: ${({ theme }) => theme.colors.red};
  `,
  medium: css`
    color: ${({ theme }) => theme.colors.sandyBrown};
  `,
  low: css`
    color: ${({ theme }) => theme.colors.envy};
  `,
};

export const Wrapper = styled.div`
  display: flex;
`;

export const TableContainer = styled.div`
  display: flex;
  padding: 18px 16px 0 16px;
  width: 100%;
  box-sizing: border-box;
`;

const RiskProp = {
  risk: String,
};

export const Td = styled.td`
  background: transparent;
  font-weight: 400;
  font-size: 14px;
  line-height: 18px;
`;

export const Tr = styled.tr`
  padding: 21px 14px;
  cursor: pointer;
`;

export const RiskAssessment = styled('div', RiskProp)`
  font-weight: 700;
  font-size: 16px;
  line-height: 20px;
  text-transform: uppercase;
  ${({ risk }) => riskStyles[risk]}
`;

export const Action = styled.div`
  display: flex;
  justify-content: flex-end;
`;
