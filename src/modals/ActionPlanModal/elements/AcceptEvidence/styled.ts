import styled from 'vue-styled-components';

export const Wrapper = styled.div`
  padding: 30px;
  display: flex;
  flex-direction: column;
  gap: 12px;

  & > .ps {
    max-height: calc(100vh - 100px);
  }
`;

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const Text = styled.div`
  font-size: 16px;
  font-weight: 400;
  color: ${({ theme }) => theme.colors.stormGray};
`;

export const Actions = styled.div`
  display: flex;
  justify-content: center;
  gap: 16px;
  padding: 20px;
`;

export const ButtonGroupEnd = styled.div`
  display: flex;
  gap: 16px;
  flex: 1;
  justify-content: flex-end;
`;
