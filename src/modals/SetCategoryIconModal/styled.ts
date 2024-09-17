import styled from 'vue-styled-components';

export const Container = styled.div`
  display: flex;
  min-height: 100%;
  flex-direction: column;
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
  height: 100%;
  padding: 24px 40px;

  .ps {
    height: calc(100vh - 116px);
    padding: 0 14px;
  }
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 24px;
`;

export const CategoryList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const Category = styled.div`
  display: flex;
  height: 60px;
  justify-content: space-between;
  align-items: center;
  border-radius: 8px;
  padding: 0 16px;
  background-color: ${({ theme }) => theme.background.wildSand}
  border: 1px solid ${({ theme }) => theme.colors.highland};
`;

export const CategoryName = styled.div`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.abbey};
  font-weight: 700;
  text-overflow: ellipsis;
  white-space: pre;
  overflow: hidden;
`;

export const CategoryType = styled.div`
  font-size: 20px;
  color: ${({ theme }) => theme.colors.abbey};
  font-weight: 800;
`;

export const Icon = styled.img`
  width: 44px;
  height: 44px;
  object-fit: contain;
  padding: 4px;
  box-sizing: border-box;
  cursor: pointer;
  flex-shrink: 0;
  border: 2px solid ${({ theme }) => theme.colors.highland};
`;

export const AssignIcon = styled.div`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.envy};
  font-weight: 700;
  cursor: pointer;
  flex-shrink: 0;
`;
