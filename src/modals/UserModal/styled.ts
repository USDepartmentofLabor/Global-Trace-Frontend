import styled from 'vue-styled-components';

export const Content = styled.div`
  padding: 24px 32px;

  @media (max-width: 576px) {
    padding: 16px;
  }

  .ps {
    width: 100%;
    max-height: calc(100svh - 180px);
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;

  @media (max-width: 576px) {
    flex-direction: column;

    > div {
      width: 100%;
    }
  }
`;

export const ButtonGroupEnd = styled.div`
  display: flex;
  gap: 16px;
  flex: 1;
  justify-content: flex-end;
`;

export const Loading = styled.div`
  min-height: 180px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;
