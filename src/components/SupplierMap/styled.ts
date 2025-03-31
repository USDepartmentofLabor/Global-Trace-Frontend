/* eslint-disable max-lines */
import styled, { css } from 'vue-styled-components';
import resources from 'config/resources';
import { LevelRiskCategoryEnum } from 'enums/saq';
import { getRiskColor } from 'utils/risk-assessment';

const WrapperCss = {
  default: css`
    height: calc(100svh - 173px);
  `,
  small: css`
    height: calc(100svh - 400px);
  `,
};

const wrapperProps = {
  size: String,
  height: Number,
  isReverse: Boolean,
};

const edgeReverseCss = css`
  marker-start: url(#arrow-start);
  marker-end: inherit;
`;

export const Wrapper = styled('div', wrapperProps)`
  display: flex;
  flex-direction: column;
  width: 100%;
  box-sizing: border-box;
  background-color: ${({ theme }) => theme.background.white};
  ${({ size }) => WrapperCss[size]};
  height: ${({ height }) => (height > 0 ? `${height}px` : null)};

  @media print {
    break-inside: avoid;
  }

  .screen {
    border: none;
    box-sizing: border-box;
    cursor: move;

    .edge {
      stroke-width: 1px;
      ${({ isReverse }) => isReverse && edgeReverseCss};

      &.activated {
        stroke-width: 2px;
      }
    }

    .background {
      background: none;
    }

    .label {
      .content {
        border-radius: 30px;
        padding: 4px;
        background-color: ${({ theme }) => theme.background.wildSand};
      }
    }

    foreignObject {
      overflow: visible;
    }

    .icon-tooltip {
      position: relative;
      background: ${({ theme }) => theme.background.stormGray};
      color: ${({ theme }) => theme.colors.white};
      padding: 8px 12px;
      font-size: 16px;
      font-weight: 400;
      border-radius: 4px;
      transform: translate(-50%, -50%) !important;
      bottom: calc(100% - 10px) !important;
      top: auto !important;
      left: 50% !important;

      &:before {
        content: '';
        position: absolute;
        bottom: -4px;
        left: calc(50% - 5px);
        width: 10px;
        height: 10px;
        transform: rotate(45deg);
        background: ${({ theme }) => theme.background.stormGray};
      }
    }
  }
`;

const nodeProps = {
  activated: Boolean,
  height: Number,
  status: String,
};

const nodeRiskStyles = {
  [LevelRiskCategoryEnum.EXTREME]: css`
    ${({ theme }) => theme.colors[getRiskColor(LevelRiskCategoryEnum.EXTREME)]};
  `,
  [LevelRiskCategoryEnum.HIGH]: css`
    ${({ theme }) => theme.colors[getRiskColor(LevelRiskCategoryEnum.HIGH)]};
  `,
  [LevelRiskCategoryEnum.MEDIUM]: css`
    ${({ theme }) => theme.colors[getRiskColor(LevelRiskCategoryEnum.MEDIUM)]};
  `,
  [LevelRiskCategoryEnum.LOW]: css`
    ${({ theme }) => theme.colors[getRiskColor(LevelRiskCategoryEnum.LOW)]};
  `,
};

export const Node = styled('div', nodeProps)`
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 6px 10px;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.background.white};
  width: 200px;
  height: ${({ height }) => `${height}px`};
  justify-content: space-between;
  box-sizing: border-box;
  cursor: pointer;
  overflow: hidden;
  border-width: ${({ activated }) => (activated ? '2px' : '1px')};
  border-style: solid;
  border-color: ${({ theme }) => theme.colors.surfCrest};
  border-color: ${({ theme, activated, status }) =>
    activated ? theme.colors.highland : nodeRiskStyles[status]};

  &:hover .edit-icon {
    display: flex;
  }
`;

const tierProps = {
  showConnector: Boolean,
  height: Number,
};

export const Tier = styled('div', tierProps)`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 200px;
  height: ${({ height }) => (height ? `${height}px` : '44px')};
  padding: 12px;
  border-radius: 8px;
  box-sizing: border-box;
  justify-content: center;

  color: ${({ theme }) => theme.colors.highland};
  border: 1px solid ${({ theme }) => theme.colors.surfCrest};

  &:after {
    content: '';
    position: absolute;
    top: 50%;
    right: -53px;
    width: 45px;
    height: ${({ showConnector }) => (showConnector ? '1px' : '0')};
    background-color: ${({ theme }) => theme.background.highland};
  }
`;

const tierNameProps = {
  isExpand: Boolean,
};

const tierNameCss = {
  expand: css`
    word-break: break-word;
    white-space: normal;
  `,
  collapse: css`
    overflow: hidden;
    text-overflow: ellipsis;
  `,
};

export const TierName = styled('div', tierNameProps)`
  font-size: 14px;
  font-weight: 600;
  text-align: center;
  ${({ isExpand }) =>
    isExpand ? tierNameCss['expand'] : tierNameCss['collapse']}
`;

export const NodeInformation = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const EditIcon = styled.div`
  cursor: pointer;
  display: none;
`;

const expandIconProps = {
  isExpanded: Boolean,
};

const expandedCss = `
  .usdol-icon {
    transform: rotate(0deg);
  }
`;

export const ExpandIcon = styled('div', expandIconProps)`
  cursor: pointer;
  position: absolute;
  top: 5px;
  right: 5px;
  display: flex;
  gap: 2px;
  align-items: center;

  .usdol-icon {
    transform: rotate(180deg);
  }

  ${({ isExpanded }) => isExpanded && expandedCss}
`;

export const TargetTotal = styled.div`
  padding: 4px;
  border-radius: 20px;
  font-size: 8px;
  font-weight: 700;
  background-color: ${({ theme }) => theme.background.wildSand};
  color: ${({ theme }) => theme.colors.highland};
`;

export const NodeHeader = styled.div`
  display: flex;
  gap: 4px;
  margin-right: 10px;
  align-items: center;
`;

export const Label = styled.div`
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  white-space: pre-line;
  overflow: hidden;
  text-overflow: ellipsis;
  overflow: hidden;
  word-break: break-word;
  font-size: 8px;
  font-weight: 700;
  text-overflow: ellipsis;
  color: ${({ theme }) => theme.colors.manatee};
`;

export const Logo = styled.img`
  position: absolute;
  width: 100%;
  height: 100%;
  object-fit: contain;
  top: 0;
  left: 0;
  background-color: ${({ theme }) => theme.background.white};
`;

const NameProps = {
  maxLine: Number,
};

export const Name = styled('div', NameProps)`
  display: -webkit-box;
  -webkit-line-clamp: ${({ maxLine }) => maxLine};
  -webkit-box-orient: vertical;
  white-space: pre-line;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 14px;
  font-weight: 600;
  word-break: break-word;
  color: ${({ theme }) => theme.colors.shark};
`;

export const NodeBody = styled.div`
  display: flex;
  gap: 8px;
`;

export const RoleName = styled.div`
  padding: 8px;
  border-radius: 4px;
  color: ${({ theme }) => theme.colors.stormGray};
  background-color: ${({ theme }) => theme.background.surfCrest};
`;

export const EmptyContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-top: 63px;
`;

export const EmptyImage = styled.img.attrs({
  src: resources.SUPPLY_CHAIN_EMPTY,
})`
  width: 177px;
  height: 152px;
`;

export const EmptyText = styled.div`
  font-weight: 600;
  font-size: 14px;
  line-height: 18px;

  color: ${({ theme }) => theme.colors.abbey};
`;

const riskStyles = {
  [LevelRiskCategoryEnum.EXTREME]: css`
    div {
      background-color: ${({ theme }) =>
        theme.colors[getRiskColor(LevelRiskCategoryEnum.EXTREME)]};
    }
  `,
  [LevelRiskCategoryEnum.HIGH]: css`
    div:nth-child(-n + 3) {
      background-color: ${({ theme }) =>
        theme.colors[getRiskColor(LevelRiskCategoryEnum.HIGH)]};
    }
  `,
  [LevelRiskCategoryEnum.MEDIUM]: css`
    div:nth-child(-n + 2) {
      background-color: ${({ theme }) =>
        theme.colors[getRiskColor(LevelRiskCategoryEnum.MEDIUM)]};
    }
  `,
  [LevelRiskCategoryEnum.LOW]: css`
    div:first-child {
      background-color: ${({ theme }) =>
        theme.colors[getRiskColor(LevelRiskCategoryEnum.LOW)]};
    }
  `,
};

const RiskProp = {
  status: String,
};

export const RiskAssessment = styled('div', RiskProp)`
  width: 12px;
  height: 12px;
  box-sizing: border-box;
  border-radius: 20px;
  flex-shrink: 0;
`;

const BarRiskProp = {
  status: String,
  width: String,
};

export const RiskAssessmentBar = styled('div', BarRiskProp)`
  display: flex;
  gap: 1px;
  border-radius: 2px;
  overflow: hidden;
  width: ${({ width }) => width};
  height: 12px;
  ${({ status }) => riskStyles[status]}
`;

export const Box = styled.div`
  flex: 1;
  background-color: ${({ theme }) => theme.background.wildSand};
`;
