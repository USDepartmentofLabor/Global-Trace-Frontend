import styled from 'vue-styled-components';

export const Container = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;

  @media (max-width: 992px) {
    width: 100%;
  }

  form {
    width: 100%;
  }
`;
