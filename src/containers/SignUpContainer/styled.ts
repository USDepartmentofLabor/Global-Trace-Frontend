import styled from 'vue-styled-components';

export const Wrapper = styled.div`
  display: flex;
  width: 312px;
  flex-direction: column;
`;

export const Row = styled.div`
  margin-top: 20px;
  text-align: left;
`;

export const Title = styled.div`
  font-weight: 800;
  font-size: 32px;
  line-height: 40px;
  text-align: center;
  color: ${({ theme }) => theme.colors.highland};
  margin-bottom: 12px;
`;

export const Description = styled.div`
  font-weight: 600;
  font-size: 12px;
  line-height: 18px;
  color: ${({ theme }) => theme.colors.stormGray};
  text-align: center;
  white-space: pre;
  margin-bottom: 10px;
`;

export const Button = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 64px;
`;
