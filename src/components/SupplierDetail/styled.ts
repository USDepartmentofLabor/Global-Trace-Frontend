import styled from 'vue-styled-components';

const wrapperProps = {
  isShow: Boolean,
};

export const Wrapper = styled('div', wrapperProps)`
  position: fixed;
  top: 90px;
  bottom: 0;
  right: 0;
  width: 100%;
  background-color: ${({ theme }) => theme.background.white};
  box-shadow: -4px 0px 4px rgba(100, 100, 94, 0.12);
  transition: transform 0.35s;
  transform: ${(props) =>
    !props.isShow ? 'translateX(2000px)' : 'translateX(0)'};
  z-index: 2;

  @media screen and (max-width: 768px) {
    width: 100%;
    top: 68px;
  }
`;

export const Container = styled.div`
  max-height: calc(100svh - 90px);
  overflow-y: auto;
`;

export const Content = styled.div`
  width: 100%;
`;

export const Header = styled.div`
  display: flex;
  padding: 24px;
  gap: 16px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.snuff};
  background-color: ${({ theme }) => theme.background.wildSand};

  @media screen and (max-width: 768px) {
    flex-direction: column;
  }
`;

export const Title = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
  gap: 16px;
  font-size: 24px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.rhino};
`;

export const Back = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
  font-size: 24px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.rhino};
  cursor: pointer;
`;

export const SupplierName = styled.div`
  flex: 1;
`;

export const RiskGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const Tabs = styled.div`
  width: 100%;
`;

export const Empty = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  justify-content: center;
  align-items: center;
`;
