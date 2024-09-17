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
  `,
  High: css`
    background-color: ${({ theme }) => theme.colors.treePoppy};
  `,
  Medium: css`
    background-color: ${({ theme }) => theme.colors.brightSun};
  `,
  Low: css`
    background-color: ${({ theme }) => theme.colors.jellyBean};
  `,
  'No weight': css`
    background-color: ${({ theme }) => theme.colors.alto};
  `,
};

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  box-shadow: 0px 1px 2px 0px ${({ theme }) => theme.colors.blackTransparent6};
  box-shadow: 0px 1px 3px 0px ${({ theme }) => theme.colors.blackTransparent1};
`;

const indicatorProps = {
  level: String,
  isExpanded: Boolean,
};

export const Indicator = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.background.white};
  border-top: 1px solid ${({ theme }) => theme.colors.athensGray};
  border-radius: 8px;
`;

export const RiskLabel = styled('div', indicatorProps)`
  position: absolute;
  width: 8px;
  height: 100%;
  border-top-left-radius: 8px;
  border-bottom-left-radius: 8px;
  ${({ level }) => riskStyles[level]}
`;

export const IndicatorTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex: 1;
  padding: 12px 16px;
  font-weight: 600;
  font-size: 14px;
  line-height: 20px;
  color: ${({ theme }) => theme.colors.stormGray};
  background-color: ${({ theme }) => theme.background.white};
  border-bottom: 1px solid ${({ theme }) => theme.colors.athensGray};
  border-radius: 8px;
`;

export const IndicatorContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding-left: 8px;
`;

export const SubIndicatorContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  border-bottom-right-radius: 8px;
`;

export const SubIndicatorTitle = styled('div', indicatorProps)`
  display: flex;
  align-items: center;
  gap: 16px;
  padding-bottom: 16px;
  font-weight: 600;
  font-size: 14px;
  line-height: 20px;
  border-bottom: 1px solid ${({ theme }) => theme.background.athensGray};
  ${({ level }) => subIndicatorRiskColors[level]}
`;

export const RiskTitle = styled.div`
  flex: 1;
`;

export const RiskContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;

  &:first-child {
    margin-top: 16px;
  }
`;

export const RiskItem = styled.div`
  display: flex;
  gap: 16px;
`;

export const SubIndicator = styled('div', indicatorProps)`
  padding: 16px;
  border-bottom-right-radius: 8px;
  ${({ level }) => subIndicatorRiskColors[level]}

  &:not(:last-child) {
    border-bottom: 1px solid ${({ theme }) => theme.colors.athensGray};
  }
`;

export const Tag = styled('div', indicatorProps)`
  padding: 4px 8px;
  border-radius: 4px;
  font-weight: 700;
  font-size: 10px;
  line-height: 16px;
  text-align: center;
  color: ${({ theme }) => theme.colors.white};
  ${({ level }) => riskStyles[level]}
`;

export const ReportContent = styled.span`
  font-size: 12px;
  font-weight: 400;
  line-height: 16px;
  color: ${({ theme }) => theme.colors.stormGray};
`;

export const RiskInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 4px;
`;

export const RiskDate = styled.span`
  font-weight: 700;
  font-size: 8px;
  line-height: 10px;
  color: ${({ theme }) => theme.colors.stormGray};
`;
