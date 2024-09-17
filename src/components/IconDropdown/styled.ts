import styled, { css } from 'vue-styled-components';

export const Content = styled.div`
  width: 576px;
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  overflow: hidden;
  background-color: ${({ theme }) => theme.background.white};

  @media screen and (max-width: 767px) {
    width: 100%;
  }
`;

export const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const Label = styled.div`
  font-size: 14px;
  padding: 0 4px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.highland};
`;

export const Optional = styled.span`
  padding-left: 4px;
  color: ${({ theme }) => theme.colors.manatee};
`;

const inputProps = {
  isActivated: Boolean,
};

const activatedCss = css`
  width: 88px;
`;

export const Input = styled('div', inputProps)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  padding: 11px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 400;
  gap: 8px;
  box-sizing: border-box;
  border: 1px solid ${({ theme }) => theme.colors.surfCrest};
  color: ${({ theme }) => theme.colors.manatee};

  &:hover {
    border-color: ${({ theme }) => theme.colors.highland};
  }

  ${({ isActivated }) => isActivated && activatedCss}
`;

export const Arrow = styled.div`
  padding: 8px;
`;
