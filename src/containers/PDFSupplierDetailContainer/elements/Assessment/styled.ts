import styled from 'vue-styled-components';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 16px;

  & > div:nth-child(2) {
    border-top: none;
  }
`;

export const Container = styled.div`
  position: relative;
  border: 1px solid ${({ theme }) => theme.colors.stormGray};
`;

export const Header = styled.div`
  display: flex;
  gap: 8px;
  padding: 8px 10px;
  background-color: ${({ theme }) => theme.background.hintOfGreen};
  border-bottom: 1px solid ${({ theme }) => theme.colors.stormGray};
`;

export const Label = styled.div`
  flex: 1;
  font-weight: 600;
  font-size: 14px;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.stormGray};
`;

export const Name = styled.div`
  font-size: 14px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.highland};
`;

export const Title = styled.div`
  font-size: 14px;
  font-weight: 600;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.highland};
`;

export const Information = styled.div`
  display: flex;
  padding: 8px 10px;
  flex-direction: column;
  gap: 16px;
`;

export const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  font-weight: 400;
  color: ${({ theme }) => theme.colors.shark};
`;

export const InfoTitle = styled.div`
  font-weight: 400;
  flex: 1;
  color: ${({ theme }) => theme.colors.stormGray};
`;

export const BreakInside = styled.div`
  @media print {
    break-inside: avoid;
  }
`;

export const Group = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
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

export const Table = styled.div`
  display: table;
  border-collapse: collapse;
  border-spacing: 0;
  width: 100%;
`;

export const TableGroup = styled.div`
  display: table-row;
`;

export const TableCell = styled.div`
  display: table-cell;
  padding: 8px;
  border: 1px solid ${({ theme }) => theme.colors.stormGray};
`;
