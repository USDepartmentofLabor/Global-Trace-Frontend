import styled from 'vue-styled-components';

export const Td = styled.td`
  font-weight: 400;
  font-size: 14px;
  line-height: 18px;
  color: ${({ theme }) => theme.colors.abbey};
`;

export const Tr = styled.tr``;

export const Action = styled.div`
  display: flex;
  justify-content: flex-end;
  border-left: 1px solid ${({ theme }) => theme.colors.ghost};
  padding-left: 10px;
`;

export const EmptyData = styled.div`
  min-height: 180px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;
