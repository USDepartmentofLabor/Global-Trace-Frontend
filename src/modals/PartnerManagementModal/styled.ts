import styled from 'vue-styled-components';

export const Container = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 80px 42px 126px;

  @media (max-width: 576px) {
    flex-direction: column;
    margin: 0;
    padding: 24px;
    gap: 24px;
  }
`;
