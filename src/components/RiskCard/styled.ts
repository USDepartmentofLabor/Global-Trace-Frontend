import styled from 'vue-styled-components';

const listProps = {
  isGrid: Boolean,
};

export const RisksList = styled('div', listProps)`
  min-width: 351px;
  display: grid;
  grid-template-columns: ${({ isGrid }) =>
    isGrid ? '1fr 1fr' : '1fr 1fr 1fr 1fr'};
  align-items: center;
  gap: 12px 8px;

  ${({ isGrid }) => (!isGrid ? 'text-align: center' : '')};

  @media (max-width: 992px) {
    min-width: 100%;
  }
`;

export const Risk = styled.div`
  font-weight: 700;
  font-size: 16px;
  color: ${({ theme }) => theme.colors.stormGray};
`;

export const Label = styled.div``;
