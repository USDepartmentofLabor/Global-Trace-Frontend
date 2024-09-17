import styled from 'vue-styled-components';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px 32px;
  gap: 20px;
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-weight: 600;
  font-size: 16px;
  line-height: 24px;
`;

export const Text = styled.span`
  color: ${({ theme }) => theme.colors.envy};

  span {
    color: ${({ theme }) => theme.colors.red};
  }
`;
