import styled, { css } from 'vue-styled-components';

export const Container = styled.div`
  display: flex;
  width: 100%;
`;

const activeLabelCSS = css`
  background-color: ${(props) => props.theme.colors.wildSand};
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
