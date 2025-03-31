import styled from 'vue-styled-components';
import { RESOURCES } from 'config/constants';

export const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 40px 80px 80px;
  background-color: ${({ theme }) => theme.background.wildSand};

  table {
    thead {
      background-color: ${({ theme }) => theme.background.wildSand};
    }
  }

  @media (max-width: 768px) {
    padding: 24px;
  }
`;

export const Table = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 24px;
  padding: 24px 24px 48px;
  border-radius: 4px;
  box-shadow: 0px 1px 2px 0px ${({ theme }) => theme.colors.blackTransparent6};
  box-shadow: 0px 1px 3px 0px ${({ theme }) => theme.colors.blackTransparent6};
  background-color: ${({ theme }) => theme.background.white};
`;

export const Title = styled.span`
  font-weight: 800;
  font-size: 20px;
  line-height: 28px;
  color: ${({ theme }) => theme.colors.highland};
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const EmptyData = styled.div`
  min-height: 180px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const GrievanceEmptyImage = styled.img.attrs({
  src: RESOURCES.GRIEVANCE_EMPTY,
})`
  width: 254px;
  height: 271px;
`;

export const EmptyContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 25px;
  margin-top: 32px;
`;

export const EmptyText = styled.div`
  font-weight: 600;
  font-size: 14px;
  text-align: center;
  white-space: pre;

  color: ${({ theme }) => theme.colors.abbey};
`;
