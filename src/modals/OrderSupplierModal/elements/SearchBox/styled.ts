import styled, { css } from 'vue-styled-components';

const activeLabelCSS = css`
  background-color: ${({ theme }) => theme.colors.wildSand};
`;

const resultProps = {
  isActive: Boolean,
};

export const Result = styled('div', resultProps)`
  width: 100%;
  overflow: hidden;
  padding: 13px 5px;
  border-radius: 4px;

  &:hover {
    ${activeLabelCSS}
  }

  ${({ isActive }) => isActive && activeLabelCSS}
`;

export const Label = styled.div`
  display: flex;
  flex: 1 1 auto;
  font-weight: 600;
  font-size: 12px;
  line-height: 15px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  color: ${({ theme }) => theme.colors.highland};
`;
