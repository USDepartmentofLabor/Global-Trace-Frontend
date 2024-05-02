import styled from 'vue-styled-components';
import { RESOURCES } from 'config/constants';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  gap: 16px;
  padding: 32px;
  box-sizing: border-box;

  table {
    thead {
      background-color: ${({ theme }) => theme.background.wildSand};
    }
  }
`;
export const EmptyContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 32px;
  margin-top: 80px;
`;

export const EmptyImage = styled.img.attrs({
  src: RESOURCES.TRANSACTION_EMPTY,
})`
  width: 344px;
  height: 186px;
`;

export const EmptyText = styled.div`
  font-weight: 600;
  font-size: 14px;
  line-height: 18px;

  color: ${({ theme }) => theme.colors.abbey};
`;

export const EmptyActions = styled.div`
  max-width: 400px;
  margin: auto;
  display: flex;
  justify-content: center;
  gap: 24px;
`;

export const Tr = styled.tr`
  td {
    color: ${(props) => props.theme.colors.abbey};
  }
`;

export const Td = styled.td`
  border-top: 1px solid ${({ theme }) => theme.colors.snuff};
  background: transparent;
  line-height: 22px;
`;

export const RowActions = styled.div`
  display: flex;
  border-left: 1px solid ${({ theme }) => theme.colors.ghost};
  justify-content: space-between;
  padding: 0 10px;

  button span:not(.usdol-icon) {
    text-decoration: underline;
  }
`;

export const ProductAttributes = styled.div`
  display: flex;
  gap: 14px;
  font-size: 14px;
  font-weight: 400;
`;

export const HeaderAction = styled.div`
  width: 100%;
  display: flex;
`;

export const TableHeader = styled.div`
  width: 100%;
  display: flex;
  gap: 16px;
`;
