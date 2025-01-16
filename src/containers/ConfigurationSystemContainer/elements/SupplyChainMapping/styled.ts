import styled, { css } from 'vue-styled-components';
import resources from 'config/resources';

export const Wrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: calc(100vh - 174px);
  box-sizing: border-box;
  background-color: ${({ theme }) => theme.background.white};

  .screen {
    border: none;
  }

  .edge {
    stroke-width: 1px;

    &.isDanger {
      stroke: ${({ theme }) => theme.colors.crail};
      marker-end: url(#arrow-end-danger);
    }
  }

  .background {
    background: none;
  }

  .label {
    .content {
      border-radius: 30px;
      padding: 4px;
      background-color: ${({ theme }) => theme.background.white};
      box-shadow: 0 2px 4px 0 ${({ theme }) => theme.colors.blackTransparent2},
        0 0 1px ${({ theme }) => theme.colors.blackTransparent8};
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

  @media (max-width: 992px) {
    padding: 16px;
  }
`;

export const Screen = styled.div`
  width: 100%;
  height: 100%;
  flex: 1;
`;

export const Node = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 6px 10px;
  border-radius: 4px;
  background-color: ${({ theme }) => theme.background.white};
  box-shadow: 0 2px 4px 0 ${({ theme }) => theme.colors.blackTransparent2},
    0 0 1px ${({ theme }) => theme.colors.blackTransparent8};
  width: 222px;
  height: 60px;
  justify-content: center;
  box-sizing: border-box;
  cursor: move;
  animation: zoomIn 0.5s ease;
  animation-delay: 0.1s;

  .usdol-icon {
    cursor: pointer;
  }

  @keyframes zoomIn {
    0% {
      transform: scale(0.7);
    }

    50% {
      transform: scale(1.1);
    }

    100% {
      transform: scale(1);
    }
  }
`;

export const NodeHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const nodeIconProps = {
  variant: String,
};

const nodeIconCss = {
  default: css`
    background-color: ${({ theme }) => theme.colors.surfCrest};
  `,
  warning: css`
    background-color: ${({ theme }) => theme.colors.treePoppy};
  `,
  danger: css`
    background-color: ${({ theme }) => theme.colors.crail};
  `,
};

export const NodeIcon = styled('div', nodeIconProps)`
  padding: 4px;
  border-radius: 8px;
  text-align: center;
  ${({ variant }) => nodeIconCss[variant]}
`;

export const NodeName = styled.div`
  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
  color: ${({ theme }) => theme.colors.rhino};
`;

export const Actions = styled.div``;

export const Options = styled.div`
  padding: 10px 0;
  border: 1px solid ${({ theme }) => theme.colors.surfCrest};
  background: ${({ theme }) => theme.background.white};
  box-shadow: 0px 2px 4px rgba(202, 202, 202, 0.5),
    0px 1px 4px rgba(218, 218, 224, 0.4);
  border-radius: 4px;
  min-width: 108px;
`;

export const Option = styled.div`
  display: flex;
  gap: 8px;
  font-size: 14px;
  font-weight: 400;
  padding: 10px 12px;
  color: ${({ theme }) => theme.colors.stormGray};
  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => theme.background.wildSand};
  }
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

export const AddFlow = styled.div`
  position: absolute;
  top: 16px;
  right: 16px;
`;

export const ImpactActions = styled.div`
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${({ theme }) => theme.background.wildSand};
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 16px;
  padding: 24px 32px;

  @media (max-width: 992px) {
    padding: 16px;
  }
`;
