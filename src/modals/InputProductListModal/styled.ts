import styled from 'vue-styled-components';

export const Wrapper = styled.div`
  .ps {
    max-height: calc(100svh - 170px);
  }
`;

export const Footer = styled.div`
  display: flex;
  justify-content: center;
  padding: 16px;
  box-shadow: 0px -4px 4px 4px ${({ theme }) => theme.colors.blackTransparent7};
  background-color: ${({ theme }) => theme.background.white};
`;

export const Header = styled.div`
  display: flex;
  gap: 16px;
  justify-content: center;
  align-items: center;
  padding-top: 24px;
  padding-bottom: 16px;
  box-shadow: 0px 4px 4px rgba(50, 50, 50, 0.08);

  button {
    height: 48px;
  }

  @media (max-width: 576px) {
    width: 100%;
    padding: 16px 0;

    > div {
      &: first-child {
        padding-left: 16px;
      }

      &: last-child {
        padding-right: 16px;
      }
    }
  }
`;

export const Content = styled.div`
  display: flex;
  margin: auto;
  padding: 16px 72px;
  flex-direction: column;
  justify-content: center;

  & > .ps {
    max-height: calc(100svh - 350px);
  }

  @media (max-width: 576px) {
    padding: 16px;
  }
`;

export const Box = styled.div`
  display: flex;
  flex-direction: column;
  padding: 15px 16px;
  border-top: 1px solid ${({ theme }) => theme.colors.ghost};

  &:last-child {
    border-bottom: 1px solid ${({ theme }) => theme.colors.ghost};
  }
`;

export const BoxHeader = styled.div`
  display: flex;
  margin-bottom: 20px;

  .usdol-icon {
    cursor: pointer;
  }
`;

export const Name = styled.div`
  flex: 1;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.envy};
`;

export const InputProductCode = styled.div`
  width: 224px;

  @media (max-width: 576px) {
    width: 100%;
  }
`;
