import styled, { css, keyframes } from 'vue-styled-components';

const contentProps = {
  type: String,
  showIcon: Boolean,
  icon: String,
};

const showToastAnimation = keyframes`
  from  {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
`;

export const Wrapper = styled.div`
  display: flex;
  align-items: center;
  border-radius: 4px;
  box-shadow: 0px 2px 4px rgba(202, 202, 202, 0.5),
    0px 1px 4px rgba(218, 218, 224, 0.4);
  padding: 8px 16px;
  max-width: 735px;
  justify-content: space-between;
  animation-name: ${showToastAnimation};
  animation-duration: 150ms;
  cursor: pointer;
`;

const iconStyles = {
  success: css`
    color: ${({ theme }) => theme.colors.envy};
  `,
  error: css`
    color: ${({ theme }) => theme.colors.red};
  `,
};

const iconCSS = css`
  &:before {
    font-family: 'font-icons';
    font-size: ${(props) => (props.size === 'large' ? '20px' : '16px')};
    height: 20px;
    width: 20px;
    margin-right: 6px;
    display: flex;
    align-items: center;
    content: '${(props) => props.icon}';
    ${(props) => iconStyles[props.type]};
  }
`;

export const Content = styled('label', contentProps)`
  display: flex;
  align-items: center;
  font-size: 16px;
  line-height: 24px;
  ${({ showIcon, icon }) => showIcon && icon && iconCSS}
  color: ${({ theme }) => theme.colors.stormGray};
  font-weight: 600;
`;
