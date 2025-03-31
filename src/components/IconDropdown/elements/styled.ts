import styled, { css } from 'vue-styled-components';
import resources from 'config/resources';

export const Header = styled.div`
  display: flex;
  padding: 16px 24px;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid ${({ theme }) => theme.colors.athensGray};
`;

export const HeaderLeft = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 4px;
`;

export const Title = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.highland};
`;

export const SubTitle = styled.div`
  font-size: 12px;
  font-weight: 400;
  color: ${({ theme }) => theme.colors.manatee};
`;

export const IconsWrapper = styled.div`
  padding: 16px 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;

  .ps {
    max-height: 224px;
  }
`;

export const IconValue = styled.div`
  font-size: 14px;
  font-weight: 400;
  color: ${({ theme }) => theme.colors.manatee};
`;

export const IconsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
  gap: 16px;
`;

const iconContentProps = {
  isActivated: Boolean,
};

const activatedCss = css`
  border-color: ${({ theme }) => theme.colors.highland};
`;

export const IconContent = styled('div', iconContentProps)`
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: center;
  justify-content: center;
  padding: 8px;
  border-radius: 8px;
  border-width: 1px;
  border-style: solid;
  border-color: transparent;
  cursor: pointer;

  &:hover {
    border-color: ${({ theme }) => theme.colors.ghost};
    background: ${({ theme }) => theme.background.wildSand};
  }

  ${({ isActivated }) => isActivated && activatedCss}
`;

export const IconName = styled.div`
  font-size: 12px;
  font-weight: 400;
  word-break: break-word;
  color: ${({ theme }) => theme.colors.manatee};
`;

export const EmptyContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: center;
  justify-content: center;
`;

export const EmptyImage = styled.img.attrs({
  src: resources.EMPTY_UPLOAD_TRANSLATE,
})`
  width: 146px;
  height: 120px;
`;

export const EmptyText = styled.div`
  font-size: 12px;
  font-weight: 400;
  color: ${({ theme }) => theme.colors.manatee};

  strong {
    font-weight: 600;
    color: ${({ theme }) => theme.colors.shark};
  }
`;
