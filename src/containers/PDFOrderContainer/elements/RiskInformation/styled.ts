import styled from 'vue-styled-components';

export const Container = styled.div`
  position: relative;
  margin-top: 27px;
`;

export const Wrapper = styled.div`
  padding: 20px;

  @media print {
    break-inside: avoid;
  }
`;

export const Inner = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.stormGray};
`;

export const Title = styled.div`
  padding: 8px 10px;
  font-size: 14px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.highland};
  border-bottom: 1px solid ${({ theme }) => theme.colors.stormGray};
`;

export const InformationList = styled.div`
  display: flex;
  border-bottom: 1px solid ${({ theme }) => theme.colors.stormGray};
`;

export const GeneralInformation = styled.div`
  width: 40%;
  border-right: 1px solid ${({ theme }) => theme.colors.stormGray};
`;

export const OtherInformation = styled.div`
  flex: 1;
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

  @media print {
    break-inside: avoid;
  }
`;

export const Empty = styled.div`
  display: flex;
  flex-direction: column;
  padding: 8px 0;
  gap: 4px;
  align-items: center;
  font-size: 14px;
  font-weight: 400;

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
