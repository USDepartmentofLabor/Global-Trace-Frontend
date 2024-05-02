import styled from 'vue-styled-components';

export const Container = styled.div`
  display: flex;
  min-height: 100%;
  flex-direction: column;

  @media (max-width: 767px) {
    justify-content: flex-start;
    padding: 16px;
  }
`;

export const Wrapper = styled.div`
  width: 312px;
  margin: 30px auto;

  @media (max-width: 576px) {
    width: 100%;
    margin: 0;
  }
`;

export const Title = styled.div`
  font-weight: 800;
  text-align: center;
  margin-bottom: 34px;
  font-size: 24px;
  line-height: 30px;
  color: ${(props) => props.theme.colors.highland};

  @media (max-width: 576px) {
    margin-bottom: 0;
  }
`;

export const Action = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 8px;

  > div {
    width: 312px;

    @media (max-width: 576px) {
      width: 100%;
    }
  }
`;
