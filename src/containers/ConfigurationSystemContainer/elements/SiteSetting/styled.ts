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
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;

  & > div:last-child {
    grid-column: 1/3;
  }
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
