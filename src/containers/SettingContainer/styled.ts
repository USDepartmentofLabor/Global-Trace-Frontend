import styled from 'vue-styled-components';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding: 32px 80px;
  box-sizing: border-box;
  background-color: ${({ theme }) => theme.background.wildSand};

  @media (max-width: 920px) {
    padding: 15px 25px;
  }
`;

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px 32px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.surfCrest};
`;

export const Box = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  box-sizing: border-box;
  background-color: ${({ theme }) => theme.background.white};
`;

export const Title = styled.div`
  font-size: 24px;
  font-weight: 800;
  line-height: 30px;
  color: ${({ theme }) => theme.colors.highland};
`;

export const Row = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
`;

export const Inputs = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px 24px;
  padding: 24px 32px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    padding: 16px;
  }
`;

export const Form = styled.div`
  display: flex;
  margin-top: 33px;
  gap: 20px;
  flex-direction: column;
`;

export const Button = styled.div`
  margin-top: 20px;
`;
