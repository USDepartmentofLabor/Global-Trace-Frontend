import styled, { css } from 'vue-styled-components';

const textStyled = css`
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
  color: ${({ theme }) => theme.colors.eastBay};
`;

const hoverMonthStyled = css`
  border-radius: 4px;
  color: ${({ theme }) => theme.colors.white};
  background: ${({ theme }) => theme.background.highland};
`;

const monthProps = {
  isSelected: Boolean,
};

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 297px;
  padding: 4px 8px;
  border-radius: 4px;
  border: 1px solid ${({ theme }) => theme.colors.snuff};
  background: ${({ theme }) => theme.background.white};
`;

export const Header = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  padding: 8px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.wildSand};
  ${textStyled};
`;

export const Months = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  padding: 4px 0;
  gap: 8px;
`;

export const Month = styled('div', monthProps)`
  display: flex;
  justify-content: center;
  padding: 5px 12px;
  cursor: pointer;
  ${textStyled};

  ${({ isSelected }) => isSelected && hoverMonthStyled};

  &:hover {
    ${hoverMonthStyled}
  }
`;
