import styled from 'vue-styled-components';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const ReportSource = styled.div`
  flex: 1;
  font-size: 20px;
  font-weight: 800;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.spunPearl};
`;

export const Content = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
  padding: 16px;
  background-color: ${({ theme }) => theme.background.white};
`;

export const Sources = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
`;
