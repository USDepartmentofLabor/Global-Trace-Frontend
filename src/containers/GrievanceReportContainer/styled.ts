import styled, { css } from 'vue-styled-components';
import { RESOURCES } from 'config/constants';

export const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 27px 18px;

  table {
    thead {
      background-color: ${({ theme }) => theme.background.wildSand};
    }
  }
`;

export const HeaderAction = styled.div`
  display: flex;
`;

export const EmptyData = styled.div`
  min-height: 180px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

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

export const Email = styled.p`
  max-width: 300px;
  text-overflow: ellipsis;
  overflow: hidden;
`;

export const Actions = styled.div`
  padding-left: 10px;
  border-left: 1px solid ${({ theme }) => theme.colors.ghost};
`;

export const GrievanceEmptyImage = styled.img.attrs({
  src: RESOURCES.GRIEVANCE_EMPTY,
})`
  width: 254px;
  height: 271px;
`;

export const EmptyContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 25px;
  margin-top: 32px;
`;

export const EmptyText = styled.div`
  font-weight: 600;
  font-size: 14px;
  text-align: center;
  white-space: pre;

  color: ${({ theme }) => theme.colors.abbey};
`;
