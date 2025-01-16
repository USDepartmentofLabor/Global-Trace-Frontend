import styled from 'vue-styled-components';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 312px;

  .formulate-form {
    width: 100%;
  }

  .forgot-password-link {
    text-align: center;
    font-size: 14px;
    line-height: 18px;
    color: ${({ theme }) => theme.colors.stormGray};
    margin-top: 48px;
  }
`;

export const Title = styled.div`
  font-weight: 800;
  font-size: 32px;
  line-height: 40px;
  text-align: center;
  color: ${({ theme }) => theme.colors.highland};
  margin-bottom: 52px;
`;

export const Row = styled.div`
  margin-bottom: 20px;
`;

export const ButtonWrap = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 64px;
`;
