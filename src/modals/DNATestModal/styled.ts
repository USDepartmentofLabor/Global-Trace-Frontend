import styled from 'vue-styled-components';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 16px 0;

  .ps {
    max-height: calc(100svh - 160px);
  }
`;

export const Actions = styled.div`
  display: flex;
  gap: 16px;
  padding: 0 30px;

  @media (max-width: 767px) {
    flex-direction: column-reverse;
    gap: 4px;
  }

  & > div {
    width: 100%;
  }
`;

export const Loading = styled.div`
  display: flex;
  justify-content: center;
`;
