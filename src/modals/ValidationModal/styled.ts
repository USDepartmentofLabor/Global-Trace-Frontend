import styled from 'vue-styled-components';

export const ErrorBlock = styled.div`
  margin-bottom: 18px;
  white-space: break-spaces;
`;

export const ErrorText = styled.div`
  margin-top: 5px;
`;

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 30px;
  gap: 20px;
  max-height: 484px;

  .usdol-icon {
    text-align: center;
  }
`;

export const ErrorLabel = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.red};
`;

export const Error = styled.div`
  font-weight: 400;
  font-size: 14px;
  line-height: 32px;
  color: ${({ theme }) => theme.colors.stormGray};
`;
