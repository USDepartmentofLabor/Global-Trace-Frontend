import styled from 'vue-styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 48px;
  width: 1280px;
  padding: 24px;
  box-sizing: border-box;
  background-color: ${({ theme }) => theme.background.white};

  @media (max-width: 767px) {
    gap: 16px;
    padding: 16px;
  }

  @media (max-width: 1400px) {
    width: 100%;
  }
`;
