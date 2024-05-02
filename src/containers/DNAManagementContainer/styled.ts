import styled, { css } from 'vue-styled-components';
import { RESOURCES } from 'config/constants';

export const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 27px 40px;

  table {
    thead {
      background-color: ${({ theme }) => theme.background.wildSand};
    }
  }

  @media (max-width: 920px) {
    padding: 14px;
  }
`;

export const HeaderAction = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
`;

export const EmptyRow = styled.div`
  min-height: 180px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const Tr = styled.tr`
  td {
    color: ${(props) => props.theme.colors.abbey};
  }
`;

export const Td = styled.td`
  border-top: 1px solid ${({ theme }) => theme.colors.snuff};
  background: transparent;
  line-height: 22px;
`;

export const DNAEmptyImage = styled.img.attrs({
  src: RESOURCES.DNA_EMPTY,
})`
  width: 290px;
  height: 260px;
`;

export const EmptyContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 86px;
`;

export const EmptyText = styled.div`
  font-weight: 600;
  font-size: 14px;
  text-align: center;
  white-space: pre;

  color: ${({ theme }) => theme.colors.abbey};
`;

const statusProps = {
  status: String,
};

const statusCss = {
  failed: css`
    color: ${({ theme }) => theme.colors.red};
  `,
  passed: css`
    color: ${({ theme }) => theme.colors.highland};
  `,
};

export const Status = styled('div', statusProps)`
  font-weight: 600;
  font-size: 14px;
  line-height: 18px;
  ${({ status }) => statusCss[status]}
`;

export const ProofLinkList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

export const ProofLink = styled.div`
  font-weight: 400;
  font-size: 14px;
  line-height: 18px;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.highland};
`;
