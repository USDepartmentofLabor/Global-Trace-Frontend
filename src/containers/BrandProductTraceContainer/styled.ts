import styled from 'vue-styled-components';

export const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

export const Content = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex: 1;
  justify-content: space-between;
  padding-bottom: 24px;

  @media (max-width: 767px) {
    gap: 0;
  }
`;

export const MapGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 25px;

  .ps {
    width: 100%;
    max-height: calc(100svh - 323px);
  }
`;

export const HeaderWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 6px 32px;
  margin-bottom: 2px;
  box-shadow: 0px 0px 4px rgba(40, 41, 61, 0.1),
    0px 0.5px 2px rgba(96, 97, 112, 0.16);
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const Back = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  cursor: pointer;
`;

export const Label = styled.div`
  color: ${({ theme }) => theme.colors.highland};
  font-weight: 400;
  font-size: 14px;
  line-height: 16px;

  @media (max-width: 992px) {
    display: none;
  }
`;

export const TracingContent = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Information = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  justify-content: center;
  text-align: center;
`;

export const InformationTitle = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.rhino};

  span {
    font-size: 14px;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.stormGray};
  }
`;

const informationActionProps = {
  isShowDetail: Boolean,
};

export const InformationAction = styled('div', informationActionProps)`
  font-size: 12px;
  font-weight: 400;
  color: ${({ theme }) => theme.colors.highland};
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  justify-content: center;

  .usdol-icon {
    transform: rotate(
      ${({ isShowDetail }) => (isShowDetail ? '180deg' : '0deg')}
    );
  }
`;
