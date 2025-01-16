import styled from 'vue-styled-components';

export const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  background: ${({ theme }) => theme.background.wildSand};
`;

export const Loading = styled.div`
  display: flex;
  justify-content: center;
`;

export const PanelWrapper = styled.div`
  display: flex;
  justify-content: center;
  height: 100%;
  min-height: calc(100svh - 90px);
  background: ${({ theme }) => theme.background.wildSand};

  @media (max-width: 576px) {
    padding: 0 15px;
  }

  @media (max-width: 768px) {
    min-height: calc(100svh - 68px);
  }
`;

export const Box = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  padding: 48px 0;
  height: max-content;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const Panel = styled.div`
  width: 620px;
  overflow: hidden;
  border-radius: 24px;
  cursor: pointer;
  background: ${({ theme }) => theme.background.white};
  box-shadow: 0px 2px 4px -1px ${({ theme }) => theme.colors.blackTransparent6};
  box-shadow: 0px 4px 6px -1px ${({ theme }) => theme.colors.blackTransparent1};

  &:hover {
    outline: 6px solid ${({ theme }) => theme.colors.envy};
  }

  @media (max-width: 576px) {
    width: 100%;
  }
`;

export const PanelFooter = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 12px 20px;
  font-weight: 800;
  font-size: 24px;
  line-height: 30px;
  color: ${({ theme }) => theme.colors.highland};
  background: ${({ theme }) => theme.background.white};
`;

export const Container = styled.div`
  overflow-y: auto;
  max-height: calc(100svh - 90px);

  @media (max-width: 768px) {
    min-height: calc(100svh - 68px);
  }
`;

export const Content = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  top: 90px;
  right: 0;
  bottom: 0;
  left: 0;
  background: ${({ theme }) => theme.background.wildSand};

  @media (max-width: 767px) {
    top: 67px;
  }
`;

const imgProps = {
  name: String,
};

export const PanelImage = styled('img', imgProps)`
  width: 100%;

  @media (max-width: 576px) {
    width: 100%;
  }
`;
