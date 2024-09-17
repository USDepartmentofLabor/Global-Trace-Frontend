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

    tr {
      td {
        height: 34px;
        vertical-align: middle;
        word-break: break-word;
      }
    }
  }
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

export const Back = styled.div`
  display: flex;
  gap: 10px;
  cursor: pointer;
`;

export const Link = styled.div`
  font-weight: 400;
  font-size: 14px;
  text-decoration: underline;

  color: ${(props) => props.theme.colors.stormGray};
`;

export const HeaderActionContent = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: space-between;
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
  font-weight: 400;
  font-size: 14px;
  line-height: 18px;

  color: ${({ theme }) => theme.colors.ghost};
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

export const List = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 0;
  margin: 0 26px;
`;

export const Item = styled.li`
  list-style: square;
  font-weight: 400;
  font-size: 14px;
  line-height: 18px;
  color: ${({ theme }) => theme.colors.easyBay};
`;

export const Label = styled.div`
  font-weight: 600;
  font-size: 14px;
  line-height: 18px;
  color: ${({ theme }) => theme.colors.easyBay};
`;

export const PermissionContent = styled.div`
  display: flex;
  gap: 8px;
`;

export const PermissionSet = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
`;

export const PermissionGroup = styled.div`
  padding: 8px;
  border: 1px solid ${({ theme }) => theme.colors.ghost};
  border-radius: 4px;
`;

export const PermissionGroupName = styled.div`
  font-weight: 600;
  font-size: 12px;
  line-height: 15px;
  margin-bottom: 8px;
  color: ${({ theme }) => theme.colors.spunPearl};
`;
