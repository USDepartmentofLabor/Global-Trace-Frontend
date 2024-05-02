import styled from 'vue-styled-components';

export const BoxHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  .usdol-icon {
    cursor: pointer;
  }
`;

export const Name = styled.div`
  width: 230px;
  font-weight: 400;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.abbey};
`;

export const Type = styled.div`
  width: 92px;
  font-weight: 400;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.abbey};
`;

export const Checkbox = styled.div`
  padding: 16px 0;
`;
