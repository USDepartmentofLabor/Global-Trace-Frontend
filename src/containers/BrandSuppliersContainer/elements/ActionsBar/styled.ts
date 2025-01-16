import styled from 'vue-styled-components';

export const Container = styled.div`
  display: flex;
  width: 100%;
  box-sizing: border-box;
  padding: 16px 32px;
  background-color: ${({ theme }) => theme.colors.wildSand};

  @media (max-width: 992px) {
    flex-direction: column;
    padding: 16px;
  }
`;

const ViewModeProps = {
  isActive: Boolean,
};

export const WrapperLeft = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  gap: 8px;

  @media (max-width: 992px) {
    flex: none;
    margin-bottom: 24px;
  }
`;

export const Title = styled.div`
  font-size: 20px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.highland};
`;

export const WrapperRight = styled.div`
  display: flex;
  padding: 10px;
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: 6px;
  box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.1);

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
    align-items: flex-start;
    justify-content: center;
    margin-left: 16px;
    padding-left: 16px;
  }
`;
