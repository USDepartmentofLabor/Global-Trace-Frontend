import styled from 'vue-styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Title = styled.div`
  font-weight: 600;
  font-size: 20px;
  text-align: center;
  margin-bottom: 16px;

  color: ${({ theme }) => theme.background.highland};
`;

export const Action = styled.div`
  width: 312px;
  margin-top: 8px;
`;

export const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const ListItem = styled.div`
  display: flex;
  border-radius: 8px;
  padding: 15px;

  background-color: ${({ theme }) => theme.background.white};
  box-shadow: 0px 0px 4px ${({ theme }) => theme.colors.blackTransparent7};

  .usdol-icon {
    cursor: pointer;
  }
`;

export const Name = styled.div`
  flex: 1;
  font-weight: 600;
  font-size: 14px;

  color: ${({ theme }) => theme.background.envy};
`;
