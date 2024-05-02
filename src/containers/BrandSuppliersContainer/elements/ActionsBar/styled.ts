import styled from 'vue-styled-components';

export const Container = styled.div`
  display: flex;
  width: 100%;
  background-color: ${({ theme }) => theme.colors.wildSand};
`;

const ViewModeProps = {
  isActive: Boolean,
};

export const Wrapper = styled.div`
  display: flex;
  padding: 10px;
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: 6px;
  margin: 12px auto;

  @media (max-width: 992px) {
    align-items: center;
  }
`;

export const ViewMode = styled('div', ViewModeProps)`
  padding: 10px;
  cursor: pointer;
  border-radius: 4px;
  background-color: ${({ isActive, theme }) =>
    isActive ? theme.colors.surfCrest : theme.colors.white};
`;

export const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 30px;
  margin-left: 23px;
  padding-left: 23px;
  border-left: 1px solid ${({ theme }) => theme.colors.ghost};

  @media (max-width: 992px) {
    flex-direction: column;
    gap: 10px;
    align-items: center;
    justify-content: center;
  }
`;
