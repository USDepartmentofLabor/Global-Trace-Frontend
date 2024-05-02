import styled from 'vue-styled-components';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 24px;

  @media print {
    break-inside: avoid;
  }
`;

export const Title = styled.li`
  font-size: 11px;
  font-weight: 300;
  margin-bottom: 6px;
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
