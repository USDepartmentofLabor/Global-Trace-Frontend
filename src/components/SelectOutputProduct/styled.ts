import styled from 'vue-styled-components';

export const Wrapper = styled.div`
  padding: 24px;
`;

export const Loading = styled.div`
  display: flex;
  justify-content: center;
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;

  .ps {
    max-height: 190px;
  }
`;

export const List = styled.div`
  display: flex;
  flex-direction: column;
`;

export const ListItem = styled.div`
  display: flex;
  padding: 16px;
  gap: 16px;
  align-items: center;
  border-bottom: 1px solid #ddd;
  color: ${({ theme }) => theme.colors.athensGray};
`;

export const Name = styled.div`
  flex: 1;
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.shark};
`;
