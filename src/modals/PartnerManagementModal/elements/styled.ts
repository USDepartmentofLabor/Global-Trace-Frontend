import styled from 'vue-styled-components';

export const Wrapper = styled.div`
  display: flex;
  gap: 24px;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.ghost};
`;

export const Title = styled.span`
  font-weight: 700;
  color: ${({ theme }) => theme.colors.highland};
  flex: 1;
`;
