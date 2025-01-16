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
  padding: 0 16px 32px 16px;
  background-color: ${({ theme }) => theme.colors.wildSand};
  width: 100%;
  box-sizing: border-box;
`;

export const Table = styled.div`
  background-color: ${({ theme }) => theme.background.white};
  width: 100%;
  padding: 24px;
  box-sizing: border-box;
  box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.1);

  table {
    thead {
      background-color: ${({ theme }) => theme.background.wildSand};
    }
  }

  @media (max-width: 920px) {
    padding: 14px;
  }
`;

const RiskProp = {
  risk: String,
};

export const Tr = styled.tr`
  td {
    color: ${({ theme }) => theme.colors.shark};
  }
`;

export const Td = styled.td`
  border-top: 1px solid ${({ theme }) => theme.colors.snuff};
  background: transparent;
  line-height: 22px;
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
