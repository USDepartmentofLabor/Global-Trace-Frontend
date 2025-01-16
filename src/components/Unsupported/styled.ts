import styled from 'vue-styled-components';
import { RESOURCES } from 'config/constants';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 24px;
  padding: 16px;
  height: 100%;
`;

export const Body = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 8px;
  text-align: center;
`;

export const Image = styled.img.attrs({
  src: RESOURCES.RESPONSIVE_DEVICE,
})`
  width: 121px;
  height: 121px;
`;

export const Title = styled.div`
  font-size: 12px;
  font-weight: 400;
  line-height: 16px;
  color: ${({ theme }) => theme.colors.black};
`;

export const Description = styled.div`
  font-size: 14px;
  font-weight: 700;
  line-height: 18px;
  color: ${({ theme }) => theme.colors.stormGray};
`;
