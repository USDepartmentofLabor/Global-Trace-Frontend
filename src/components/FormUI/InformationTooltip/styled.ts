import styled from 'vue-styled-components';

const infoIconProps = {
  placement: String,
};

export const InfoIcon = styled('div', infoIconProps)`
  cursor: pointer;

  .v-popover {
    display: inline-block;
  }

  .tooltip-inner {
    max-width: 220px;
    box-sizing: border-box;
    background: ${({ theme }) => theme.background.white};
    box-shadow: ${({ theme }) => theme.colors.blackTransparent1} 0px 2px 4px;
    padding: 8px 10px;
    border-radius: 8px;
  }

  .tooltip-arrow {
    position: absolute;
    border: none;
    width: 10px;
    height: 10px;
    left: ${({ placement }) =>
      placement === 'top-center' ? 'calc(50% + 16px)' : '23px'} !important;
    bottom: -5px;
    box-shadow: ${({ theme }) => theme.colors.blackTransparent1} 1px 2px 2px;
    transform: rotate(45deg);

    &:after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: calc(100% + 2px);
      height: calc(100% + 2px);
      background: ${({ theme }) => theme.background.white};
      transform: translate(-2px, 0px);
    }
  }

  .tooltip {
    z-index: 99;
  }
`;

export const TooltipContent = styled.div`
  font-size: 12px;
  line-height: 15px;
  color: ${({ theme }) => theme.colors.stormGray};
  white-space: pre-line;
`;
