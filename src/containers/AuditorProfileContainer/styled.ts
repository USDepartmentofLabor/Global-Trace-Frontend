import styled from 'vue-styled-components';

export const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
`;

export const Container = styled.div`
  display: flex;
  justify-content: center;
  padding: 40px 80px;
  min-height: calc(100svh - 90px);
  box-sizing: border-box;
  background: ${({ theme }) => theme.background.wildSand};

  @media screen and (max-width: 768px) {
    padding: 24px;
    width: 100%;
    min-height: calc(100svh - 68px);

    form {
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
