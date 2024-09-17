import styled from 'vue-styled-components';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 24px 32px;
`;

export const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;

  .ps {
    max-height: calc(100svh - 450px);
    margin-bottom: 8px;
  }
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Actions = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
`;
