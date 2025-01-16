import styled, { css } from 'vue-styled-components';

export const Content = styled.div`
  padding: 24px 0;

  background-color: ${({ theme }) => theme.background.wildSand};
`;

export const List = styled.div`
  width: 576px;
  margin: auto;
  display: flex;
  flex-direction: column;
  gap: 8px;

  @media (max-width: 992px) {
    width: 100%;
    padding: 0 16px;
    box-sizing: border-box;
  }
`;

const radioProps = {
  isDefault: Boolean,
};

const radioDefaultCss = css`
  min-height: 69px;
`;

export const Radio = styled('div', radioProps)`
  display: flex;

  box-sizing: border-box;
  justify-content: center;
  align-items: center;
  padding: 16px;
  gap: 16px;
  border-radius: 8px;
  cursor: pointer;

  background-color: ${({ theme }) => theme.background.white};
  box-shadow: 0px 4px 4px ${({ theme }) => theme.colors.blackTransparent5};

  ${({ isDefault }) => (isDefault ? radioDefaultCss : '')}
`;

export const RadioLabel = styled.div`
  flex: 1;
  display: grid;
  grid-template-columns: auto 1fr auto 1fr;
  grid-gap: 10px;
  gap: 10px;

  @media (max-width: 992px) {
    grid-template-columns: auto 1fr;
  }
`;

export const Description = styled.div`
  font-size: 14px;
  line-height: 18px;
  text-align: center;
  white-space: pre-line;
  margin-bottom: 16px;

  color: ${({ theme }) => theme.colors.stormGray};

  span {
    color: ${({ theme }) => theme.colors.highland};
  }
`;

export const LabelGroup = styled.div`
  display: flex;
  gap: 8px;
`;

const valueProps = {
  highlight: Boolean,
};

const highlightCss = css`
  color: ${({ theme }) => theme.colors.envy};
`;

export const Value = styled('div', valueProps)`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.stormGray};
  ${({ highlight }) => highlight && highlightCss}
`;

export const Label = styled.div`
  font-size: 12px;

  color: ${({ theme }) => theme.colors.spunPearl};
`;

export const Text = styled.span`
  padding-left: 4px;
  color: ${({ theme }) => theme.colors.envy};
`;
