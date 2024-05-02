import styled from 'vue-styled-components';

export const Wrapper = styled.div`
  margin: 0 auto;
`;

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 48px;
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const Title = styled.div`
  font-weight: 800;
  font-size: 20px;
  line-height: 25px;
  color: ${({ theme }) => theme.colors.envy};
`;

export const Group = styled.div`
  display: flex;
  gap: 60px;

  @media screen and (max-width: 768px) {
    flex-direction: column;
    gap: 24px;
  }
`;

export const Info = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

export const Label = styled.div`
  font-weight: 600;
  font-size: 14px;
  line-height: 18px;
  color: ${({ theme }) => theme.colors.ghost};
`;

export const Text = styled.div`
  font-weight: 400;
  font-size: 16px;
  line-height: 20px;
  word-break: break-word;
  color: ${({ theme }) => theme.colors.abbey};
`;
