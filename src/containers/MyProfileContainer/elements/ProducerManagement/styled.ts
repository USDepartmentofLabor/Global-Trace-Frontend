import styled from 'vue-styled-components';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 16px;
`;

export const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  table {
    thead {
      background-color: ${({ theme }) => theme.background.wildSand};
    }
  }

  @media (max-width: 920px) {
    padding: 14px;
  }
`;

export const HeaderAction = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  align-items: center;

  @media (max-width: 920px) {
    width: 100%;
    justify-content: flex-end;
  }
`;

export const HeaderTitle = styled.div`
  font-size: 20px;
  font-weight: 800;
  flex: 1;
  text-transform: capitalize;
  color: ${({ theme }) => theme.colors.highland};
`;
