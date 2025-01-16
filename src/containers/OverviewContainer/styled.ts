import styled from 'vue-styled-components';
import { RESOURCES } from 'config/constants';

export const Wrapper = styled.div`
  min-height: calc(100svh - 90px);
  padding: 24px;
  box-sizing: border-box;

  background: ${({ theme }) => theme.background.wildSand};

  @media (max-width: 767px) {
    padding: 24px 16px;
    min-height: calc(100svh - 68px);
  }
`;

export const Container = styled.div`
  max-width: 1000px;
  margin: auto;
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
  src: RESOURCES.EMPTY_TRANSACTION,
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
