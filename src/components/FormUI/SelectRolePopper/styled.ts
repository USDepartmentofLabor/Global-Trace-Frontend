import styled, { css } from 'vue-styled-components';

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 594px;
  padding: 16px;
  border-radius: 8px;
  background: ${({ theme }) => theme.background.white};
  box-shadow: 0px 16px 24px 0px rgba(96, 97, 112, 0.16),
    0px 2px 8px 0px rgba(40, 41, 61, 0.04);

  & .ps {
    max-height: 160px;
  }

  @media screen and (max-width: 768px) {
    width: 100%;
  }
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  position: relative;
`;

export const Back = styled.div`
  position: absolute;
  top: 6px;
  left: 0;
  padding: 4px;
  cursor: pointer;
`;

export const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;

  > div {
    flex: 1;
  }
`;

export const BackIcon = styled.div`
  display: flex;
`;

export const Title = styled.div`
  flex: 1;
  text-align: center;
  font-size: 24px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.highland};
`;

export const Form = styled.div`
  margin-bottom: 16px;
`;

const itemDisabledCss = css`
  pointer-events: none;
  cursor: not-allowed;
  color: ${({ theme }) => theme.colors.ghost};
`;

const itemSelectedCss = css`
  border-radius: 8px;
  background: ${({ theme }) => theme.background.surfCrest};

  .usdol-icon {
    color: ${({ theme }) => theme.colors.highland};
  }
`;

const itemWrapperProps = {
  isSelected: Boolean,
  isDisable: Boolean,
};

export const ItemWrapper = styled('div', itemWrapperProps)`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 14px;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.stormGray};

  ${({ isSelected }) => isSelected && itemSelectedCss}
  ${({ isDisable }) => isDisable && itemDisabledCss}

  &:hover {
    border-radius: 8px;
    background: ${({ theme }) => theme.background.surfCrest};

    .usdol-icon {
      color: ${({ theme }) => theme.colors.highland};
    }
  }
`;

export const Item = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
  font-size: 14px;
  font-weight: 400;
  line-height: 24px;
`;

export const ItemIcon = styled.div`
  display: flex;
`;

export const EditCalculator = styled.div`
  display: flex;
  cursor: pointer;
  gap: 8px;
  font-size: 16px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.killarney};
`;

export const MultipleSelect = styled.div`
  position: relative;
`;

export const OptionLabel = styled.span`
  color: ${({ theme }) => theme.colors.stormGray};
`;

export const Row = styled.div`
  display: flex;
  flex-direction: column;
`;
