import styled, { css } from 'vue-styled-components';

const tabProps = {
  isActive: Boolean,
  isEnable: Boolean,
};

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const TabHeader = styled.div`
  display: flex;
  width: 100%;
  border-bottom: 3px solid ${({ theme }) => theme.colors.wildSand};
`;

export const Tab = styled('div', tabProps)`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  gap: 8px;
  padding: 8px;
  cursor: ${({ isEnable }) => (isEnable ? 'pointer' : 'not-allowed')};
  pointer-events: ${({ isEnable }) => (isEnable ? 'inherit' : 'none')};
  border-color: ${({ isEnable, theme }) =>
    isEnable ? theme.colors.highland : 'transparent'};
  border-bottom-width: ${({ isEnable }) => (isEnable ? '3px' : '0px')};
  border-bottom-style: solid;
  border-right: 1px solid
    ${({ isEnable, theme }) =>
      isEnable ? theme.colors.highland : theme.colors.wildSand};
  background-color: ${({ isActive, isEnable, theme }) => {
    if (isActive) {
      return theme.background.white;
    } else if (isEnable) {
      return theme.background.surfCrest;
    }
    return theme.background.alabaster;
  }};
  color: ${({ isEnable, isActive, theme }) => {
    if (isActive) {
      return theme.colors.stormGray;
    } else if (isEnable) {
      return theme.colors.highland;
    }
    return theme.colors.stormGray;
  }};

  &:last-child {
    border-right: 0;
  }
`;

export const TabName = styled('div', tabProps)`
  font-size: 14px;
  font-weight: 400;
  line-height: 18px;
`;

const ActiveTabStyles = css`
  position: relative;
  opacity: 1;
  max-height: auto;
  transform: translateX(0);
  transition: all 0.3s ease;
`;

const HiddenTabStyles = css`
  position: absolute;
  opacity: 0;
  max-height: 0;
  transform: translateY(10px);
  transition: none;
  overflow: hidden;
`;

export const TabContent = styled('div', tabProps)`
  flex: 1 1 auto;
  ${({ isActive }) => (isActive ? ActiveTabStyles : HiddenTabStyles)};
`;

export const ContentWrapper = styled.div`
  width: 100%;
  position: relative;
`;
