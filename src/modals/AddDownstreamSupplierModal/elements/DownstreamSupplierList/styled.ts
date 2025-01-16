import styled from 'vue-styled-components';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;

  .ps {
    width: 100%;
    max-height: calc(100svh - 200px);
  }
`;

export const SupplierHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;

  .usdol-icon {
    padding: 4px;
    cursor: pointer;
  }
`;

export const Title = styled.div`
  flex: 1;
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.stormGray};
`;

const containerProps = {
  isFirst: Boolean,
};

export const Container = styled('div', containerProps)`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: ${({ isFirst }) => (isFirst ? '0 0 16px' : '16px 0')};
  border-bottom: 1px solid ${({ theme }) => theme.colors.ghost};
`;
