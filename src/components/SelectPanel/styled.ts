import styled from 'vue-styled-components';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 8px;
`;

export const Label = styled.div`
  font-weight: 600;
  font-size: 12px;
  line-height: 15px;
  padding: 0 4px;
  color: ${({ theme }) => theme.colors.highland};
`;

export const Content = styled.div`
  display: flex;
  width: 100%;
  gap: 14px;
`;

export const Panel = styled.div`
  padding: 16px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.cornflowerBlue};
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex: 1;

  img {
    width: 170px;
  }
`;
