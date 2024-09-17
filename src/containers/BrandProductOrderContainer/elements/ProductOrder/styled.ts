import styled from 'vue-styled-components';

export const Tr = styled.tr``;

export const Td = styled.td`
  border-top: 1px solid ${({ theme }) => theme.colors.snuff};
  background: transparent;
  line-height: 22px;
`;
