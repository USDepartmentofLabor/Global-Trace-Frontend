import styled, { css } from 'vue-styled-components';

export const dotStyles = {
  mute: css`
    background-color: ${({ theme }) => theme.colors.ghost};
  `,
  danger: css`
    background-color: ${({ theme }) => theme.colors.red};
  `,
  warning: css`
    background-color: ${({ theme }) => theme.colors.sandyBrown};
  `,
};

export const Reason = styled('div', { variant: String })`
  position: relative;
  padding-left: 15px;
  &:before {
    position: absolute;
    top: 5px;
    left: 0;
    content: '';
    display: block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    ${(props) => dotStyles[props.variant]};
  }
`;
