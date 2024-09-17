import styled from 'vue-styled-components';

export const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;

  @media (max-width: 576px) {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }
`;

export const BoxWrapper = styled('div', {
  direction: String,
  isShowMassBalance: Boolean,
})`
  width: 100%;
  height: 100%;
  padding: 24px 22px;
  border-radius: 8px;
  display: flex;
  flex-direction: ${(props) => props.direction};
  box-sizing: border-box;
  background: ${({ theme }) => theme.background.white};

  &:nth-child(4) {
    grid-column: ${(props) => (props.isShowMassBalance ? 1 : 2)};
  }

  &:nth-child(5) {
    grid-column: 2;
    grid-row: 2/4;
    justify-content: space-between;
  }
`;

export const Header = styled.div`
  display: flex;
  flex: 1;
`;

export const Label = styled.div`
  font-weight: 600;
  font-size: 16px;
  color: ${({ theme }) => theme.colors.stormGray};
  flex: 1;

  @media (max-width: 576px) {
    grid-column: 1/1;
    padding-bottom: 12px;
  }
`;

export const Body = styled.div`
  flex: 2;
  text-align: center;
  margin: 24px 0;
`;

const totalProps = {
  color: String,
};

export const Total = styled('span', totalProps)`
  font-size: 28px;
  font-weight: 800;

  color: ${(props) => props.color};
`;

export const Unit = styled.span`
  padding-left: 10px;
  font-weight: 600;
  font-size: 16px;
  color: ${({ theme }) => theme.colors.stormGray};
`;

export const MassBalanceInfo = styled.div`
  display: flex;
  flex-direction: column;

  @media (max-width: 576px) {
    grid-column: 2/2;
  }
`;

export const MassBalanceDetail = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const MassBalance = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const textProps = {
  dotColor: String,
};

export const Text = styled('div', textProps)`
  position: relative;
  padding-left: 14px;
  font-weight: 700;
  font-size: 12px;

  color: ${({ theme }) => theme.colors.spunPearl};

  &:before {
    content: '';
    position: absolute;
    left: 0;
    top: 3px;
    width: 8px;
    height: 8px;
    border-radius: 50%;

    background-color: ${(props) => props.theme.colors[props.dotColor]};
  }
`;

export const Strong = styled.div`
  font-weight: 400;
  font-size: 12px;

  color: ${({ theme }) => theme.colors.stormGray};
`;

export const MassBalanceContainer = styled.div`
  flex: 1;
  display: grid;
  grid-template-columns: 1fr 1fr;
  width: 100%;
  align-items: center;
  grid-template-rows: 34px 1fr;
`;

export const Chart = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  @media (max-width: 576px) {
    grid-column: 2/1;
  }
`;

export const MassBalanceContent = styled.div`
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  gap: 8px;
  font-size: 12px;
  text-align: right;
  color: ${({ theme }) => theme.colors.spunPearl};

  @media (max-width: 576px) {
    grid-row: 4;
    grid-column: 1/4;
    text-align: center;
    padding-top: 30px;
  }
`;

export const Verified = styled.div`
  font-weight: 400;
`;

export const LastUpdate = styled.div`
  font-weight: 700;
`;

export const EmptyChart = styled.div`
  width: 83px;
  height: 83px;
  border: 9px solid ${({ theme }) => theme.colors.wildSand};
  border-radius: 50%;
`;

export const Error = styled.div`
  font-weight: 400;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.red};
`;
