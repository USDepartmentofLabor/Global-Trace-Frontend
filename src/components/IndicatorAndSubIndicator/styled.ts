import styled, { css } from 'vue-styled-components';

const sourceProps = {
  level: String,
  isBig: Boolean,
};

const indicatorProps = {
  hasBorder: Boolean,
  isBold: Boolean,
  isExpanded: Boolean,
};

const sourceStyles = {
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
    background-color: ${({ theme }) => theme.colors.killarney};
  `,
  'No weight': css`
    background-color: ${({ theme }) => theme.colors.alto};
  `,
};

const levelStyles = {
  Extreme: css`
    border: 1px solid ${({ theme }) => theme.colors.crail};
    color: ${({ theme }) => theme.colors.crail};
  `,
  High: css`
    border: 1px solid ${({ theme }) => theme.colors.treePoppy};
    color: ${({ theme }) => theme.colors.treePoppy};
  `,
  Medium: css`
    border: 1px solid ${({ theme }) => theme.colors.brightSun};
    color: ${({ theme }) => theme.colors.brightSun};
  `,
  Low: css`
    border: 1px solid ${({ theme }) => theme.colors.jellyBean};
    color: ${({ theme }) => theme.colors.jellyBean};
  `,
  'No weight': css`
    border: 1px solid ${({ theme }) => theme.colors.alto};
    color: ${({ theme }) => theme.colors.alto};
  `,
};

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const Sources = styled.div`
  display: flex;
  gap: 16px;
  padding: 16px;
`;

export const Source = styled('div', sourceProps)`
  display: flex;
  padding: 8px 24px;
  gap: 16px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.white};
  ${({ level }) => sourceStyles[level]}
`;

export const IndicatorGroup = styled.div`
  box-sizing: border-box;
  border-bottom: 1px solid ${({ theme }) => theme.colors.ghost};

  &:first-child {
    border-top: 1px solid ${({ theme }) => theme.colors.ghost};
  }
`;

export const SubIndicatorGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-bottom: 8px;
`;

export const IndicatorTitle = styled.div`
  border-bottom: 1px solid ${({ theme }) => theme.colors.ghost};
`;

export const IndicatorList = styled('div', indicatorProps)`
  display: flex;
  flex-direction: column;
  gap: ${({ isExpanded }) => (isExpanded ? '0' : '8px')};
  padding: ${({ isExpanded }) => (isExpanded ? '0' : '16px')};
`;

export const RiskItem = styled('div', indicatorProps)`
  display: flex;
  align-items: center;
  padding: ${({ isExpanded }) => (isExpanded ? '8px 12px' : '16px 12px')};
  gap: ${({ isExpanded }) => (isExpanded ? '16px;' : '24px')};
  ${({ hasBorder, isExpanded, theme }) =>
    hasBorder && !isExpanded ? `border: 1px solid ${theme.colors.ghost}` : ''};
  ${({ isExpanded, theme }) =>
    !isExpanded ? `border-bottom: 1px solid ${theme.colors.ghost}` : ''};
  background-color: ${({ hasBorder, isExpanded, theme }) =>
    hasBorder && isExpanded ? theme.background.wildSand : 'transparent'};
  cursor: pointer;
`;

export const RiskItemActions = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
`;

export const AssignCAP = styled.div`
  font-size: 16px;
  font-weight: 400;
  color: ${({ theme }) => theme.colors.highland};
`;

export const RiskLabel = styled('div', indicatorProps)`
  flex: 1;
  font-size: ${({ isExpanded }) => (isExpanded ? '12px' : '16px')};
  color: ${({ theme }) => theme.colors.stormGray};
  font-weight: ${({ isBold }) => (isBold ? 600 : 400)};
`;

export const RiskLevel = styled('div', sourceProps)`
  font-size: ${({ isBig }) => (isBig ? '16px' : '12px')};
  font-weight: 700;
  text-transform: uppercase;
  padding: 4px 12px;
  border-radius: 4px;
  ${({ level }) => levelStyles[level]}
`;

export const Arrow = styled.div`
  transform: rotate(90deg);
`;

export const SubIndicator = styled('div', indicatorProps)`
  display: flex;
  flex-direction: column;
  gap: ${({ isExpanded }) => (isExpanded ? '8px' : '16px')};

  @media print {
    break-inside: avoid;
  }

  @media (max-width: 992px) {
    padding: 0 8px;
  }
`;

export const Group = styled('div', indicatorProps)`
  @media print {
    break-inside: avoid;
  }
`;

export const Risk = styled.div`
  display: inline-block;
  margin-right: 16px;
`;

export const RickItem = styled.div`
  padding: 0px 16px;
  display: inherit;
  align-items: center;

  @media print {
    break-inside: avoid;
  }

  @media (max-width: 992px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  @media print {
    flex-direction: row;
    align-items: center;
    break-inside: avoid;
  }
`;

export const RickDate = styled.div`
  display: inline-block;
  margin-right: 16px;
  width: 110px;
  font-size: 12px;
  font-weight: 400;
  color: ${({ theme }) => theme.colors.stormGray};
`;

export const RickSource = styled('div', sourceProps)`
  display: inline-block;
  margin-right: 16px;
  padding: 4px 16px;
  justify-content: center;
  align-items: center;
  width: 120px;
  border-radius: 4px;
  background: ${({ theme }) => theme.background.white};
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.white};
  ${({ level }) => sourceStyles[level]}
`;

export const RickTitle = styled.div`
  display: flex;
  gap: 16px;
  margin-right: 16px;
  flex: 1;
  font-size: 14px;
  font-weight: 400;
  color: ${({ theme }) => theme.colors.stormGray};
`;

export const ReportContent = styled.span``;

export const ViewDetail = styled.span`
  font-size: 16px;
  font-weight: 400;
  cursor: pointer;
  flex-shrink: 0;
  color: ${({ theme }) => theme.colors.highland};
`;

export const Tag = styled.div`
  border-radius: 4px;
  text-align: center;
  padding: 4px 20px;
  font-weight: bold;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.stormGray};
  border: 1px solid ${({ theme }) => theme.colors.stormGray};
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 16px;

  @media (max-width: 992px) {
    gap: 32px;
  }

  .ps {
    max-height: 120px;
  }
`;

export const CAPTag = styled.div`
  display: inline-block;
  border-radius: 4px;
  word-break: break-word;
  box-sizing: border-box;
  font-weight: 700;
  font-size: 12px;
  text-align: center;
  padding: 5px 20px;
  text-transform: uppercase;
  width: 130px;
  background-color: ${({ theme }) => theme.background.white}
  color: ${({ theme }) => theme.colors.stormGray}
  border: 1px solid ${({ theme }) => theme.colors.stormGray}
`;
