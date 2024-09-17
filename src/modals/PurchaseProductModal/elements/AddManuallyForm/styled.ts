import styled from 'vue-styled-components';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px 32px;

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
    max-height: calc(100svh - 200px);

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

export const Actions = styled.div`
  display: flex;
  justify-content: center;
  gap: 16px;
  padding-top: 24px;
`;

export const ButtonGroupEnd = styled.div`
  display: flex;
  gap: 16px;
  flex: 1;
  justify-content: flex-end;
`;
