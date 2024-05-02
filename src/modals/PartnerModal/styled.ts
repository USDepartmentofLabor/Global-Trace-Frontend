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

export const Action = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 6px;
  padding: 16px;
  box-sizing: border-box;
  box-shadow: 0px -4px 4px 4px rgba(75, 75, 69, 0.04);

  @media (max-width: 576px) {
    box-shadow: unset;
  }
`;
