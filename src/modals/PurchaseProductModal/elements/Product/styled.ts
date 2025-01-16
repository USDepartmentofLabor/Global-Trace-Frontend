import styled from 'vue-styled-components';

export const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 120px 1fr 120px 40px;
  align-items: center;
  margin-bottom: 12px;
  font-size: 14px;

  .remove-product {
    cursor: pointer;

    @media (max-width: 576px) {
      position: absolute;
      right: 0;
      top: 0;
    }
  }

  @media (max-width: 576px) {
    padding: 0;
    padding-top: 24px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    gap: 8px;
  }
`;

export const Code = styled.div`
  color: ${({ theme }) => theme.colors.abbey};
`;

export const Time = styled.div`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.ghost};
`;

export const DownloadText = styled.div`
  color: ${({ theme }) => theme.colors.envy};
`;

export const DownloadAttachments = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.envy};
`;

export const EmptyAttachments = styled.div`
  width: 120px;
`;
