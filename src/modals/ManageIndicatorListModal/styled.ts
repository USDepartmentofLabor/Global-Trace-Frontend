import styled, { css } from 'vue-styled-components';
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
    height: calc(100vh - 200px);
  }
`;

const actionsProps = {
  isBordered: Boolean,
  isFullWidthStyles: Boolean,
  isCenter: Boolean,
};

const actionBorderStyles = css`
  border-bottom: 1px solid ${({ theme }) => theme.colors.athensGray};
`;

const fullWidthStyles = css`
  > div {
    flex: 1;
  }
`;

const centerCss = css`
  justify-content: center;
`;

export const Actions = styled('div', actionsProps)`
  display: flex;
  gap: 12px;
  padding-bottom: 16px;
  ${({ isBordered }) => isBordered && actionBorderStyles}
  ${({ isFullWidthStyles }) => isFullWidthStyles && fullWidthStyles}
  ${({ isCenter }) => isCenter && centerCss}

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
  gap: 24px;
`;

export const TextGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const EmptyImage = styled.img.attrs({
  src: resources.EMPTY_UPLOAD_TRANSLATE,
})`
  width: 265px;
  height: 215px;
`;

export const EmptyTitle = styled.div`
  font-weight: 700;
  font-size: 16px;
  text-align: center;
  line-height: 24px;
  color: ${({ theme }) => theme.colors.highland};
`;

export const EmptyText = styled.div`
  font-weight: 400;
  font-size: 14px;
  text-align: center;
  white-space: pre;
  line-height: 20px;
  color: ${({ theme }) => theme.colors.abbey};
`;

export const EmptyAction = styled.div`
  display: flex;
  gap: 8px;
`;

export const FileContainer = styled.div`
  display: flex;
  flex-direction: column;

  .ps {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
`;

export const FileList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 24px;
`;

export const FileItem = styled.div`
  display: flex;
  padding: 8px 16px;
  background-color: ${({ theme }) => theme.background.athensGray2};
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.whiteLilac};
  align-items: center;
  gap: 16px;
`;

export const FileType = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.highland};
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

  span:first-child {
    font-size: 14px;
    font-weight: 600;
    line-height: 20px;
    color: ${({ theme }) => theme.colors.shark};
  }

  span:last-child {
    font-size: 12px;
    font-weight: 400;
    line-height: 18px;
    color: ${({ theme }) => theme.colors.stormGray};
  }
`;

export const FileLink = styled.div`
  display: flex;
  gap: 8px;
  cursor: pointer;
  align-items: center;
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.manatee};
`;

export const HiddenInput = styled.div`
  display: none;
`;

export const Footer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 24px;
  border-top: 1px solid ${({ theme }) => theme.colors.snuff};
`;
