import styled from 'vue-styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 48px;
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const Title = styled.div`
  font-weight: 800;
  font-size: 20px;
  line-height: 25px;
  color: ${({ theme }) => theme.colors.envy};
`;

export const Input = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

export const Password = styled.div`
  position: relative;

  .usdol-icon {
    position: absolute;
    top: 15px;
    right: 15px;
    cursor: pointer;
  }
`;

export const Action = styled.div`
  display: flex;
  justify-content: center;
`;

export const FormContent = styled.div`
  display: grid;
  width: max-content;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  max-width: 640px;

  @media screen and (max-width: 768px) {
    width: 100%;
    grid-template-columns: 1fr;
  }
`;

export const FullName = styled.div`
  display: flex;
  gap: 8px;

  @media screen and (max-width: 768px) {
    flex-direction: column;
    width: 100%;
  }
`;

export const BusinessFormContent = styled.div`
  display: grid;
  width: max-content;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  width: 640px;

  @media screen and (max-width: 768px) {
    grid-template-columns: 1fr;
    width: auto;
  }
`;
