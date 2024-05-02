import styled from 'vue-styled-components';

export const Wrapper = styled.div`
  .ps {
    max-height: calc(100svh - 170px);
  }
`;

export const Content = styled.div`
  margin-top: 24px;
`;

export const Footer = styled.div`
  display: flex;
  justify-content: center;
  padding: 16px;

  box-shadow: 0px -4px 4px 4px ${({ theme }) => theme.colors.blackTransparent6};
  background-color: ${({ theme }) => theme.background.white};
`;
