import styled from 'vue-styled-components';

export const Wrapper = styled.div`
  padding: 24px 32px;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const Group = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;

  .usdol-icon {
    width: 24px;
  }
`;

export const Row = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: center;
`;

export const Label = styled.div`
  font-size: 16px;
  font-weight: 400;
  color: ${({ theme }) => theme.colors.stormGray};
`;

export const Value = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.stormGray};
`;

export const Actions = styled.div`
  display: flex;
  justify-content: center;
  gap: 16px;
  padding: 16px 32px 24px;
`;

export const ButtonGroupEnd = styled.div`
  display: flex;
  gap: 16px;
  flex: 1;
  justify-content: flex-end;
`;
