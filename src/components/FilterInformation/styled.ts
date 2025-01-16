import styled from 'vue-styled-components';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  @media print {
    break-inside: avoid;
  }
`;

export const FilterItem = styled.div`
  display: flex;
  gap: 12px;
`;

export const Label = styled.div`
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.highland};
  width: 110px;
`;

export const List = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  flex: 1;
`;

export const Item = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  font-size: 14px;
  font-weight: 400;
  border-radius: 4px;
  border: 1px solid ${({ theme }) => theme.colors.whiteLilac};
  background: ${({ theme }) => theme.colors.white};
`;

export const CloseIcon = styled.div`
  cursor: pointer;
`;

export const PdfGroup = styled.div`
  display: flex;
  gap: 12px;
  justify-content: space-between;
`;

export const PdfLabel = styled.div`
  font-weight: 400;
  font-size: 12px;
  flex: 1;
  color: ${({ theme }) => theme.colors.stormGray};
`;

export const PdfValue = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  font-weight: 400;
  text-align: right;
  color: ${({ theme }) => theme.colors.shark};
`;
