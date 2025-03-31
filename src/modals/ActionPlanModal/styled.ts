import styled from 'vue-styled-components';

export const Loading = styled.div`
  display: flex;
  justify-content: center;
`;

export const SubTitle = styled.div`
  font-weight: 600;
  font-size: 14px;
  line-height: 20px;
  padding-top: 8px;
  color: ${({ theme }) => theme.colors.manatee};
`;

export const IssueDetail = styled.span`
  font-weight: 700;
`;
