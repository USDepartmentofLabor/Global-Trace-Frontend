import styled, { css } from 'vue-styled-components';

const filterWrapperParams = {
  sortType: String,
};

const SortCss = css`
  .usdol-icon {
    transform: rotate(180deg);
  }
`;

export const Wrapper = styled.div`
  padding: 16px 0 0;
  background-color: ${({ theme }) => theme.colors.wildSand};
`;

export const FilterWrapper = styled('div', filterWrapperParams)`
  display: flex;
  align-items: center;
  user-select: none;
  font-weight: 400;
  font-size: 12px;
  line-height: 15px;

  ${({ sortType }) => (sortType === 'asc' ? SortCss : null)}
`;

export const FilterContainer = styled.div`
  display: flex;
  gap: 12px;
  margin: 0 30px;
  padding: 0 16px 8px;
  box-sizing: border-box;
  color: ${({ theme }) => theme.colors.spunPearl};

  & > div:first-child {
    width: 252px;
  }
  & > div:nth-child(2) {
    width: 230px;
  }
  & > div:last-child {
    width: 30px;
  }
`;
