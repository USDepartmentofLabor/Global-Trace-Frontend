import styled, { injectGlobal } from 'vue-styled-components';

export const Wrapper = styled.div`
  width: 794px;
  margin: 0 auto;
`;

injectGlobal`
  body {
    overflow: inherit;
  }`;

export const Container = styled.div`
  padding: 20px;
  position: relative;

  @media print {
    break-inside: avoid;
  }
`;

export const RiskCategory = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 30px;
`;

export const RiskCategoryContainer = styled.div`
  display: flex;
  gap: 24px;
  align-items: center;
  padding: 8px 12px;
  border: 1px solid ${({ theme }) => theme.colors.ghost};
`;

export const RiskCategoryLabel = styled.div`
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: ${({ theme }) => theme.colors.stormGray};
`;

export const RiskCategoryGroup = styled.div`
  display: flex;
  gap: 18px;
  align-items: center;
`;
