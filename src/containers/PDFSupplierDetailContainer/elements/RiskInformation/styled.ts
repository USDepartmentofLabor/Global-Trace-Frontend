import styled from 'vue-styled-components';

export const Wrapper = styled.div`
  position: relative;
  margin-top: 27px;
  border: 1px solid ${({ theme }) => theme.colors.stormGray};
`;

export const Title = styled.div`
  padding: 8px 10px;
  font-size: 14px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.highland};
  border-bottom: 1px solid ${({ theme }) => theme.colors.stormGray};
`;

export const InformationTitle = styled.div`
  padding: 8px 10px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
`;

export const Information = styled.div`
  display: flex;
  padding: 8px 10px;
  flex-direction: column;
  gap: 16px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.stormGray};
`;

export const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  font-weight: 400;
  color: ${({ theme }) => theme.colors.highland};
`;

export const InfoTitle = styled.div`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.stormGray};
`;

export const Ricks = styled.div`
  display: flex;
  align-items: center;
  border-bottom: 1px solid ${({ theme }) => theme.colors.stormGray};
`;

export const Empty = styled.div`
  display: flex;
  flex-direction: column;
  padding: 8px 0;
  gap: 4px;
  align-items: center;
  font-size: 14px;
  font-weight: 400;
`;

export const BreakInside = styled.div`
  @media print {
    break-inside: avoid;
  }
`;

export const RiskCard = styled.div`
  padding: 8px;

  @media print {
    break-inside: avoid;
  }
`;
