import styled from 'vue-styled-components';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 32px;

  .ps {
    max-height: calc(100svh - 300px);
    margin: 0 -30px;
    padding: 0 30px;
  }
`;

export const List = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Item = styled.div`
  padding: 16px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid ${({ theme }) => theme.colors.wildSand};

  .usdol-icon {
    cursor: pointer;
  }
`;

export const Actions = styled.div`
  display: flex;
  justify-content: center;
  gap: 16px;
  padding-top: 24px;
`;

export const ButtonGroupEnd = styled.div`
  display: flex;
  gap: 16px;
  flex: 1;
  justify-content: flex-end;
`;

export const AttributeActions = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 16px;
`;

export const AttributeType = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.stormGray};
`;
