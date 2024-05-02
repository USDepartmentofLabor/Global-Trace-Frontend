import styled from 'vue-styled-components';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 30px 36px;
`;

export const Form = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
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
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 34px;
  gap: 14px;
`;
