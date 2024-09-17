import styled from 'vue-styled-components';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 8px;
  margin: 132px auto;
  max-width: 930px;
  text-align: center;
`;

export const Title = styled.div`
  font-size: 20px;
  font-weight: 600;
  line-height: 30px;
  color: ${({ theme }) => theme.colors.rhino};
`;

export const Description = styled.div`
  font-size: 14px;
  font-weight: 500;
  line-height: 21px;
  color: ${({ theme }) => theme.colors.spunPearl};
`;

export const Action = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 32px;
`;
