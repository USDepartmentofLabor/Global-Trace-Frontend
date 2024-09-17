import styled, { css } from 'vue-styled-components';

export const ProductDetail = styled.div`
  display: grid;
  grid-template-columns: 120px 1fr 120px 40px;
  align-items: center;
  margin-bottom: 12px;
  font-size: 14px;
  position: relative;

  .remove-product {
    cursor: pointer;

    @media (max-width: 576px) {
      position: absolute;
      right: 0;
      top: 0;
    }
  }

  @media (max-width: 576px) {
    padding: 0;
    padding-top: 24px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    gap: 8px;
  }
`;

export const Name = styled.div`
  flex: 1;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.envy};
`;

export const FilterContainer = styled.div`
  display: grid;
  grid-template-columns: 120px 1fr 120px 40px;
  gap: 12px;
  padding-bottom: 8px;
  box-sizing: border-box;
  color: ${({ theme }) => theme.colors.spunPearl};
  border-bottom: 1px solid ${({ theme }) => theme.colors.ghost};

  @media (max-width: 576px) {
    display: none;
  }
`;

export const FilterAction = styled.div`
  width: 40px;
`;

const ascCss = css`
  .usdol-icon {
    transform: rotate(180deg);
  }
`;

const filterWrapperParams = {
  sortType: String,
};

export const FilterWrapper = styled('div', filterWrapperParams)`
  display: flex;
  align-items: center;
  cursor: pointer;
  user-select: none;
  font-weight: 400;
  font-size: 12px;
  line-height: 15px;

  ${(props) => (props.sortType === 'asc' ? ascCss : null)}
`;

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
`;

export const Code = styled.div`
  color: ${({ theme }) => theme.colors.abbey};
`;

export const Time = styled.div`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.ghost};
`;

export const DownloadText = styled.div`
  color: ${({ theme }) => theme.colors.envy};
`;

export const DownloadAttachments = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.envy};
`;

export const EmptyAttachments = styled.div`
  width: 120px;
`;
