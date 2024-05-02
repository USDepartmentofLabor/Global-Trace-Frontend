import styled, { css } from 'vue-styled-components';

const tabProps = {
  isActive: Boolean,
  level: String,
};

const riskStyles = {
  Extreme: css`
    border-bottom-color: ${({ theme }) => theme.colors.persimmon};
    border-left-color: ${({ theme }) => theme.colors.persimmon};
  `,
  High: css`
    border-bottom-color: ${({ theme }) => theme.colors.red};
    border-left-color: ${({ theme }) => theme.colors.red};
  `,
  Medium: css`
    border-bottom-color: ${({ theme }) => theme.colors.sandyBrown};
    border-left-color: ${({ theme }) => theme.colors.sandyBrown};
  `,
  Low: css`
    border-bottom-color: ${({ theme }) => theme.colors.highland};
    border-left-color: ${({ theme }) => theme.colors.highland};
  `,
  'No weight': css`
    border-bottom-color: ${({ theme }) => theme.colors.alto};
    border-left-color: ${({ theme }) => theme.colors.alto};
  `,
};

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

export const Tabs = styled.div`
  display: flex;

  @media (max-width: 992px) {
    flex-direction: column;
  }
`;

export const Tab = styled('div', tabProps)`
  display: flex;
  flex: 1;
  padding: 16px 14px;
  gap: 16px;
  border-right: 1px solid ${({ theme }) => theme.colors.ghost};
  font-size: 16px;
  font-weight: 700;
  color: ${({ isActive, theme }) =>
    isActive ? theme.colors.stormGray : theme.colors.spunPearl};
  background: ${({ isActive, theme }) =>
    isActive ? theme.background.white : theme.background.wildSand};
  cursor: pointer;
  border-bottom-width: 8px;
  border-bottom-style: solid;
  ${({ level }) => riskStyles[level]}

  @media (max-width: 992px) {
    border-bottom-width: 0;
    border-left-style: solid;
    border-left-width: 8px;
  }
`;

export const ContentWrapper = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  background-color: ${({ theme }) => theme.background.wildSand};
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
