import styled from 'vue-styled-components';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  align-items: center;
`;

export const Box = styled.div`
  display: flex;
  padding: 24px 32px 32px 32px;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.highland};
  background: ${({ theme }) => theme.background.alabaster};
`;

export const Title = styled.div`
  font-size: 14px;
  font-weight: 400;
  line-height: 18px;
  color: ${({ theme }) => theme.colors.highland};
`;

export const Input = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  flex: 1;
`;

export const Actions = styled.div`
  display: flex;
  justify-content: center;
  gap: 16px;
`;
