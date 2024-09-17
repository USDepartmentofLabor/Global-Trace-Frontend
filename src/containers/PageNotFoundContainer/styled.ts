import styled from 'vue-styled-components';
import { RESOURCES } from 'config/constants';

export const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  margin-top: 70px;
`;

export const Content = styled.div`
  position: relative;
`;

export const Img = styled.img.attrs({
  src: RESOURCES.NOT_FOUND,
})`
  display: block;
  width: 921px;
  height: 261px;
  margin-top: 70px;
`;

export const LabelContainer = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  width: 100%;
  bottom: -15px;
`;

export const Label = styled.span`
  font-weight: 800;
  font-size: 80px;
  color: ${({ theme }) => theme.colors.envy};
`;

export const Description = styled.div`
  margin: 25px auto 0;
  font-size: 24px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.stormGray};
`;

export const Action = styled.div`
  display: flex;
  margin-top: 54px;
  justify-content: center;
`;
