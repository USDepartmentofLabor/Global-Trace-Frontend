import styled from 'vue-styled-components';
import { RESOURCES } from 'config/constants';

export const Wrapper = styled.div`
  position: relative;
  margin-top: 20px;

  @media print {
    break-inside: avoid;
  }

  &:after {
    position: absolute;
    content: '';
    background-image: url(${RESOURCES.LOGO});
    background-size: 100px 27px;
    top: 25px;
    right: 0;
    width: 100px;
    height: 27px;
  }
`;

export const Number = styled.span`
  font-weight: 400;
  font-size: 36px;
  line-height: 42px;
  color: ${({ theme }) => theme.colors.surfCrest};
`;

export const Header = styled.div`
  height: 18px;
`;

export const Tile = styled.div`
  position: absolute;
  width: 200px;
  height: 15px;
  left: 0;
  top: 45px;
  background-color: ${({ theme }) => theme.background.surfCrest};
`;

export const Title = styled.span`
  position: absolute;
  left: 73px;
  top: 35px;
  font-weight: 600;
  font-size: 20px;
  line-height: 25px;
  text-align: center;
  color: ${({ theme }) => theme.colors.stormGray};
`;
