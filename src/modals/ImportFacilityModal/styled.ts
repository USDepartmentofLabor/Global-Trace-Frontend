import styled from 'vue-styled-components';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  background-color: ${({ theme }) => theme.background.white};
`;

export const Title = styled.div`
  font-weight: 600;
  font-size: 16px;
  line-height: 20px;
  text-align: center;
  color: ${({ theme }) => theme.colors.highland};
`;

export const Icon = styled.div`
  display: flex;
  justify-content: center;
`;
