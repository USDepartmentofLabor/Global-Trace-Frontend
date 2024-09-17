import styled from 'vue-styled-components';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 690px;
  justify-content: center;
  margin: 30px auto;
`;

export const Title = styled.span`
  font-size: 28px;
  line-height: 35px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.stormGray};
  text-align: center;
`;

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: 6px;
  padding: 12px 14px;
  margin: 21px 0;
`;

export const BrandContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 0 0 100%;
`;

export const Col = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
`;

export const Row = styled.div`
  margin-top: 13px;
  display: flex;
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: 52% auto;
  column-gap: 18px;
  width: 100%;

  @media (max-width: 992px) {
    display: flex;
    flex-direction: column;
  }
`;

export const HeadQuarter = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  column-gap: 20px;
  row-gap: 10px;
  width: 100%;

  div:last-child {
    grid-column: 1 / 4;
  }
`;

export const Text = styled.span`
  font-size: 16px;
  line-height: 20px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.stormGray};
`;

export const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Form = styled.div`
  display: flex;
  padding: 20px 0;
`;

export const Label = styled.span`
  margin-left: 12px;
  margin-bottom: 4px;
  font-size: 14px;
  line-height: 20px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.highland};
`;

export const Action = styled.div`
  display: flex;
  justify-content: center;
`;
