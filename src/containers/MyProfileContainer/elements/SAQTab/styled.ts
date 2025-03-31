import styled from 'vue-styled-components';

export const Container = styled.div`
  width: 640px;
  margin: 32px auto;

  @media (max-width: 768px) {
    width: 100%;
    max-width: 640px;
  }
`;
