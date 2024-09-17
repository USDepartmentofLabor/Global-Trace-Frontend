import styled, { css } from 'vue-styled-components';

const infoProp = {
  colored: Boolean,
};

const textProp = {
  type: String,
  isLabel: Boolean,
  bold: Boolean,
};

const rowProp = {
  contentBetween: Boolean,
  contentTop: Boolean,
};

export const Row = styled('div', rowProp)`
  display: flex;
  align-items: ${({ contentTop }) => (contentTop ? 'flex-start' : 'center')};
  justify-content: ${({ contentBetween }) => contentBetween && 'space-between'};
  margin-bottom: 10px;
  :last-child {
    margin-bottom: 0;
  }
`;

export const Product = styled.div`
  flex: 1;
  padding: 8px 10px;
`;

export const Sale = styled.div`
  margin-bottom: 30px;
`;

export const Title = styled.div`
  font-weight: 600;
  font-size: 12px;
  line-height: 15px;
  color: ${({ theme }) => theme.colors.shark};
  text-transform: uppercase;
`;

const spanProps = {
  bold: Boolean,
};

export const Span = styled('span', spanProps)`
  font-size: 12px;
  line-height: 15px;
  color: ${({ theme }) => theme.colors.stormGray};
  font-weight: ${({ bold }) => (bold ? '800' : '600')};
  text-transform: capitalize;
  margin-right: 4px;
`;

const textTypeCss = {
  ghost: css`
    color: ${({ theme }) => theme.colors.ghost};
  `,
  active: css`
    color: ${({ theme }) => theme.colors.highland};
  `,
  red: css`
    color: ${({ theme }) => theme.colors.red};
  `,
};

export const Text = styled('span', textProp)`
  font-weight: 400;
  font-size: 12px;
  line-height: 15px;
  ${({ type }) => textTypeCss[type]}
  width: ${({ isLabel }) => (isLabel ? '160px' : 'inherit')};
  font-weight: ${({ bold }) => (bold ? '800' : '400')};
`;

const coloredCss = css`
  color: ${({ theme }) => theme.colors.highland};
`;

export const Info = styled('li', infoProp)`
  font-size: 12px;
  line-height: 15px;
  margin-left: 10px;
  ${({ colored }) => colored && coloredCss}
`;

export const Description = styled.div`
  font-size: 12px;
  line-height: 15px;
  margin-left: 10px;
  color: ${({ theme }) => theme.colors.highland};
`;

export const PurchaseInfo = styled.div`
  margin-bottom: 15px;
  :last-child {
    margin-bottom: 0;
  }
  @media print {
    break-inside: avoid;
  }
`;

export const SellerInfo = styled.div`
  margin-bottom: 10px;
  :last-child {
    margin-bottom: 0;
  }
  @media print {
    break-inside: avoid;
  }
`;

const InfoItemProps = {
  isFull: Boolean,
};
export const InfoItem = styled('div', InfoItemProps)`
  display: inline-flex;
  width: ${({ isFull }) => (isFull ? 'calc(100% - 20px)' : 'inherit')};
`;
