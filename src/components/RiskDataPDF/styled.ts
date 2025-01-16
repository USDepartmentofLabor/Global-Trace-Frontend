import styled from 'vue-styled-components';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Content = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  justify-content: space-between;
  border-top: 1px solid ${({ theme }) => theme.colors.ghost};

  @media print {
    break-inside: avoid;
  }
`;

export const Title = styled.div`
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.shark};

  @media print {
    break-inside: avoid;
  }
`;

export const Sources = styled.div`
  display: flex;
  gap: 8px;
  padding: 8px;
  flex-wrap: wrap;
`;
