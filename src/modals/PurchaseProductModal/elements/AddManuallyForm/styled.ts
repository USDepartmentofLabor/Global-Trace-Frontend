import styled from 'vue-styled-components';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px 0 32px 32px;

  .formulate-form {
    width: 100%;
  }

  @media (max-width: 576px) {
    padding: 16px;
  }
`;

export const Form = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  .ps {
    max-height: calc(100svh - 170px);
    padding-right: 32px;

    @media (max-width: 576px) {
      padding-right: 0;
    }
  }
`;

export const Col = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const ProductAttributes = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const Action = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 8px;
  padding-right: 32px;

  > div {
    width: 100%;
  }

  @media (max-width: 576px) {
    padding-right: 0;
  }
`;
