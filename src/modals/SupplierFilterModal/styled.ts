import styled from 'vue-styled-components';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 16px 24px;

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
  padding: 24px 30px 0;
`;

export const Loading = styled.div`
  display: flex;
  justify-content: center;
`;

export const InputGroup = styled.div`
  display: flex;
  gap: 8px;
`;
