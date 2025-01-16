import styled from 'vue-styled-components';

export const Container = styled.div`
  display: flex;
  min-height: 100%;
  flex-direction: column;

  @media (max-width: 767px) {
    justify-content: flex-start;
  }
`;

export const Form = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px;

  @media (max-width: 767px) {
    padding: 24px 0;
  }
`;

export const FormContent = styled.div`
  width: 480px;
  max-width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const Row = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Line = styled.div`
  margin: 8px 0;
  border-top: 1px solid ${(props) => props.theme.colors.ghost};
`;

export const Action = styled.div`
  padding: 16px 32px 24px;
  display: flex;
  justify-content: flex-end;

  @media (max-width: 767px) {
    padding: 0;
  }
`;
