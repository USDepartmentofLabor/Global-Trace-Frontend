import styled from 'vue-styled-components';

export const IndicatorName = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.stormGray};
`;

const categoryIconProps = {
  size: String,
};

export const CategoryIcon = styled('img', categoryIconProps)`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
`;

export const SubIndicatorName = styled.div`
  font-size: 16px;
  font-weight: 400;
  color: ${({ theme }) => theme.colors.manatee};
`;

export const ExternalRiskIndicator = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 4px;
  border: 1px solid ${({ theme }) => theme.colors.ghost};
`;

export const ExternalRiskIndicatorInfo = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  padding: 16px;
  background-color: ${({ theme }) => theme.background.wildSand};
`;

export const ExternalRiskCategory = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 8px;
`;

export const ExternalRiskIndicatorBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px;
`;

export const Link = styled.div`
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  text-decoration: underline;
  color: ${({ theme }) => theme.colors.highland};
`;
