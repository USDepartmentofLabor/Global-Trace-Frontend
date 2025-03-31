import styled from 'vue-styled-components';

export const Content = styled.div`
  padding: 32px;
`;

export const Actions = styled.div`
  display: flex;
  justify-content: center;
  gap: 16px;
`;

export const ButtonGroupEnd = styled.div`
  display: flex;
  gap: 16px;
  flex: 1;
  justify-content: flex-end;
`;

export const GeneratedContent = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
`;

export const SuccessTitle = styled.div`
  font-weight: 600;
  font-size: 12px;
  margin-top: 15px;

  color: ${({ theme }) => theme.colors.stormGray};
`;

export const QRCodeName = styled.div`
  font-style: normal;
  font-weight: 800;
  font-size: 20px;
  margin-top: 24px;

  color: ${({ theme }) => theme.colors.highland};
`;

export const QRCodeQuantity = styled.div`
  font-weight: 600;
  font-size: 12px;
  margin-top: 6px;
  margin-bottom: 24px;

  color: ${({ theme }) => theme.colors.stormGray};
`;
