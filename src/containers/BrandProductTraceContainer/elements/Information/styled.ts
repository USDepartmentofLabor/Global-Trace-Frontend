import styled from 'vue-styled-components';

export const Content = styled.div`
  display: flex;
  justify-content: center;
  padding-bottom: 16px;
  margin: 0 -32px;

  @media (max-width: 992px) {
    flex-direction: column;
    gap: 16px;
  }
`;

export const Group = styled.div`
  flex: 1;
  display: grid;
  gap: 16px;
  grid-template-columns: 1fr 1fr;
  border-right: 1px solid ${({ theme }) => theme.colors.surfCrest};
  padding: 0 32px;

  &:last-child {
    border-right: none;
  }
`;

export const Label = styled.div`
  font-size: 12px;
  font-weight: 400;
  color: ${({ theme }) => theme.colors.stormGray};
`;

export const Value = styled.div`
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.abbey};

  @media (max-width: 992px) {
    text-align: right;
  }
`;
