import styled from 'vue-styled-components';
import { RESOURCES } from 'config/constants';

export const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 27px 40px;

  table {
    thead {
      background-color: ${({ theme }) => theme.background.wildSand};
    }
  }

  @media (max-width: 920px) {
    padding: 14px;
  }
`;

export const HeaderAction = styled.div`
  width: 100%;
  display: flex;
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
`;

export const EmptyData = styled.div`
  min-height: 180px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
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

export const Quantity = styled.div`
  font-weight: 600;
  font-size: 16px;

  color: ${({ theme }) => theme.colors.abbey};
`;

export const QRCodeEmptyImage = styled.img.attrs({
  src: RESOURCES.HISTORY_EMPTY,
})`
  width: 263px;
  height: 263px;
`;

export const EmptyContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 86px;
`;

export const EmptyText = styled.div`
  font-weight: 600;
  font-size: 14px;
  text-align: center;
  white-space: pre;
  margin-bottom: 28px;

  color: ${({ theme }) => theme.colors.abbey};
`;

export const Content = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: 20px;
`;

export const TableHeader = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
`;

export const Title = styled.div`
  font-weight: 800;
  font-size: 20px;

  color: ${({ theme }) => theme.colors.spunPearl};
`;
