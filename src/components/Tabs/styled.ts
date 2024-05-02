import styled, { css } from 'vue-styled-components';

const tabProps = {
  isActive: Boolean,
};

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const TabHeader = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  gap: 4px;
  padding: 4px;
  border-radius: 4px;
  background: ${({ theme }) => theme.background.wildSand};
`;

export const Tab = styled('div', tabProps)`
  width: 100%;
  padding: 6px;
  border-radius: 4px;
  font-weight: 600;
  font-size: 16px;
  line-height: 20px;
  text-align: center;
  cursor: pointer;
  color: ${({ isActive, theme }) =>
    isActive ? theme.colors.highland : theme.colors.spunPearl};
  background: ${({ isActive, theme }) =>
    isActive ? theme.background.surfCrest : 'transparent'};
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
  margin-top: 10px;
  position: relative;
`;
