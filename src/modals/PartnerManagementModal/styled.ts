import styled from 'vue-styled-components';

export const Container = styled.div`
  display: flex;
  justify-content: center;
  gap: 32px;
  margin: 80px auto;

  @media (max-width: 576px) {
    flex-direction: column;
    margin: 0;
    padding: 24px;
    gap: 24px;
  }
`;
