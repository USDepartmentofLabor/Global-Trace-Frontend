import styled, { css } from 'vue-styled-components';

export const Indicators = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const Label = styled.div`
  font-weight: 600;
  font-size: 12px;
  line-height: 16px;
  color: ${({ theme }) => theme.colors.highland};
`;

export const Action = styled.div`
  display: flex;
  gap: 4px;
  cursor: pointer;
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
