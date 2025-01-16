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

  @media (max-width: 576px) {
    display: none;
  }
`;

export const FilterWrapper = styled('div', filterWrapperParams)`
  display: flex;
  align-items: center;
  cursor: pointer;
  user-select: none;
  font-weight: 400;
  font-size: 12px;
  line-height: 15px;

  ${({ sortType }) => (sortType === 'asc' ? SortCss : null)}
`;

export const FilterAction = styled.div`
  width: 40px;
`;

export const FilterSort = styled.div`
  display: flex;
  align-items: center;
  gap: 40px;
`;

export const FilterContainer = styled.div`
  display: grid;
  grid-template-columns: 120px 1fr 120px 40px;
  gap: 12px;
  margin: 0 72px;
  padding-bottom: 8px;
  box-sizing: border-box;
  color: ${({ theme }) => theme.colors.spunPearl};
  border-bottom: 1px solid ${({ theme }) => theme.colors.ghost};

  @media (max-width: 576px) {
    margin: 0 16px;
  }
`;
