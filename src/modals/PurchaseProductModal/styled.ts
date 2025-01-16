import styled, { css } from 'vue-styled-components';

const emptyContentCss = css`
  min-height: 110px;
`;

const ContentProp = {
  isEmpty: Boolean,
};

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
  justify-content: center;
  gap: 16px;
  padding: 24px 0;

  @media (max-width: 576px) {
    width: 100%;
    padding: 0;
  }
`;

export const HeaderInputGroup = styled.div`
  display: flex;
  justify-content: center;
  align-items: end;
  gap: 16px;

  button {
    height: 48px;
  }
`;

export const Content = styled('div', ContentProp)`
  display: flex;
  margin: auto;
  padding: 0 72px 16px;
  flex-direction: column;
  justify-content: start;
  background-color: ${({ theme }) => theme.colors.wildSand};
  ${({ isEmpty }) => isEmpty && emptyContentCss}

  & > .ps {
    max-height: calc(100svh - 350px);
  }

  @media (max-width: 576px) {
    padding: 16px;
  }
`;

export const Box = styled.div`
  display: flex;
  flex-direction: column;
  padding: 15px 0;
  border-top: 1px solid ${({ theme }) => theme.colors.ghost};

  &:first-child {
    border-top: inherit;
  }

  @media (max-width: 576px) {
    border-top: unset;
    padding: 0;
    position: relative;
  }
`;

export const Col = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  @media (max-width: 576px) {
    width: 100%;
    padding: 16px;
  }
`;

export const AddManually = styled.div`
  display: flex;
  justify-content: start;
  align-items: center;
  font-weight: 400;
  font-size: 12px;
  line-height: 15px;
  color: ${({ theme }) => theme.colors.sandyBrown};
  cursor: pointer;
  user-select: none;
`;

export const InputProductCode = styled.div`
  width: 224px;

  @media (max-width: 576px) {
    width: 100%;
  }
`;

export const ProductManually = styled.div`
  width: 312px;
  padding-bottom: 32px;

  @media (max-width: 576px) {
    width: 100%;
    padding-bottom: 0;
  }
`;
