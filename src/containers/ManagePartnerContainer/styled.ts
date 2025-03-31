import styled from 'vue-styled-components';

export const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  padding: 16px 32px 32px 32px;
  gap: 16px;
  background-color: ${({ theme }) => theme.background.white};

  @media (max-width: 576px) {
    padding: 16px;
  }
`;

export const Action = styled.div`
  display: flex;
  width: 100%;
  justify-content: flex-end;

  > div {
    flex: 0 0 250px;

    @media (max-width: 576px) {
      flex: 1;
      width: 100%;
    }
  }
`;

export const Title = styled.div`
  display: none;

  @media (max-width: 576px) {
    display: block;
    text-align: center;
    font-weight: 800;
    font-size: 20px;
    line-height: 25px;
    color: ${({ theme }) => theme.colors.envy};
  }
`;

export const Tr = styled.tr`
  td {
    color: ${({ theme }) => theme.colors.stormGray};

    &:last-child {
      padding: 0;
    }
  }
`;

export const Td = styled.td`
  word-break: break-word;
  background: transparent;
  line-height: 22px;
`;

export const RowActions = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0 10px;

  button .usdol-icon {
    margin-right: 0;
  }
`;

export const EmptyData = styled.div`
  min-height: 180px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;
