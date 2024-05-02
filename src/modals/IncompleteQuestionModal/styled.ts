import styled from 'vue-styled-components';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30px;
  gap: 20px;
`;

export const Title = styled.label`
  width: 100%;
  font-weight: 600;
  font-size: 14px;
  line-height: 18px;
  color: ${({ theme }) => theme.colors.stormGray};
`;

export const Part = styled.div`
  width: 100%;
`;

export const Label = styled.div`
  margin-bottom: 4px;
  font-weight: 600;
  font-size: 12px;
  line-height: 15px;
  color: ${({ theme }) => theme.colors.highland};
`;

export const Text = styled.div`
  font-weight: 400;
  font-size: 12px;
  line-height: 15px;
  color: ${({ theme }) => theme.colors.stormGray};
`;
