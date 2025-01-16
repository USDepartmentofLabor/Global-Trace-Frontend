import styled from 'vue-styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 64px;
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
  color: ${({ theme }) => theme.colors.stormGray};

  @media (max-width: 767px) {
    font-weight: 700;
    font-size: 14px;
    text-align: center;
  }
`;

export const Input = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

export const Action = styled.div`
  display: flex;
  justify-content: center;
  gap: 16px;
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
  gap: 24px;
  width: 100%;

  @media screen and (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;
