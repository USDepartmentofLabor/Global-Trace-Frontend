import styled from 'vue-styled-components';

export const Content = styled.div`
  padding: 30px;

  @media (max-width: 576px) {
    padding: 15px;
  }

  .ps {
    width: 100%;
    max-height: calc(100svh - 180px);
  }
`;

export const ButtonGroup = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  margin-top: 30px;
  gap: 10px;
  align-items: center;

  @media (max-width: 576px) {
    display: flex;
    flex-direction: column-reverse;

    > div {
      width: 100%;
    }
  }
`;
