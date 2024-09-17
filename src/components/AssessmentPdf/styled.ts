import styled, { css } from 'vue-styled-components';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const Title = styled.div`
  font-size: 14px;
  font-weight: 600;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.highland};
`;

export const Group = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 16px;
`;

export const Issue = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Report = styled.div`
  font-size: 11px;
  font-weight: 400;
  margin-left: 30px;
  color: ${({ theme }) => theme.colors.stormGray};
`;

const tableProps = {
  isGroup: Boolean,
};

const tableGroupCss = css`
  tr:not(:first-child) {
    td:first-child {
      visibility: hidden;
      border-left-color: transparent;
      border-bottom-color: transparent;
    }
  }
`;

export const Table = styled('table', tableProps)`
  display: table;
  border-collapse: collapse;
  border-spacing: 0;
  width: 100%;
  ${({ isGroup }) => isGroup && tableGroupCss}
`;

export const TableRow = styled.tr`
  display: table-row;
`;

export const TableCell = styled.td`
  width: 50%;
  display: table-cell;
  padding: 8px;
  border: 1px solid ${({ theme }) => theme.colors.ghost};
`;

export const RiskIndicator = styled.div`
  display: flex;
  gap: 8px;
  justify-content: space-between;
`;

export const Text = styled.div`
  margin-top: 4px;
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.stormGray};
`;
