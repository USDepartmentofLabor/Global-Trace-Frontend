import styled, { css } from 'vue-styled-components';

export const Row = styled.div`
  display: flex;
  flex-direction: column;
`;

export const IndicatorWrapper = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  margin: 20px 0;
  max-height: calc(100svh - 126px);
`;

export const BackIcon = styled.div`
  position: absolute;
  left: 68px;
  top: -50px;
  cursor: pointer;

  @media (max-width: 768px) {
    left: 12px;
  }
`;

export const AddIndicatorForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  position: relative;
  padding-bottom: 15px;
  box-shadow: 0px 4px 4px 4px ${({ theme }) => theme.colors.blackTransparent7};

  @media (max-width: 768px) {
    padding-left: 15px;
    padding-right: 15px;
  }
`;

export const AddIndicatorFormBody = styled.div`
  width: 633px;
  margin: auto;
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 20px 10px;

  @media (max-width: 768px) {
    width: 100%;
    grid-template-columns: 1fr;
  }

  & > div {
    overflow: hidden;
  }

  & > div:first-child {
    grid-column: 1 / 3;

    @media (max-width: 768px) {
      grid-column: inherit;
    }
  }
`;

export const AddIndicatorAction = styled.div`
  display: flex;
  justify-content: center;
`;

export const IndicatorInner = styled.div`
  overflow-y: auto;

  @media (max-width: 768px) {
    overflow-x: auto;
    width: 100vw;
  }
`;

export const IndicatorContent = styled.div`
  display: table;
  border-collapse: collapse;
  width: 776px;
  background-color: ${({ theme }) => theme.background.wildSand};
`;

export const FilterContainer = styled.div`
  width: 100%;
  display: table-row;
  margin: auto;
  gap: 12px;
  box-sizing: border-box;
  color: ${({ theme }) => theme.colors.spunPearl};
  border-bottom: 1px solid ${({ theme }) => theme.colors.ghost};
`;

export const FilterContent = styled.div`
  display: flex;
  gap: 5px;
  align-items: center;
`;

const ascCss = css`
  .usdol-icon {
    display: block;
    transform: rotate(180deg);
  }
`;

const filterWrapperParams = {
  sortType: String,
};

export const FilterWrapper = styled('div', filterWrapperParams)`
  display: table-cell;
  padding: 24px 40px;
  align-items: center;
  cursor: pointer;
  user-select: none;

  ${(props) => (props.sortType === 'asc' ? ascCss : null)}
`;

export const List = styled.div`
  display: table-row;
  border-bottom: 1px solid ${({ theme }) => theme.colors.ghost};

  &:last-child {
    border-bottom: none;
  }
`;

export const ListItem = styled.div`
  display: table-cell;
  padding: 24px 40px;
  font-weight: 400;
  font-size: 14px;
  line-height: 18px;
  color: ${({ theme }) => theme.colors.abbey};

  .usdol-icon {
    cursor: pointer;
  }
`;

export const Footer = styled.div`
  box-shadow: 0px -4px 4px 4px ${({ theme }) => theme.colors.blackTransparent7};
  text-align: center;
  padding-top: 16px;

  button {
    margin: auto;
  }
`;

const severityStyles = {
  high: css`
    color: ${({ theme }) => theme.colors.red};
  `,
  medium: css`
    color: ${({ theme }) => theme.colors.sandyBrown};
  `,
  low: css`
    color: ${({ theme }) => theme.colors.envy};
  `,
};

const severityProps = {
  variant: String,
};

export const Severity = styled('div', severityProps)`
  font-weight: 700;
  font-size: 12px;
  line-height: 15px;
  text-transform: uppercase;
  ${(props) => severityStyles[props.variant]}
`;
