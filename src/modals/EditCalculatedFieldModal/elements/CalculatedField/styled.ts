import styled from 'vue-styled-components';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 40px;
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding-bottom: 16px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.athensGray};
`;

export const Title = styled.div`
  font-size: 14px;
  font-weight: 600;
  flex-shrink: 0;
  color: ${({ theme }) => theme.colors.manatee};
`;

export const Tag = styled.div`
  padding: 6px 8px;
  font-size: 14px;
  font-weight: 400;
  border-radius: 6px;
  word-break: break-word;
  color: ${({ theme }) => theme.colors.stormGray};
  background-color: ${({ theme }) => theme.background.wildSand};
  border: 1px solid ${({ theme }) => theme.colors.athensGray};
`;

export const Row = styled.div`
  display: flex;
  flex-direction: column;
`;
