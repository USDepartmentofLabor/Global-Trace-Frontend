import styled from 'vue-styled-components';
import { RESOURCES } from 'config/constants';

export const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 16px;
  padding: 16px 32px 32px 32px;
  background-color: ${({ theme }) => theme.background.white};
  box-sizing: border-box;

  @media screen and (max-width: 768px) {
    padding: 24px;
    width: 100%;
    box-sizing: border-box;
  }
`;

export const Action = styled.div`
  display: flex;
  width: 100%;
  justify-content: flex-end;

  > div {
    flex: 0 0 250px;

    @media (max-width: 576px) {
      flex: 1;
      width: 100%;
    }
  }
`;

export const Title = styled.div`
  display: none;

  @media (max-width: 576px) {
    display: block;
    text-align: center;
    font-weight: 800;
    font-size: 20px;
    line-height: 25px;
    color: ${({ theme }) => theme.colors.envy};
  }
`;

export const Tr = styled('tr', { isActive: Boolean })`
  outline-offset: -2px;
  outline: 2px solid
    ${(props) => (props.isActive ? props.theme.colors.envy : 'transparent')};
  transition: outline 0.2s ease;
  td {
    color: ${({ theme }) => theme.colors.stormGray};
  }
`;

export const Td = styled.td`
  background: transparent;
  line-height: 18px;
  font-weight: 600;
`;

export const Responded = styled('span', { amount: Number })`
  position: relative;
  font-size: 8px;
  font-weight: 400;
  color: ${({ theme }) => theme.colors.stormGray};
  &:after {
    position: relative;
    content: '${(props) => props.amount}';
    margin-left: 4px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background-color: ${({ theme }) => theme.background.stormGray};
    color: ${({ theme }) => theme.colors.white};
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
  src: RESOURCES.SUPPLY_CHAIN_EMPTY,
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

export const List = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 0;
  margin: 0;
`;

export const Item = styled.li`
  list-style: square;
  font-weight: 600;
  font-size: 14px;
  line-height: 18px;
  color: ${({ theme }) => theme.colors.abbey};
`;
