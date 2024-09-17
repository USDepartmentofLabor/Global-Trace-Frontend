import styled, { css } from 'vue-styled-components';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;

  .ps {
    max-height: calc(100svh - 170px);
  }
`;

export const Content = styled.div`
  padding: 12px 72px;
  display: flex;
  flex-direction: column;
  min-height: 120px;

  @media (max-width: 576px) {
    padding: 16px;
  }
`;

export const Row = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Actions = styled.div`
  display: flex;
  justify-content: center;
  gap: 16px;
  padding: 24px 32px;
`;

export const ButtonGroupEnd = styled.div`
  display: flex;
  gap: 16px;
  flex: 1;
  justify-content: flex-end;
`;

export const Form = styled.div`
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 4px rgba(50, 50, 50, 0.08);
  padding: 16px 32px 24px;

  @media (max-width: 576px) {
    padding: 16px;
  }
`;

export const FormContainer = styled.div`
  width: 100%;
  margin: 24px auto 0;
  display: flex;
  flex-direction: column;
  gap: 8px;

  @media (max-width: 576px) {
    margin: 0;
  }
`;

export const ProductAttributes = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const TotalWeightContainer = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 8px;
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

const AscCss = css`
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

  ${(props) => (props.sortType === 'asc' ? AscCss : null)}
`;

export const FilterAction = styled.div`
  width: 40px;
`;

export const Footer = styled.div`
  display: flex;
  justify-content: center;
  padding: 16px;
  box-shadow: 0 -4px 4px 4px rgba(75, 75, 69, 0.04);
  background-color: ${({ theme }) => theme.background.white};
`;
