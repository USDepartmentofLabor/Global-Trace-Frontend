import styled, { css } from 'vue-styled-components';

export const Wrapper = styled.div`
  .ps {
    max-height: calc(100svh - 170px);
  }
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

export const Header = styled.div`
  display: flex;
  gap: 16px;
  justify-content: center;
  align-items: end;
  padding-top: 24px;
  padding-bottom: 16px;

  button {
    height: 48px;
  }

  @media (max-width: 576px) {
    width: 100%;
    padding: 16px 0;
    gap: 16px;

    > div {
      &: first-child {
        padding-left: 16px;
      }

      &: last-child {
        padding-right: 16px;
      }
    }
  }
`;

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 72px;
  gap: 12px;

  @media (max-width: 576px) {
    margin: 0 16px;
  }
`;

export const FilterContainer = styled.div`
  display: grid;
  grid-template-columns: 120px 1fr 120px 40px;
  gap: 12px;
  padding-top: 12px;
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

  ${(props) => (props.sortType === 'desc' ? AscCss : null)}
`;

export const FilterAction = styled.div`
  width: 40px;
`;

export const FilterDate = styled('div', filterWrapperParams)`
  display: flex;
  align-items: center;
  cursor: pointer;
  user-select: none;
  font-weight: 400;
  font-size: 12px;
  line-height: 15px;

  ${(props) => (props.sortType === 'asc' ? AscCss : null)}
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 120px;

  & > .ps {
    max-height: calc(100svh - 295px);
  }

  @media (max-width: 576px) {
    padding-top: 16px;
  }
`;

export const Box = styled.div`
  display: flex;
  flex-direction: column;
  padding: 24px;
  border-top: 1px solid ${({ theme }) => theme.colors.wildSand};

  &:first-child {
    border-top: inherit;
  }
`;

export const BoxContent = styled.div`
  display: flex;
  gap: 10px;
  font-size: 14px;

  .usdol-icon {
    cursor: pointer;
    margin-left: auto;
  }
`;

export const Name = styled.div`
  width: 150px;
  flex-shrink: 0;
  color: ${({ theme }) => theme.colors.envy};
`;

export const Result = styled.div`
  display: flex;
  flex: 1;
  flex-shrink: 0;
`;

export const ResultName = styled.div`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.ghost};
  margin-right: 4px;
`;

export const ResultValue = styled.div`
  color: ${({ theme }) => theme.colors.abbey};
`;

export const Description = styled.div`
  width: 200px;
`;

export const BoxFooter = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 20px;
`;

export const Strong = styled.div`
  font-weight: 600;
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

export const Product = styled.div`
  display: grid;
  grid-template-columns: 120px 1fr 120px 40px;
  align-items: center;
  margin-bottom: 12px;
  font-size: 14px;

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
    position: relative;
  }
`;

export const InputProductCode = styled.div`
  width: 224px;

  @media (max-width: 576px) {
    width: 100%;
  }
`;
