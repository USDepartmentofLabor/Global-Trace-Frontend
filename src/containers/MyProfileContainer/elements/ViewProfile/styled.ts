import styled from 'vue-styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 48px;
  width: 100%;
  max-width: 968px;

  @media (max-width: 767px) {
    gap: 16px;
  }
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;

  @media (max-width: 767px) {
    padding: 0 16px;
  }
`;

export const Title = styled.div`
  font-weight: 800;
  font-size: 20px;
  line-height: 25px;
  color: ${({ theme }) => theme.colors.envy};

  @media (max-width: 767px) {
    font-weight: 700;
    font-size: 14px;
    text-align: center;
  }
`;

export const Row = styled.div`
  display: flex;
  gap: 100px;

  @media (max-width: 767px) {
    gap: 24px;
    flex-direction: column;
  }
`;

export const Information = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 24px;

  @media (max-width: 767px) {
    grid-template-columns: auto;
  }
`;

export const Info = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

export const Label = styled.div`
  font-weight: 600;
  font-size: 14px;
  line-height: 18px;
  color: ${({ theme }) => theme.colors.ghost};
`;

export const Text = styled.div`
  font-weight: 400;
  font-size: 16px;
  line-height: 20px;
  word-break: break-word;
  color: ${({ theme }) => theme.colors.abbey};
`;

export const Actions = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 30px;

  @media (max-width: 767px) {
    grid-template-columns: 100%;
    gap: 15px;
  }
`;
