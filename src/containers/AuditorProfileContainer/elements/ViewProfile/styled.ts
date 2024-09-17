import styled from 'vue-styled-components';

export const Wrapper = styled.div`
  width: 100%;
`;

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 16px;
  box-sizing: border-box;
  background-color: ${({ theme }) => theme.background.white};
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 64px;
`;

export const Title = styled.div`
  font-weight: 800;
  font-size: 20px;
  line-height: 25px;
  color: ${({ theme }) => theme.colors.stormGray};

  @media (max-width: 767px) {
    font-weight: 700;
    font-size: 14px;
    text-align: center;
  }
`;

export const Information = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px 24px;

  @media (max-width: 992px) {
    grid-template-columns: auto;
  }
`;

export const Info = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const Label = styled.div`
  font-weight: 600;
  font-size: 14px;
  line-height: 18px;
  color: ${({ theme }) => theme.colors.manatee};
`;

export const Text = styled.div`
  font-weight: 400;
  font-size: 16px;
  line-height: 20px;
  word-break: break-word;
  color: ${({ theme }) => theme.colors.shark};
`;

export const HeaderAction = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  align-items: center;

  @media (max-width: 920px) {
    width: 100%;
    justify-content: flex-end;
  }
`;

export const Loading = styled.div`
  min-height: 180px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const HeaderTitle = styled.div`
  font-size: 20px;
  font-weight: 800;
  flex: 1;
  color: ${({ theme }) => theme.colors.highland};
`;
