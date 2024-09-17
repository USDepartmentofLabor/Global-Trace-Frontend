import styled from 'vue-styled-components';

export const Wrapper = styled.div`
  display: flex;
  width: 312px;
  flex-direction: column;
  text-align: center;
  justify-content: center;
  align-items: center;
`;

export const Title = styled.div`
  font-weight: 800;
  font-size: 32px;
  line-height: 40px;
  text-align: center;
  color: ${({ theme }) => theme.colors.highland};
  margin-bottom: 10px;
`;

export const Description = styled.div`
  font-weight: 600;
  font-size: 12px;
  line-height: 18px;
  color: ${({ theme }) => theme.colors.stormGray};
  white-space: pre;

  @media screen and (max-width: 768px) {
    white-space: inherit;
  }
`;

export const Row = styled.div`
  margin-top: 32px;
  text-align: left;
`;

export const Icon = styled.div`
  margin-bottom: 20px;
`;

export const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 64px;
`;

export const ReturnLink = styled.div`
  display: flex;
  font-size: 12px;
  line-height: 15px;
  margin-top: 15px;
  color: ${({ theme }) => theme.colors.spunPearl};

  .login-link {
    margin-left: 6px;
    color: ${({ theme }) => theme.colors.highland};
  }
`;
