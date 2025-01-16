import styled from 'vue-styled-components';
import resources from 'config/resources';

export const Container = styled.div`
  display: flex;
  min-height: 100%;
  flex-direction: column;
  justify-content: center;
`;

export const Top = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 24px 40px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.snuff};
`;

export const Back = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
  font-size: 24px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.eastBay};
  cursor: pointer;
`;

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 24px;

  height: 100%;
  padding: 24px 40px;
  .ps {
    height: calc(100% - 54px);
    padding: 0 14px;
  }
`;

export const Actions = styled.div`
  display: flex;
  gap: 24px;
  button {
    font-size: 14px;
    line-height: 22px;
  }
`;

export const Empty = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  gap: 16px;
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

export const EmptyAction = styled.div`
  display: flex;
  gap: 8px;
`;

export const FileList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

export const FileItem = styled.div`
  display: flex;
  padding: 8px 16px;
  background-color: ${({ theme }) => theme.background.athensGray2};
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.whiteLilac};
  align-items: center;
  gap: 16px;
  cursor: pointer;
`;

export const Icon = styled.img`
  display: inline-block;
  height: 48px;
`;

export const FileInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  color: ${({ theme }) => theme.colors.eastBay};

  span:first-child {
    font-size: 14px;
    font-weight: 600;
    line-height: 20px;
  }

  span:last-child {
    font-size: 12px;
    font-weight: 400;
    line-height: 18px;
  }
`;
