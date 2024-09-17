import styled, { css } from 'vue-styled-components';
import resources from 'config/resources';

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
`;

export const ViewHistory = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  font-weight: 400;
  font-size: 14px;
  text-decoration: underline;
  cursor: pointer;

  color: ${(props) => props.theme.colors.stormGray};
`;

export const Empty = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  gap: 16px;
`;

export const EmptyImage = styled.img.attrs({
  src: resources.EMPTY_UPLOAD_TRANSLATE,
})`
  width: 265px;
  height: 215px;
`;

export const EmptyText = styled.div`
  font-weight: 400;
  font-size: 14px;
  text-align: center;
  white-space: pre;
  line-height: 40px;
  color: ${({ theme }) => theme.colors.abbey};
`;

export const EmptyAction = styled.div`
  display: flex;
  gap: 8px;
`;

export const EmptyRow = styled.div`
  min-height: 180px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const Tr = styled.tr`
  cursor: pointer;
  td {
    color: ${(props) => props.theme.colors.abbey};
  }
`;

export const Td = styled.td`
  border-top: 1px solid ${({ theme }) => theme.colors.snuff};
  background: transparent;
  line-height: 22px;
`;

export const RowActions = styled.div`
  display: flex;
  border-left: 1px solid ${({ theme }) => theme.colors.ghost};
  justify-content: space-between;
  padding: 0 10px;

  button span:not(.usdol-icon) {
    text-decoration: underline;
  }
`;

export const Quantity = styled.div`
  font-weight: 600;
  font-size: 16px;

  color: ${({ theme }) => theme.colors.abbey};
`;

export const StatusContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const statusProps = {
  variant: String,
};

const statusVariant = {
  Draft: css`
    &:before {
      background-color: ${({ theme }) => theme.colors.spunPearl};
    }
  `,
  New: css`
    &:before {
      background-color: ${({ theme }) => theme.colors.royalBlue};
    }
  `,
  'In progress': css`
    &:before {
      background-color: ${({ theme }) => theme.colors.diSerria};
    }
  `,
  'Under review': css`
    &:before {
      background-color: ${({ theme }) => theme.colors.jungleGreen};
    }
  `,
  Resolved: css`
    &:before {
      background-color: ${({ theme }) => theme.colors.green2};
    }
  `,
  Overdue: css`
    color: ${({ theme }) => theme.colors.crail};
    &:before {
      background-color: ${({ theme }) => theme.colors.crail};
    }
  `,
};

export const Status = styled('div', statusProps)`
  display: flex;
  align-items: center;
  gap: 8px;
  ${({ variant }) => statusVariant[variant]}

  &:before {
    content: '';
    display: block;
    width: 8px;
    height: 8px;
    border-radius: 10px;
  }
`;

export const Total = styled.div`
  font-weight: 400;
  font-size: 14px;

  color: ${({ theme }) => theme.colors.abbey};
`;

export const Action = styled.div`
  width: max-content;
  display: flex;
  padding: 6px 0;
  gap: 4px;
  cursor: pointer;
`;

export const ActionLabel = styled.div`
  justify-content: center;
  text-decoration: underline;
  font-size: 12px;
  font-weight: 400;
  color: ${({ theme }) => theme.colors.stormGray};
`;
