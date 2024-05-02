import styled, { css, keyframes } from 'vue-styled-components';

const WrapperProps = {
  isInline: Boolean,
};

const inlineWrapper = css`
  display: inline-block;
`;

const fullPageWrapper = css`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 100000;
`;

export const Wrapper = styled('div', WrapperProps)`
  ${(props) => (props.isInline ? inlineWrapper : fullPageWrapper)}
`;

const SpinAnimation = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const SpinLoadingProps = {
  size: Number,
  color: Function,
};

export const SpinLoading = styled('div', SpinLoadingProps)`
  display: flex;
  justify-content: center;
  align-items: center;
  width: ${(props) => (props.size ? 'auto' : '100%')};
  padding: ${(props) => (props.size ? 0 : '20px')};
  box-sizing: border-box;

  &:after {
    content: '';
    display: block;
    width: ${(props) => props.size || 30}px;
    height: ${(props) => props.size || 30}px;
    border-color: transparent ${(props) => props.color}
      ${(props) => props.color} transparent;
    border-style: solid;
    border-width: 2px;
    border-radius: 30px;
    backface-visibility: none;
    transform: rotate(0deg);
    animation: ${SpinAnimation} 0.5s linear infinite;
  }
`;
