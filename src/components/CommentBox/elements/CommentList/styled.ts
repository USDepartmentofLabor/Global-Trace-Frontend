import styled, { css } from 'vue-styled-components';

export const CommentCard = styled.div`
  display: flex;
  gap: 16px;
  border-radius: 8px;
  padding: 8px 16px;
  border: 1px solid ${({ theme }) => theme.colors.surfCrest};
`;

const avatarCss = css`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  width: 44px;
  height: 44px;
  box-sizing: border-box;
  font-size: 20px;
  font-weight: 800;
  border-radius: 4px;
  color: ${({ theme }) => theme.colors.highland};
  border: 1px solid ${({ theme }) => theme.colors.highland};
  background-color: ${({ theme }) => theme.background.surfCrest};
`;

export const CommentAvatar = styled.div`
  ${avatarCss}
`;

export const CommentInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
`;

export const CommentUserName = styled.div`
  font-weight: 700;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.abbey};
`;

export const CommentAt = styled.div`
  font-weight: 600;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.abbey};
`;

export const Comment = styled.div`
  font-weight: 400;
  font-size: 14px;
  word-break: break-word;
  white-space: pre-line;
`;

export const CommentFiles = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const CommentList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const CommentFile = styled.div`
  &:first-child {
    padding-top: 16px;
    border-top: 1px solid ${({ theme }) => theme.colors.surfCrest};
  }
`;

export const File = styled.div`
  display: flex;
  cursor: pointer;
  gap: 4px;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  padding: 8px 12px;
  border-radius: 4px;
  color: ${({ theme }) => theme.colors.highland};
  border: 1px solid ${({ theme }) => theme.colors.highland};
`;

export const CommentAction = styled.div`
  padding: 8px;
  cursor: pointer;
`;

const labelProps = {
  variant: String,
};

const labelCss = {
  default: css`
    color: ${({ theme }) => theme.colors.stormGray};
  `,
  danger: css`
    color: ${({ theme }) => theme.colors.red};
  `,
};

export const Label = styled('div', labelProps)`
  width: 100%;
  font-size: 14px;
  font-weight: 400;
  padding: 8px 12px;
  text-align: center;

  &:hover {
    background-color: ${({ theme }) => theme.background.wildSand};
  }

  ${({ variant }) => labelCss[variant]}
`;

export const Row = styled.div`
  display: flex;
  flex-direction: column;
`;
