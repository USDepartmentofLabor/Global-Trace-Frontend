import styled, { css } from 'vue-styled-components';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 32px;
`;

export const Icons = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(70px, 1fr));
  gap: 8px;
`;

const iconProps = {
  isSelected: Boolean,
};

const activeIconCss = css`
  border: 2px solid ${({ theme }) => theme.colors.highland};
`;

export const Icon = styled('div', iconProps)`
  display: flex;
  width: 70px;
  height: 70px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  padding: 4px;
  cursor: pointer;
  box-sizing: border-box;
  border: 1px solid ${({ theme }) => theme.colors.surfCrest};
  user-select: none;

  ${({ isSelected }) => isSelected && activeIconCss}
`;

export const Image = styled.img`
  width: 100%;
  max-height: 100%;
`;

export const NoIcon = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  text-align: center;
  font-size: 10px;
  text-transform: uppercase;
  font-weight: 800;
  white-space: nowrap;
  color: ${({ theme }) => theme.colors.abbey};
`;

export const Actions = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;

  & > div {
    flex: 1;
  }
`;
