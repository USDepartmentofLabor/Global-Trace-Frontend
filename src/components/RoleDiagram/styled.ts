import styled, { css } from 'vue-styled-components';

export const Wrapper = styled.div`
  width: 100%;
  height: 70px;
  user-select: none;
  border: 1px solid transparent;
  cursor: all-scroll;

  &:hover {
    border-color: ${({ theme }) => theme.colors.spunPearl};
  }

  svg.screen {
    border: none;

    #arrow-start,
    #arrow-end {
      path {
        fill: ${({ theme }) => theme.colors.spunPearl} !important;
      }
    }

    .edge {
      stroke-width: 1;
      stroke: ${({ theme }) => theme.colors.spunPearl};
    }
  }
`;

const nodeProps = {
  isLabel: Boolean,
};

const labelCss = css`
  font-weight: 400;
  font-size: 12px;
  border: none;
  line-height: 22px;
`;

export const Node = styled('div', nodeProps)`
  padding: 8px 16px;
  font-size: 16px;
  line-height: 20px;
  border-radius: 4px;
  color: ${({ theme }) => theme.colors.abbey};
  background-color: ${({ theme }) => theme.background.wildSand};
  border: 1px solid ${({ theme }) => theme.colors.highland};

  ${(props) => props.isLabel && labelCss}
`;
