import styled from 'vue-styled-components';
import resources from 'config/resources';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  box-sizing: border-box;
  height: calc(100svh - 170px);
  background-color: ${({ theme }) => theme.background.wildSand};

  .screen {
    border: none;
  }

  .edge {
    stroke-width: 1px;
  }

  .background {
    background: none;
  }

  .label {
    .content {
      border-radius: 30px;
      padding: 4px;
      background-color: ${({ theme }) => theme.background.white};
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
  width: 160px;
  height: 100px;
  justify-content: space-around;
  box-sizing: border-box;
  cursor: move;

  .usdol-icon {
    cursor: pointer;
  }
`;

export const NodeHeader = styled.div`
  display: flex;
  justify-content: space-between;

  span {
    display: inline-block;
    overflow: hidden;
    text-overflow: ellipsis;
    color: ${({ theme }) => theme.colors.rhino};
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
