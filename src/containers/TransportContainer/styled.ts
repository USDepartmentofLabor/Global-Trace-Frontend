import styled from 'vue-styled-components';

export const Container = styled.div`
  display: flex;
  min-height: 100%;
  flex-direction: column;

  @media (max-width: 767px) {
    justify-content: flex-start;
    padding: 16px;
  }
`;

export const Wrapper = styled.div`
  width: 312px;
  margin: 30px auto;

  @media (max-width: 576px) {
    width: 100%;
    margin: 0;
  }
`;

export const Title = styled.div`
  font-weight: 800;
  text-align: center;
  margin-bottom: 32px;
  font-size: 24px;
  line-height: 30px;
  color: ${(props) => props.theme.colors.highland};
`;

export const Form = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const Row = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Label = styled.div`
  font-size: 14px;
  line-height: 20px;
  padding: 0 4px;
  font-weight: 400;
  color: ${({ theme }) => theme.colors.highland};
`;

export const Line = styled.div`
  margin: 8px 0;
  border-top: 1px solid ${(props) => props.theme.colors.ghost};
`;

export const Action = styled.div`
  margin-top: 48px;
`;
