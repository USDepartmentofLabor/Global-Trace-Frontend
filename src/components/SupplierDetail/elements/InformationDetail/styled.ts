import styled, { css } from 'vue-styled-components';
import { LevelRiskCategoryEnum } from 'enums/saq';
import { getRiskColor } from 'utils/risk-assessment';

const tabProps = {
  isActive: Boolean,
  level: String,
};

const riskStyles = {
  [LevelRiskCategoryEnum.EXTREME]: css`
    border-left-color: ${({ theme }) =>
      theme.colors[getRiskColor(LevelRiskCategoryEnum.EXTREME)]};
  `,
  [LevelRiskCategoryEnum.HIGH]: css`
    border-left-color: ${({ theme }) =>
      theme.colors[getRiskColor(LevelRiskCategoryEnum.HIGH)]};
  `,
  [LevelRiskCategoryEnum.MEDIUM]: css`
    border-left-color: ${({ theme }) =>
      theme.colors[getRiskColor(LevelRiskCategoryEnum.MEDIUM)]};
  `,
  [LevelRiskCategoryEnum.LOW]: css`
    border-left-color: ${({ theme }) =>
      theme.colors[getRiskColor(LevelRiskCategoryEnum.LOW)]};
  `,
  [LevelRiskCategoryEnum.NO_WEIGHT]: css`
    border-left-color: ${({ theme }) =>
      theme.colors[getRiskColor(LevelRiskCategoryEnum.NO_WEIGHT)]};
  `,
};

export const Wrapper = styled.div`
  display: flex;
  flex: 1;
  min-height: calc(100vh - 206px);
  background-color: ${({ theme }) => theme.background.white};

  @media (max-width: 992px) {
    flex-direction: column;
  }
`;

export const Tabs = styled.div`
  display: flex;
  flex-direction: column;
  border-right: 1px solid ${({ theme }) => theme.colors.ghost};
`;

export const Tab = styled('div', tabProps)`
  width: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 16px 14px;
  gap: 16px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.ghost};
  font-size: 16px;
  font-weight: 700;
  color: ${({ isActive, theme }) =>
    isActive ? theme.colors.stormGray : theme.colors.spunPearl};
  background: ${({ isActive, theme }) =>
    isActive ? theme.background.white : theme.background.wildSand};
  cursor: pointer;
  border-left-width: 8px;
  border-left-style: solid;
  ${({ level }) => riskStyles[level]}

  @media (max-width: 992px) {
    width: inherit;
  }
`;

export const Icon = styled.img`
  width: 70px;
  height: 70px;
`;

export const ContentWrapper = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
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
