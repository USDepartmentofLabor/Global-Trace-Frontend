import styled, { css } from 'vue-styled-components';

const resultProps = {
  isActive: Boolean,
};

export const Wrapper = styled.div`
  width: 100%;

  .ps {
    max-height: calc(100svh - 100px);
    padding-right: 10px;
  }
`;

export const Row = styled.div`
  display: flex;
  column-gap: 8px;
  margin-bottom: 10px;

  @media (max-width: 992px) {
    flex-direction: column;
    gap: 12px;
  }
`;

export const Column = styled.div`
  flex: 1 0 0;
`;

const activeLabelCSS = css`
  background-color: ${(props) => props.theme.colors.wildSand};
`;

export const Result = styled('div', resultProps)`
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: 4px;
  overflow: hidden;
  border-radius: 8px;
  &:hover {
    ${activeLabelCSS}
  }
  ${(props) => props.isActive && activeLabelCSS}
`;

export const Item = styled.div`
  display: flex;
  flex: 1 1 auto;
  font-weight: 400;
  font-size: 14px;
  line-height: 18px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  padding: 15px 13px;
  color: ${({ theme }) => theme.colors.stormGray};
`;

export const OptionLabel = styled.span`
  color: ${({ theme }) => theme.colors.stormGray};
`;

export const Option = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  line-height: 20px;
  height: 48px;
  padding: 8px 13px;

  &:hover {
    background-color: ${({ theme }) => theme.background.zircon};
  }
`;
