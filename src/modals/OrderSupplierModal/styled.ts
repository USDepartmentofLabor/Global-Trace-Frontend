import styled from 'vue-styled-components';

export const Content = styled.div`
  padding: 24px 32px;

  .ps {
    max-height: calc(100svh - 100px);
  }
`;

export const Actions = styled.div`
  display: flex;
  justify-content: center;
  gap: 16px;
`;

export const ButtonGroupEnd = styled.div`
  display: flex;
  gap: 16px;
  flex: 1;
  justify-content: flex-end;
`;

export const Col = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Box = styled.div`
  padding: 10px;
  text-align: center;
  font-size: 12px;
  line-height: 15px;
  color: ${({ theme }) => theme.colors.highland};
  background-color: ${({ theme }) => theme.background.wildSand};
`;

export const Strong = styled.div`
  font-weight: 600;
`;
