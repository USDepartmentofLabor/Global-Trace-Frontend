import styled from 'vue-styled-components';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  gap: 16px;
  padding: 18px 54px 0;
  box-sizing: border-box;

  table {
    thead {
      background-color: ${({ theme }) => theme.background.wildSand};
    }
    th span {
      color: ${({ theme }) => theme.background.highland};
    }
  }
`;

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  padding: 16px;
  background-color: ${({ theme }) => theme.background.alabaster};
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

export const RowStatus = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const Status = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

export const RowActions = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0;

  button {
    padding: 0;
    span:not(.usdol-icon) {
      text-decoration: underline;
    }

    &:disabled {
      background-color: transparent;
      color: ${({ theme }) => theme.colors.spunPearl};
      border-color: none;

      .usdol-icon {
        color: ${({ theme }) => theme.colors.spunPearl};
      }
    }
  }
`;

export const TableHeader = styled.div`
  width: 100%;
  display: flex;
  gap: 16px;
`;
