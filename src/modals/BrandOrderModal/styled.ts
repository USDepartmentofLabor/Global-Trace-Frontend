import styled from 'vue-styled-components';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 24px 32px;

  .ps {
    max-height: calc(100svh - 90px);
  }
`;

export const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px;

  @media (max-width: 992px) {
    flex-direction: column;
    gap: 8px;
    margin-top: 10px;
  }
`;

export const Col = styled.div`
  display: flex;
  align-items: flex-start;
  flex-direction: column;
`;

export const AddSupplierText = styled.span`
  font-weight: 400;
  font-size: 12px;
  line-height: 15px;
  text-decoration: underline;
  margin: 8px 0 0 14px;
  color: ${({ theme }) => theme.colors.envy};
  cursor: pointer;
`;

export const Actions = styled.div`
  display: flex;
  gap: 16px;
`;

export const ButtonGroupEnd = styled.div`
  display: flex;
  gap: 16px;
  flex: 1;
  justify-content: flex-end;
`;
