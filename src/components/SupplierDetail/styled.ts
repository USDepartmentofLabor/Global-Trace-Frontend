import styled from 'vue-styled-components';
import resources from 'config/resources';

const textProps = {
  isBig: Boolean,
  color: String,
};

const wrapperProps = {
  isShow: Boolean,
};

export const Wrapper = styled('div', wrapperProps)`
  position: fixed;
  top: 90px;
  bottom: 0;
  right: 0;
  width: 100%;
  background-color: ${({ theme }) => theme.background.wildSand};
  box-shadow: -4px 0px 4px rgba(100, 100, 94, 0.12);
  transition: transform 0.35s;
  transform: ${(props) =>
    !props.isShow ? 'translateX(2000px)' : 'translateX(0)'};
  z-index: 1;

  @media screen and (max-width: 768px) {
    width: 100%;
    top: 68px;
  }

  & > .ps {
    max-height: 100%;
  }
`;

export const Header = styled.div`
  display: flex;
  flex-direction: column;
  padding: 24px;
  gap: 16px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.snuff};
`;

export const Title = styled.div`
  display: flex;
  align-items: center;
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

export const RickInformation = styled.div`
  display: flex;
  gap: 24px;

  @media (max-width: 992px) {
    flex-direction: column;
  }
`;

export const Information = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  width: 100%;

  @media (max-width: 992px) {
    grid-template-columns: 1fr;
  }
`;

export const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

export const InfoTitle = styled('div', textProps)`
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: ${({ isBig }) => (isBig ? '14px' : '12px')};
  font-weight: ${({ isBig }) => (isBig ? '600' : '400')};
  color: ${({ theme }) => theme.colors.stormGray};
`;

const filterDownloadProps = {
  isEnd: Boolean,
};

export const FilterDownload = styled('div', filterDownloadProps)`
  display: flex;
  align-items: center;
  justify-content: ${({ isEnd }) => (isEnd ? 'flex-end' : 'space-between')};
  padding: 16px 26px;
  background-color: ${({ theme }) => theme.background.athensGray};
`;

export const Filter = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
`;

export const Action = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 16px;
  font-weight: 400;
  cursor: pointer;
`;

export const Clear = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 16px;
  font-weight: 400;
  color: ${({ theme }) => theme.colors.red};
  cursor: pointer;
`;

export const DownloadLabel = styled.div`
  color: ${({ theme }) => theme.colors.highland};
`;

export const Empty = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  justify-content: center;
  align-items: center;
`;

export const EmptyImage = styled.img.attrs({
  src: resources.EMPTY_UPLOAD_TRANSLATE,
})`
  width: 265px;
  height: 215px;
`;

export const EmptyText = styled.div`
  font-weight: 400;
  font-size: 14px;
  text-align: center;
  white-space: pre;
  line-height: 40px;
  color: ${({ theme }) => theme.colors.abbey};
`;
