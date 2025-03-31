import styled from 'vue-styled-components';
import resources from 'config/resources';

const filterDownloadProps = {
  isEnd: Boolean,
};

export const FilterDownload = styled('div', filterDownloadProps)`
  display: flex;
  align-items: center;
  justify-content: ${({ isEnd }) => (isEnd ? 'flex-end' : 'space-between')};
  padding: 16px 26px;
  background-color: ${({ theme }) => theme.background.white};
  border-bottom: 1px solid ${({ theme }) => theme.colors.ghost};
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
