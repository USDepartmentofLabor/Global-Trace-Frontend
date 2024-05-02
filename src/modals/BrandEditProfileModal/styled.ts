import styled from 'vue-styled-components';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
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
  padding: 12px 30px;
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

  @media (max-width: 992px) {
    gap: 12px;
  }
`;

export const Row = styled.div`
  display: flex;
  gap: 30px;

  @media (max-width: 767px) {
    padding: 0 30px;
    width: 100%;
    gap: 4px;
    flex-direction: column-reverse;
  }
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: 52% auto;
  column-gap: 18px;
  width: 100%;

  @media (min-width: 992px) {
    & > div:first-child {
      margin-bottom: 26px;
    }
  }

  @media (max-width: 992px) {
    display: flex;
    flex-direction: column;

    & > div:first-child {
      margin-bottom: 6px;
    }
  }
`;

export const HeadQuarter = styled.div`
  display: grid;
  grid-template-columns: 208px 208px 208px;
  column-gap: 20px;
  row-gap: 10px;
  width: 100%;

  div:last-child {
    grid-column: 1 / 4;
  }

  @media (max-width: 992px) {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
`;

export const Text = styled.span`
  margin-left: 12px;
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
