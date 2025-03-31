import styled from 'vue-styled-components';

export const ErrorMessage = styled.p`
  font-size: 14px;
  line-height: 22px;
  color: ${({ theme }) => theme.colors.red};
  text-align: right;
  margin: 4px 0 0;
`;
