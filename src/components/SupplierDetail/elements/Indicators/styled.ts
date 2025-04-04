import styled, { css } from 'vue-styled-components';
import { LevelRiskCategoryEnum } from 'enums/saq';
import { getRiskBackgroundColor, getRiskColor } from 'utils/risk-assessment';

const subIndicatorRiskColors = {
  [LevelRiskCategoryEnum.EXTREME]: css`
    background-color: ${({ theme }) =>
      theme.background[getRiskBackgroundColor(LevelRiskCategoryEnum.EXTREME)]};
  `,
  [LevelRiskCategoryEnum.HIGH]: css`
    background-color: ${({ theme }) =>
      theme.background[getRiskBackgroundColor(LevelRiskCategoryEnum.HIGH)]};
  `,
  [LevelRiskCategoryEnum.MEDIUM]: css`
    background-color: ${({ theme }) =>
      theme.background[getRiskBackgroundColor(LevelRiskCategoryEnum.MEDIUM)]};
  `,
  [LevelRiskCategoryEnum.LOW]: css`
    background-color: ${({ theme }) =>
      theme.background[getRiskBackgroundColor(LevelRiskCategoryEnum.LOW)]};
  `,
  [LevelRiskCategoryEnum.NO_WEIGHT]: css`
    background-color: ${({ theme }) =>
      theme.background[
        getRiskBackgroundColor(LevelRiskCategoryEnum.NO_WEIGHT)
      ]};
  `,
};

const riskStyles = {
  [LevelRiskCategoryEnum.EXTREME]: css`
    background-color: ${({ theme }) =>
      theme.colors[getRiskColor(LevelRiskCategoryEnum.EXTREME)]};
    color: ${({ theme }) => theme.colors.white};
  `,
  [LevelRiskCategoryEnum.HIGH]: css`
    background-color: ${({ theme }) =>
      theme.colors[getRiskColor(LevelRiskCategoryEnum.HIGH)]};
    color: ${({ theme }) => theme.colors.shark};
  `,
  [LevelRiskCategoryEnum.MEDIUM]: css`
    background-color: ${({ theme }) =>
      theme.colors[getRiskColor(LevelRiskCategoryEnum.MEDIUM)]};
    color: ${({ theme }) => theme.colors.shark};
  `,
  [LevelRiskCategoryEnum.LOW]: css`
    background-color: ${({ theme }) =>
      theme.colors[getRiskColor(LevelRiskCategoryEnum.LOW)]};
    color: ${({ theme }) => theme.colors.white};
  `,
  [LevelRiskCategoryEnum.NO_WEIGHT]: css`
    background-color: ${({ theme }) =>
      theme.colors[getRiskColor(LevelRiskCategoryEnum.NO_WEIGHT)]};
    color: ${({ theme }) => theme.colors.shark};
  `,
};

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px;
`;

const indicatorProps = {
  level: String,
  isExpanded: Boolean,
};

export const Indicator = styled.div`
  display: flex;
  background-color: ${({ theme }) => theme.background.white};
  box-shadow: ${({ theme }) => theme.colors.blackTransparent1} 1px 2px 2px;
  border-top: 1px solid ${({ theme }) => theme.colors.athensGray};
  border-radius: 2px;

  .indicator {
    margin-bottom: 0;
    flex: 1;
  }
`;

export const RiskLabel = styled('div', indicatorProps)`
  flex: none;
  width: 8px;
  border-top-left-radius: 2px;
  border-bottom-left-radius: 2px;
  ${({ level }) => riskStyles[level]}
`;

const expandedTitleStyles = css`
  background-color: ${({ theme }) => theme.background.wildSand};
  border-bottom: 1px solid ${({ theme }) => theme.colors.athensGray};
`;

const hoverTitleStyles = css`
  &:hover {
    background-color: ${({ theme }) => theme.background.athensGray2};
  }
`;

export const IndicatorTitle = styled('div', indicatorProps)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex: 1;
  padding: 12px 16px;
  font-weight: 600;
  font-size: 14px;
  line-height: 20px;
  color: ${({ theme }) => theme.colors.stormGray};
  cursor: pointer;
  user-select: none;
  background-color: ${({ theme }) => theme.background.white};

  ${({ isExpanded }) => isExpanded && expandedTitleStyles}
  ${({ isExpanded }) => !isExpanded && hoverTitleStyles}
`;

export const IndicatorContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;

  .ps {
    max-height: 192px;
  }
`;

export const Arrow = styled.div`
  transform: rotate(90deg);
`;

export const IndicatorAction = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
`;

export const SubIndicatorContent = styled('div', indicatorProps)`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px 24px;
  ${({ level }) => subIndicatorRiskColors[level]}
`;

export const SubIndicatorTitle = styled('div', indicatorProps)`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 16px;
  font-weight: 600;
  font-size: 14px;
  line-height: 20px;
  border-top-left-radius: 2px;
  border-bottom-left-radius: 2px;
  cursor: pointer;
  user-select: none;
  ${({ isExpanded }) =>
    isExpanded &&
    css`
      background-color: ${({ theme }) => theme.background.wildSand};
    `}
`;

export const RiskTitle = styled.div`
  flex: 1;
`;

export const RiskContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;

  @media print {
    break-inside: avoid;
  }

  @media (max-width: 992px) {
    padding: 0 8px;
  }
`;

export const RiskItemActions = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
`;

export const AssignCAP = styled.div`
  font-weight: 600;
  font-size: 14px;
  line-height: 20px;
  color: ${({ theme }) => theme.colors.highland};
`;

export const RiskItem = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 12px;
  font-weight: 600;
  line-height: 16px;
  color: ${({ theme }) => theme.colors.stormGray};
`;

export const SubIndicator = styled.div`
  &:not(:last-child) {
    border-bottom: 1px solid ${({ theme }) => theme.colors.athensGray};
  }
`;

export const Tag = styled('div', indicatorProps)`
  padding: 4px 16px;
  border-radius: 2px;
  font-weight: 700;
  font-size: 12px;
  line-height: 16px;
  ${({ level }) => riskStyles[level]}
`;

export const ReportContent = styled.span``;

export const ViewDetail = styled.span`
  font-size: 16px;
  font-weight: 400;
  flex-shrink: 0;
  color: ${({ theme }) => theme.colors.highland};
  cursor: pointer;
`;
