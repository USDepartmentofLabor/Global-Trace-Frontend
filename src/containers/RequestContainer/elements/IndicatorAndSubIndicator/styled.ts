import styled, { css } from 'vue-styled-components';

const severityProps = {
  variant: String,
};

const textProps = {
  isBold: Boolean,
};

const severityStyles = {
  high: css`
    background-color: ${({ theme }) => theme.colors.red};
  `,
  medium: css`
    background-color: ${({ theme }) => theme.colors.sandyBrown};
  `,
  low: css`
    background-color: ${({ theme }) => theme.colors.envy};
  `,
};

export const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const ListItem = styled('div', textProps)`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  line-height: 18px;
  font-weight: ${({ isBold }) => (isBold ? '600' : '400')};
  color: ${({ isBold, theme }) =>
    isBold ? theme.colors.abbey : theme.colors.stormGray};
`;

export const Severity = styled('div', severityProps)`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  ${(props) => severityStyles[props.variant]}
`;
