import styled from 'vue-styled-components';

export const Wrapper = styled.div`
  display: flex;
  padding: 20px;

  > div {
    display: flex;
    width: 100%;
  }
`;

export const Container = styled.div`
  .ps {
    width: 100%;
    max-height: calc(100svh - 180px);
  }
`;

export const Loading = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

export const FacilityInputs = styled.div`
  display: flex;
  gap: 24px;
  align-items: flex-end;

  @media (max-width: 767px) {
    flex-direction: column;
  }
`;

export const FacilityInfo = styled.div`
  display: grid;
  grid-template-columns: 175px 1fr;
  gap: 8px;

  @media (max-width: 576px) {
    grid-template-columns: auto;
    grid-template-rows: repeat(2, minmax(0, 1fr));
    align-items: flex-start;
  }
`;

export const FacilityListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const Label = styled.div`
  padding: 0 4px;
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.highland};
`;

export const FacilityList = styled.div`
  display: flex;
  flex-direction: column;
  padding: 8px;
  border: 1px solid ${({ theme }) => theme.colors.highland};
  border-radius: 8px;

  .ps {
    height: 233px;
  }
`;

export const FacilityDetail = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 8px 10px;
  background-color: ${({ theme }) => theme.background.wildSand};
  margin-bottom: 6px;
  border-radius: 6px;
`;

export const Facility = styled.div`
  display: grid;
  grid-template-columns: 132px 1fr auto 1fr;
  grid-gap: 8px;
  padding: 10px;

  @media (max-width: 576px) {
    grid-template-columns: auto;
    grid-template-rows: repeat(2, 1fr);
  }
`;

export const FacilityHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const FacilityName = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.highland};
`;

export const Field = styled.div`
  font-weight: 400;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.spunPearl};
`;

export const Value = styled.div`
  font-weight: 600;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.stormGray};
`;

export const Actions = styled.div`
  display: flex;
  justify-content: center;

  @media (max-width: 576px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;
