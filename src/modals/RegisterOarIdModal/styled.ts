import styled from 'vue-styled-components';

export const Wrapper = styled.div`
  .ps {
    max-height: calc(100svh - 170px);
  }
`;

export const Content = styled.div`
  margin-top: 24px;
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
