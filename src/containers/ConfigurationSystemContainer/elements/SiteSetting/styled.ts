import styled from 'vue-styled-components';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  box-sizing: border-box;
  max-width: 646px;
  margin: 50px auto;
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const Action = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 16px;
`;

export const Column = styled.div`
  grid-column: 1/3;
`;

export const Row = styled.div`
  .trigger {
    width: 100%;
  }
`;

export const OptionBody = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 10px;
  padding: 8px 13px;
  margin-bottom: 4px;
  font-size: 14px;
  font-weight: 400;
  color: ${({ theme }) => theme.colors.stormGray};
`;

export const Tag = styled.div`
  display: -webkit-box;
  padding: 6px;
  border-radius: 6px;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  word-wrap: break-word;
  line-height: 24px;
  background: ${({ theme }) => theme.background.wildSand};
`;

export const GPS = styled.div`
  display: flex;
  gap: 16px;
  justify-content: space-between;
  align-items: center;
`;

export const GPSInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.stormGray};
`;

export const GPSService = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

export const GPSServiceDetails = styled.div`
  font-size: 12px;
  font-weight: 400;
  color: ${({ theme }) => theme.colors.manatee};
`;
