import styled, { css } from 'vue-styled-components';

const trProps = {
  isHighlight: Boolean,
};

const trHighlight = css`
  background-color: ${({ theme }) => theme.background.wildSand};
`;

export const Tr = styled('tr', trProps)`
  &:first-child {
    td {
      border-top: 1px solid ${({ theme }) => theme.colors.surfCrest};
    }
  }
  ${({ isHighlight }) => (isHighlight ? trHighlight : '')}
`;

export const Td = styled.td`
  border-top: 1px solid ${({ theme }) => theme.colors.snuff};
  line-height: 18px;
  color: ${({ theme }) => theme.colors.abbey};
`;

export const Assignee = styled.p`
  margin: 0;
  padding: 0;
`;

export const Source = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const Name = styled.span`
  font-weight: 600;
  font-size: 14px;
  line-height: 20px;
  color: ${({ theme }) => theme.colors.shark};
`;

export const Organization = styled.span`
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;
  color: ${({ theme }) => theme.colors.manatee};
`;

export const Actions = styled.div`
  padding-left: 10px;
  border-left: 1px solid ${({ theme }) => theme.colors.ghost};
`;
