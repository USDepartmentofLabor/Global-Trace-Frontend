import styled, { css } from 'vue-styled-components';
import resources from 'config/resources';

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
};

export const Node = styled('div', nodeProps)`
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 6px 10px;
  border-radius: 4px;
  background-color: ${({ theme }) => theme.background.white};
  border: 1px solid ${({ theme }) => theme.colors.surfCrest};
  width: 160px;
  height: ${({ height }) => `${height}px`};
  justify-content: space-between;
  box-sizing: border-box;
  cursor: move;
  border-width: ${({ activated }) => (activated ? '2px' : '1px')};
  border-color: ${({ theme, activated }) =>
    activated ? theme.colors.highland : theme.colors.surfCrest};

  .usdol-icon {
    cursor: pointer;
    position: absolute;
    top: 5px;
    right: 5px;
  }
`;

export const NodeHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const Label = styled.div`
  display: inline-block;
  overflow: hidden;
  font-size: 8px;
  font-weight: 600;
  text-overflow: ellipsis;
  margin-right: 10px;
  color: ${({ theme }) => theme.colors.spunPearl};
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
  line-height: 17px;
  font-size: 14px;
  word-break: break-word;
  color: ${({ theme }) => theme.colors.abbey};
`;

export const NodeBody = styled.div`
  display: flex;
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

export const RiskAssessmentBar = styled.div`
  width: 100%;
  height: 7px;
  background-color: ${({ theme }) => theme.background.wildSand};
`;

const riskStyles = {
  extreme: css`
    width: 100%;
    background-color: ${({ theme }) => theme.colors.persimmon};
  `,
  high: css`
    width: 75%;
    background-color: ${({ theme }) => theme.colors.red};
  `,
  medium: css`
    width: 50%;
    background-color: ${({ theme }) => theme.colors.sandyBrown};
  `,
  low: css`
    width: 25%;
    background-color: ${({ theme }) => theme.colors.envy};
  `,
};

const RiskProp = {
  status: String,
};

export const RiskAssessment = styled('div', RiskProp)`
  height: 100%;
  ${({ status }) => riskStyles[status]}
`;
