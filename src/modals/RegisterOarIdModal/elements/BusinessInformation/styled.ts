import styled from 'vue-styled-components';

export const Title = styled.div`
  text-align: center;
  font-weight: bold;
  font-size: 14px;
  line-height: 18px;
  margin-bottom: 16px;
  color: ${({ theme }) => theme.colors.highland};
`;

export const Label = styled.div`
  font-size: 14px;
  line-height: 20px;
  padding: 0 4px;
  font-weight: 400;
  text-align: left;
  color: ${({ theme }) => theme.colors.highland};
`;

export const Form = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
  padding: 0 32px;
`;

export const Content = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 24px;
  > div {
    width: 312px;
  }

  @media (max-width: 992px) {
    > div {
      width: 100%;
    }
  }
`;

export const Dropdown = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Action = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  margin-bottom: 32px;
`;

export const Error = styled.span`
  color: ${({ theme }) => theme.colors.red};
  margin-bottom: 8px;
`;
