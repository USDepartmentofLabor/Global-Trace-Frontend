import styled, { css } from 'vue-styled-components';

const activeLabelCSS = css`
  background-color: ${({ theme }) => theme.colors.ghost};
`;

const resultProps = {
  isActive: Boolean,
};

export const Result = styled('div', resultProps)`
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: 4px;
  overflow: hidden;
  padding: 15px 29px;

  &:hover {
    ${activeLabelCSS}
  }

  ${({ isActive }) => isActive && activeLabelCSS}
`;

export const Label = styled.div`
  display: flex;
  flex: 1 1 auto;
  font-weight: 400;
  font-size: 14px;
  line-height: 18px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  color: ${({ theme }) => theme.colors.stormGray};
`;
