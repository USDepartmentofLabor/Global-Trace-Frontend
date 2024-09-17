import styled from 'vue-styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 26px;

  @media (max-width: 576px) {
    gap: 10px;
  }
`;

export const Title = styled.div`
  font-weight: 600;
  font-size: 20px;
  text-align: center;

  color: ${({ theme }) => theme.background.highland};
`;

export const Action = styled.div``;
