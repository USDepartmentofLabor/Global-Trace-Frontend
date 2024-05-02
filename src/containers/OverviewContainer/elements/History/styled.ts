import styled, { css, keyframes } from 'vue-styled-components';
import { RESOURCES } from 'config/constants';

const expandAnimation = keyframes`
  from  {
    transform: translateY(-30%);
  }
  to {
    transform: translateY(0);
  }
`;

const borderedProps = {
  isEmpty: Boolean,
};

const iconExpandProps = {
  isExpand: Boolean,
};

export const Table = styled.div`
  table {
    border-collapse: separate;
    border-spacing: 0 12px;
    margin-top: 12px;

    thead {
      display: none;
    }

    tbody {
      tr {
        height: 80px;

        @media (max-width: 576px) {
          height: auto;
        }
        td {
          padding: 12px 0;
          box-sizing: border-box;
          border: 0;

          color: ${({ theme }) => theme.colors.stormGray};
          background-color: ${({ theme }) => theme.background.white};

          &:first-child {
            border-top-left-radius: 8px;
            border-bottom-left-radius: 8px;
            padding-right: 0;
            width: 70px;
            text-align: center;
          }

          &:last-child {
            border-top-right-radius: 8px;
            border-bottom-right-radius: 8px;
          }

          @media (max-width: 576px) {
            display: none;
          }
        }
      }
    }
  }
`;

export const EmptyContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 32px;
  margin-top: 80px;
`;

export const EmptyImage = styled.img.attrs({
  src: RESOURCES.TRANSACTION_EMPTY,
})`
  width: 344px;
  height: 186px;
`;

export const EmptyText = styled.div`
  font-weight: 400;
  font-size: 14px;
  line-height: 18px;

  color: ${({ theme }) => theme.colors.ghost};
`;

export const Tr = styled.tr``;

export const Td = styled.td`
  font-size: 16px;
  line-height: 20px;
  font-weight: 600;
`;

export const TransactionType = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

export const Text = styled.div`
  font-weight: 400;
  font-size: 14px;
  line-height: 18px;

  color: ${({ theme }) => theme.colors.spunPearl};
`;

const colProps = {
  isMultiple: Boolean,
};

export const Col = styled('div', colProps)`
  display: flex;
  flex-direction: column;
  gap: ${({ isMultiple }) => (isMultiple ? '7px' : '14px')};
`;

export const Bordered = styled('div', borderedProps)`
  border-left: 1px solid ${({ theme }) => theme.colors.cornflowerBlue};
  min-height: 32px;
  min-width: 106px;
  display: flex;
  justify-content: center;
  align-items: center;

  @media (max-width: 576px) {
    min-height: 20px;
    min-width: unset;
    border: unset;
    align-items: flex-start;
    justify-content: flex-start;
  }

  ${({ isEmpty }) =>
    isEmpty &&
    css`
      @media (max-width: 576px) {
        min-height: unset;
        min-width: unset;
      }
    `}
`;

export const TransactionDetail = styled.div`
  font-size: 14px;
  line-height: 18px;
  font-weight: 600;
  max-width: 150px;
  word-break: break-word;
  color: ${({ theme }) => theme.colors.stormGray};
`;

export const Transaction = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const Card = styled.div`
  display: none;

  @media (max-width: 576px) {
    display: flex;
    flex-direction: column;
    overflow: hidden;
    padding: 16px;
    gap: 26px;
    background-color: ${({ theme }) => theme.background.white};
  }
`;

export const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const CardHeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const CardHeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const IconExpand = styled('div', iconExpandProps)`
  cursor: pointer;
  transition: all 0.3s ease-out;

  ${({ isExpand }) =>
    isExpand &&
    css`
      @media (max-width: 576px) {
        transform: rotate(-180deg);
      }
    `}
`;

export const CardContent = styled.div`
  flex: 1;
  display: flex;
  align-items: flex-start;
  gap: 16px;
  animation-name: ${expandAnimation};
  animation-duration: 300ms;
`;

export const TransactionContent = styled.div`
  width: 100%;
  display: flex;
  align-items: flex-start;
  flex-direction: column;

  div {
    border: unset;
  }
`;

export const FacilityName = styled.div`
  display: flex;
  align-items: center;
`;
