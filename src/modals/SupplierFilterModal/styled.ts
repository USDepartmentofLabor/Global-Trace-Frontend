import styled from 'vue-styled-components';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 24px 32px;

  .ps {
    max-height: calc(100svh - 160px);
  }
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

export const Actions = styled.div`
  display: flex;
  justify-content: center;
  gap: 16px;
  padding-top: 24px;
`;

export const ButtonGroupEnd = styled.div`
  display: flex;
  gap: 16px;
  flex: 1;
  justify-content: flex-end;
`;

export const Loading = styled.div`
  display: flex;
  justify-content: center;
`;
