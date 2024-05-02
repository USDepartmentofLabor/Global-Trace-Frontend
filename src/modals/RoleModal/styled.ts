import styled from 'vue-styled-components';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
  padding-right: 0;
`;

export const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;

  .ps {
    max-height: calc(100svh - 450px);
    padding-right: 20px;
    margin-bottom: 8px;
  }
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Info = styled.div`
  width: 100%;
  display: flex;
  gap: 16px;
`;

export const Location = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 10px;
  row-gap: 10px;
  width: 100%;
`;

export const Col = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Row = styled.div`
  display: flex;
  justify-content: center;
`;

export const AreaWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const Area = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 10px;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.background.wildSand};
`;

export const Label = styled.span`
  font-weight: 600;
  font-size: 12px;
  line-height: 15px;
  padding-left: 4px;
  flex: 1;
  color: ${({ theme }) => theme.colors.highland};
`;

export const SubLabel = styled.span`
  font-weight: 400;
  font-size: 12px;
  line-height: 15px;
  color: ${({ theme }) => theme.colors.highland};
`;

export const Point = styled.div`
  display: grid;
  grid-template-columns: 50px 264px 264px;
  gap: 10px;
  margin-bottom: 12px;
`;

export const PointHeader = styled.span`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-weight: 600;
  font-size: 12px;
  line-height: 15px;
  color: ${({ theme }) => theme.colors.spunPearl};
`;

export const Remove = styled.div`
  display: flex;
  justify-content: center;
  cursor: pointer;
`;

export const FarmRisk = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const Template = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 10px;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.background.wildSand};
`;

export const Actions = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
`;

export const FileName = styled.label`
  font-weight: 600;
  font-size: 14px;
  line-height: 18px;
  color: ${({ theme }) => theme.colors.highland};
  margin-bottom: 10px;
`;

export const Raw = styled.div`
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 8px;
`;

export const Title = styled.div`
  text-align: center;
  margin-bottom: 12px;
  font-weight: 700;
  font-size: 18px;
  color: ${({ theme }) => theme.colors.stormGray};
`;
