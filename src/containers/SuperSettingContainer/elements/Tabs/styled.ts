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
  width: 100%;
  gap: 24px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.ghost};
`;

export const Tab = styled('div', tabProps)`
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
  padding-bottom: 8px;
  cursor: pointer;
  color: ${({ isActive, theme }) =>
    isActive ? theme.colors.stormGray : theme.colors.ghost};
  border-bottom: 3px solid
    ${({ isActive, theme }) =>
      isActive ? theme.colors.highland : 'transparent'};
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
