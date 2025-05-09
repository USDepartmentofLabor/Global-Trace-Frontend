import styled, { css } from 'vue-styled-components';

export const Row = styled.div`
  display: flex;
  flex-direction: column;
`;

export const IndicatorWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  margin: 20px 0;
  max-height: calc(100svh - 126px);
`;

export const AddIndicatorForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  position: relative;
  padding-bottom: 15px;

  @media (max-width: 768px) {
    padding-left: 15px;
    padding-right: 15px;
  }
`;

export const AddIndicatorFormBody = styled.div`
  padding: 0 32px;
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;

  @media (max-width: 768px) {
    width: 100%;
    grid-template-columns: 1fr;
    padding: 0;
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

export const Indicators = styled.div`
  padding: 0 32px;

  @media (max-width: 768px) {
    padding: 16px;
  }
`;

export const IndicatorInner = styled.div`
  overflow-y: auto;
  border: 1px solid ${({ theme }) => theme.colors.athensGray};
  border-radius: 8px;

  @media (max-width: 768px) {
    overflow-x: auto;
  }
`;

export const IndicatorContent = styled.div`
  width: 100%;
  display: table;
  border-collapse: collapse;
  background-color: ${({ theme }) => theme.background.wildSand};
`;

export const FilterContainer = styled.div`
  width: 100%;
  display: table-row;
  margin: auto;
  box-sizing: border-box;
  color: ${({ theme }) => theme.colors.spunPearl};
  border-bottom: 1px solid ${({ theme }) => theme.colors.ghost};
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;
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
  padding: 24px;
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
  padding: 24px;
  font-weight: 600;
  font-size: 14px;
  line-height: 20px;
  color: ${({ theme }) => theme.colors.abbey};

  .usdol-icon {
    cursor: pointer;
  }
`;

export const Actions = styled.div`
  display: flex;
  justify-content: center;
  gap: 16px;
  padding: 16px 32px 0;
`;

export const ButtonGroupEnd = styled.div`
  display: flex;
  gap: 16px;
  flex: 1;
  justify-content: flex-end;
`;
