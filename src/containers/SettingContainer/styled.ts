import styled from 'vue-styled-components';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 30px 50px;
  box-sizing: border-box;

  @media (max-width: 920px) {
    padding: 15px 25px;
  }
`;

export const Title = styled.div`
  font-size: 24px;
  font-weight: 800;
  line-height: 30px;
  color: ${({ theme }) => theme.colors.highland};
`;

export const Row = styled.div`
  display: flex;
  margin-top: 15px;
  flex: 1;
  flex-direction: column;
`;

export const Inputs = styled.div`
  display: flex;
  gap: 20px;

  & > div {
    flex: 1;

    &:last-child {
      flex: 2;
    }
  }

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 10px;
  }
`;

export const Form = styled.div`
  display: flex;
  margin-top: 33px;
  gap: 20px;
  flex-direction: column;
`;

export const Button = styled.div`
  margin-top: 20px;
`;

export const Account = styled.div`
  margin-top: 32px;
`;
