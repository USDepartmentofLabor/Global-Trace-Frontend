import styled from 'vue-styled-components';
import resources from 'config/resources';

export const Container = styled.div`
  display: flex;
  min-height: 100%;
  flex-direction: column;

  @media (max-width: 576px) {
    padding: 0 16px;
  }
`;

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 30px;

  table {
    tbody tr:hover {
      background-color: ${({ theme }) => theme.background.wildSand};
    }
  }
`;

export const Title = styled.div`
  font-weight: 800;
  text-align: center;
  margin-bottom: 32px;
  font-size: 24px;
  line-height: 30px;
  color: ${(props) => props.theme.colors.highland};
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export const AddNewOrder = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 16px;

  .usdol-icon {
    margin-top: 26px;
  }
`;

export const Col = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20px;
  width: 240px;
`;

export const Loading = styled.div`
  min-height: 180px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;

  @media (max-width: 767px) {
    flex-direction: column;
    margin-bottom: 0;
    align-items: flex-start;
    gap: 16px;
  }
`;

export const TotalOrders = styled.span`
  font-weight: 800;
  font-size: 24px;
  line-height: 30px;
  color: ${({ theme }) => theme.colors.stormGray};
`;

export const EmptyContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 32px;
  margin-top: 63px;
`;

export const EmptyImage = styled.img.attrs({
  src: resources.SUPPLY_CHAIN_EMPTY,
})`
  width: 177px;
  height: 152px;
`;

export const EmptyText = styled.div`
  font-weight: 400;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.stormGray};
`;
