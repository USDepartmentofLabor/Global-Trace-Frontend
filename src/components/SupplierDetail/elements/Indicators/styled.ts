import styled, { css } from 'vue-styled-components';

const subIndicatorRiskColors = {
  Extreme: css`
    background-color: ${({ theme }) => theme.background.fairPink};
  `,
  High: css`
    background-color: ${({ theme }) => theme.background.serenade};
  `,
  Medium: css`
    background-color: ${({ theme }) => theme.background.bridalHeath};
  `,
  Low: css`
    background-color: ${({ theme }) => theme.background.linkWater};
  `,
  'No weight': css`
    background-color: ${({ theme }) => theme.background.ghost};
  `,
};

const riskStyles = {
  Extreme: css`
    background-color: ${({ theme }) => theme.colors.crail};
    color: ${({ theme }) => theme.colors.white};
  `,
  High: css`
    background-color: ${({ theme }) => theme.colors.treePoppy};
    color: ${({ theme }) => theme.colors.shark};
  `,
  Medium: css`
    background-color: ${({ theme }) => theme.colors.brightSun};
    color: ${({ theme }) => theme.colors.shark};
  `,
  Low: css`
    background-color: ${({ theme }) => theme.colors.jellyBean};
    color: ${({ theme }) => theme.colors.white};
  `,
  'No weight': css`
    background-color: ${({ theme }) => theme.colors.alto};
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
    background-color: ${({ theme }) => theme.background.athensGray};
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
