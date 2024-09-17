import styled from 'vue-styled-components';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 80px;
  box-sizing: border-box;
  min-height: calc(100svh - 90px);
  background-color: ${({ theme }) => theme.background.wildSand};

  @media (max-width: 767px) {
    padding: 25px 16px;
    min-height: calc(100svh - 68px);

    > form {
      width: 100%;
    }
  }
`;

export const ViewProfile = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 100%;
`;
