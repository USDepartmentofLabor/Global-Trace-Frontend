import styled from 'vue-styled-components';
import resources from 'config/resources';

export const TranslationType = styled.span`
  font-weight: 700;
  font-size: 16px;
  line-height: 24px;
  color: ${({ theme }) => theme.colors.highland};
`;

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
  row-gap: 12px;
  column-gap: 24px;
  flex-wrap: wrap;

  button {
    font-size: 14px;
    line-height: 22px;
  }
`;

export const Empty = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
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
  font-weight: 700;
  font-size: 16px;
  text-align: center;
  white-space: pre;
  line-height: 24px;
  color: ${({ theme }) => theme.colors.highland};
`;

export const EmptyDescription = styled.div`
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
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
  flex: 1;
  color: ${({ theme }) => theme.colors.eastBay};
`;

export const ExtraInfo = styled.div`
  display: flex;
  gap: 4px;
  align-items: center;

  span {
    font-size: 12px;
    font-weight: 400;
    line-height: 18px;
  }
`;

export const FileCreatedAt = styled.span`
  &:before {
    content: '•';
    font-family: 'Inter';
    margin-right: 4px;
  }
`;

export const FileName = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;

  span {
    font-size: 14px;
    font-weight: 600;
    line-height: 20px;
  }
`;

export const Tag = styled.div`
  padding: 2px 6px;
  border-radius: 6px;
  border: 1px solid ${({ theme }) => theme.colors.athensGray};
  background-color: ${({ theme }) => theme.background.wildSand};
  color: ${({ theme }) => theme.colors.stormGray};
  font-size: 12px;
  line-height: 16px;
  font-weight: 400;
`;
