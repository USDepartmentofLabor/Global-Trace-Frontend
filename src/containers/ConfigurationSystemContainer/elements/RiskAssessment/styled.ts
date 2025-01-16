import styled from 'vue-styled-components';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  box-sizing: border-box;
  max-width: 646px;
  margin: 50px auto;
`;

export const Content = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;

  & > div:last-child {
    grid-column: 1/3;
  }
`;

export const Action = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 16px;
`;
