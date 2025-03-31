import styled, { css } from 'vue-styled-components';

const navigationProps = {
  isActive: Boolean,
};

export const Wrapper = styled.div`
  display: grid;
  justify-content: center;
  grid-auto-flow: column;
  grid-gap: 75px;
`;

const activeStyled = css`
  &:after {
    content: '';
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 4px;
    border-radius: 4px;
    background-color: ${({ theme }) => theme.background.highland};
  }
`;

export const Navigation = styled('div', navigationProps)`
  position: relative;
  padding: 0 20px 16px;
  cursor: pointer;
  font-size: 16px;
  line-height: 20px;
  font-weight: ${(props) => (props.isActive ? 700 : 600)};
  color: ${(props) =>
    props.isActive
      ? props.theme.colors.highland
      : props.theme.colors.stormGray};

  ${(props) => props.isActive && activeStyled}
`;
