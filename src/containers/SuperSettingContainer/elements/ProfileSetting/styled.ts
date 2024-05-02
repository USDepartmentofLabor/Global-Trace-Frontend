import styled from 'vue-styled-components';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  box-sizing: border-box;
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

    &:nth-child(3) {
      flex: 2;
    }

    &:last-child {
      flex: inherit;
      display: flex;
      justify-content: end;
      flex-direction: column;
    }
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
