import styled, { css, keyframes } from 'vue-styled-components';

const buttonProps = {
  width: String,
  variant: String,
  size: String,
  textAlign: String,
  label: String,
  isLoading: Boolean,
  iconPosition: String,
};

const loadingProps = {
  variant: String,
  size: String,
};

const sizeStyles = {
  large: css`
    height: 56px;
    font-size: 14px;
  `,
  medium: css`
    height: 40px;
    font-size: 16px;
  `,
  extraMedium: css`
    height: 38px;
    font-size: 14px;
  `,
  small: css`
    height: 32px;
    font-size: 12px;
  `,
  tiny: css`
    height: 25px;
    font-size: 10px;
  `,
};

const textAlignStyles = {
  left: css`
    justify-content: start;
  `,
  center: css`
    justify-content: center;
  `,
  right: css`
    justify-content: end;
  `,
};

const buttonVariantStyles = {
  primary: css`
    color: ${({ theme }) => theme.colors.white};
    background-color: ${({ theme }) => theme.background.envy};
  `,
  outlinePrimary: css`
    color: ${({ theme }) => theme.colors.envy};
    background-color: ${({ theme }) => theme.background.white};
    border: 1px solid ${({ theme }) => theme.background.envy};
  `,
  transparentPrimary: css`
    color: ${({ theme }) => theme.colors.highland};
    background-color: transparent;
  `,
  transparentSecondary: css`
    color: ${({ theme }) => theme.colors.abbey};
    background-color: transparent;
    .usdol-icon {
      color: ${({ theme }) => theme.colors.highland};
    }
  `,
  warning: css`
    color: ${({ theme }) => theme.colors.white};
    background-color: ${({ theme }) => theme.background.sandyBrown};
  `,
  transparentWarning: css`
    color: ${({ theme }) => theme.colors.sandyBrown};
    background-color: transparent;
  `,
  lightWarning: css`
    color: ${({ theme }) => theme.colors.sandyBrown};
    background-color: ${({ theme }) => theme.background.white};
  `,
  danger: css`
    color: ${({ theme }) => theme.colors.white};
    background-color: ${({ theme }) => theme.background.alizarinCrimson};
  `,
  outlineDanger: css`
    border: 1px solid ${({ theme }) => theme.colors.alizarinCrimson};
    color: ${({ theme }) => theme.colors.alizarinCrimson};
    background-color: ${({ theme }) => theme.background.white};
  `,
};

const hoverCSS = {
  primary: css`
    &:hover {
      color: ${({ theme }) => theme.colors.white};
      background-color: ${({ theme }) => theme.background.surfCrest};
    }
  `,
  outlinePrimary: css`
    &:hover {
      color: ${({ theme }) => theme.colors.envy};
      background-color: ${({ theme }) => theme.background.wildSand};
      border: 1px solid ${({ theme }) => theme.colors.envy};
    }
  `,
  transparentPrimary: css`
    &:hover {
      background-color: ${({ theme }) => theme.background.wildSand};
    }
  `,
  transparentSecondary: css`
    &:hover {
      background-color: ${({ theme }) => theme.background.wildSand};
    }
  `,
};

const activeCSS = {
  primary: css`
    &:active {
      color: ${({ theme }) => theme.colors.white};
      background-color: ${({ theme }) => theme.background.highland};
    }
  `,
  outlinePrimary: css`
    &:active {
      color: ${({ theme }) => theme.colors.white};
      background-color: ${({ theme }) => theme.background.highland};
    }
  `,
  transparentPrimary: css`
    &:active {
      background-color: ${({ theme }) => theme.colors.surfCrest};
    }
  `,
  transparentSecondary: css`
    &:active {
      background-color: ${({ theme }) => theme.colors.surfCrest};
    }
  `,
};

const disabledCSS = {
  outlinePrimary: css`
    &:disabled {
      background-color: ${({ theme }) => theme.background.white};
      color: ${({ theme }) => theme.colors.spunPearl};
      border-color: ${({ theme }) => theme.colors.spunPearl};
    }
  `,
  outlineDanger: css`
    &:disabled {
      background-color: ${({ theme }) => theme.background.white};
      color: ${({ theme }) => theme.colors.spunPearl};
      border-color: ${({ theme }) => theme.colors.spunPearl};
    }
  `,
};

const iconPosition = {
  prefix: css`
    margin-right: ${({ label }) => (label ? '5px' : 0)};
  `,
  suffix: css`
    margin-left: ${({ label }) => (label ? '5px' : 0)};
  `,
};

export const Wrapper = styled('div', buttonProps)`
  button {
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: none;
    cursor: pointer;
    user-select: none;
    box-sizing: border-box;
    padding: 8px 16px;
    border: none;
    width: ${(props) => props.width};
    border-radius: 8px;
    line-height: 0;
    white-space: pre;

    .usdol-icon {
      opacity: ${(props) => (props.isLoading ? '0' : '1')};
      ${(props) => iconPosition[props.iconPosition]}
    }

    ${(props) => sizeStyles[props.size]}
    ${(props) => textAlignStyles[props.textAlign]}
    ${(props) => buttonVariantStyles[props.variant]}
    ${(props) => hoverCSS[props.variant]}
    ${(props) => activeCSS[props.variant]}
    ${(props) => disabledCSS[props.variant]}

    &:disabled {
      cursor: not-allowed;
      pointer-events: none;
      background-color: ${({ theme }) => theme.background.ghost};
      color: ${({ theme }) => theme.background.white};
    }
  }
`;

const LoadingAnimation = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const loadingBorderColor = css`
  border-color: transparent ${({ theme }) => theme.colors.white}
    ${({ theme }) => theme.colors.white} transparent;
`;

const outlinePrimaryStyle = css`
  border-color: transparent ${({ theme }) => theme.colors.envy}
    ${({ theme }) => theme.colors.envy} transparent;
`;

const loadingVariantStyles = {
  outlinePrimary: outlinePrimaryStyle,
};

export const Loading = styled('span', loadingProps)`
  display: block;
  width: 16px;
  height: 16px;
  ${loadingBorderColor}
  border-style: solid;
  border-width: 2px;
  border-radius: 16px;
  backface-visibility: none;
  transform: rotate(0deg);
  animation: ${LoadingAnimation} 0.5s linear infinite;
  ${(props) => loadingVariantStyles[props.variant]}
`;

const labelProps = {
  underline: Boolean,
};

export const Label = styled('span', labelProps)`
  text-decoration: ${(props) => (props.underline ? 'underline' : 'inherit')};
`;
