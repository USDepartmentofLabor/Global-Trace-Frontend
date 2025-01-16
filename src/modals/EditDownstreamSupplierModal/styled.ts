import styled from 'vue-styled-components';

export const Wrapper = styled.div`
  padding: 24px;
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;

  .ps {
    max-height: calc(100vh - 110px);
  }
`;

export const List = styled.div`
  display: flex;
  flex-direction: column;
  padding: 24px 32px;
`;

export const ListItem = styled.div`
  display: flex;
  padding: 16px 0;
  gap: 16px;
  align-items: center;
  border-bottom: 1px solid #ddd;
  color: ${({ theme }) => theme.colors.athensGray};
`;

export const Name = styled.div`
  flex: 1;
  font-size: 14px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.stormGray};
`;

export const Remove = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  border-radius: 8px;
  padding: 8px;
  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => theme.background.wildSand};
  }
`;

export const NodeInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
`;

export const RemoveText = styled.div`
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.manatee};
`;

export const ProductList = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
`;

export const Product = styled.div`
  font-size: 14px;
  font-weight: 400;
  color: ${({ theme }) => theme.colors.stormGray};
  padding: 6px 8px;
  border-radius: 6px;
  border: 1px solid ${({ theme }) => theme.colors.athensGray};
  background-color: ${({ theme }) => theme.background.wildSand};
`;
