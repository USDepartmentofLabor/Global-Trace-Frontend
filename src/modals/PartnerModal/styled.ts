import styled from 'vue-styled-components';

export const Wrapper = styled.div`
  width: 312px;
  margin: auto;
`;

export const ModalContent = styled.div`
  @media (max-width: 576px) {
    padding: 16px;
  }
`;

export const Actions = styled.div`
  display: flex;
  justify-content: center;
  gap: 16px;
  padding: 24px 32px;
`;

export const ButtonGroupEnd = styled.div`
  display: flex;
  gap: 16px;
  flex: 1;
  justify-content: flex-end;
`;
