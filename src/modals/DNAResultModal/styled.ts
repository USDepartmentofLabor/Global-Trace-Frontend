import styled from 'vue-styled-components';

export const Wrapper = styled.div`
  padding: 24px 32px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const Icon = styled.div`
  display: flex;
  justify-content: center;
`;

export const Title = styled.div`
  font-size: 14px;
  font-weight: 600;
  text-align: center;
  color: ${({ theme }) => theme.colors.shark};
`;

const resultProps = {
  isSuccess: Boolean,
};

export const Result = styled('div', resultProps)`
  font-size: 16px;
  font-weight: 700;
  text-align: center;
  color: ${({ theme, isSuccess }) =>
    isSuccess ? theme.colors.highland : theme.colors.alizarinCrimson};
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px 24px;
  border-radius: 16px;
  background-color: ${({ theme }) => theme.background.wildSand};
`;

export const ResultGroup = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.manatee};
`;

export const Value = styled.div`
  font-size: 12px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.shark};
`;
