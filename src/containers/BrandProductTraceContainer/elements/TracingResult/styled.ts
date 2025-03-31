import styled, { css } from 'vue-styled-components';

const tableProps = {
  color: String,
  bold: Boolean,
  small: Boolean,
  variant: String,
};

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex: 1;

  @media (max-width: 992px) {
    border-top: 1px solid ${({ theme }) => theme.colors.surfCrest};
  }

  table {
    padding: 0 10px;

    th {
      span {
        font-size: 12px;
        font-weight: 600;
        color: ${({ theme }) => theme.colors.stormGray};
        :before,
        :after {
          font-size: 14px;
        }
      }
    }
    tr td {
      padding: 10px 16px;
    }
  }
`;

export const Header = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 6px 26px;
  background: ${({ theme }) => theme.background.surfCrest};
`;

export const Label = styled.div`
  font-weight: 600;
  font-size: 16px;
  line-height: 20px;
  color: ${({ theme }) => theme.colors.highland};
`;

export const EmptyData = styled.div`
  min-height: 180px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const Tr = styled.tr`
  cursor: pointer;
`;

const tdCss = {
  default: css`
    color: ${({ theme }) => theme.colors.stormGray};
  `,
  secondary: css`
    color: ${({ theme }) => theme.colors.abbey};
  `,
  active: css`
    color: ${({ theme }) => theme.colors.highland};
  `,
  disable: css`
    color: ${({ theme }) => theme.colors.ghost};
  `,
};

export const Td = styled('td', tableProps)`
  background: transparent;
  line-height: 17.64px;
  font-weight: ${({ bold }) => (bold ? '600' : '400')};
  font-size: ${({ small }) => (small ? '12px' : '14px')};
  ${({ variant }) => tdCss[variant]}
  .usdol-icon {
    margin-right: 8px;
  }
`;

export const Capitalize = styled.span`
  display: inline-block;
  &:first-letter {
    text-transform: capitalize;
  }
`;

export const Notice = styled.div`
  display: flex;
  padding: 10px 26px;
  background: ${({ theme }) => theme.background.white};
  border-top: 1px solid ${({ theme }) => theme.colors.surfCrest};
  gap: 6px;
`;

export const Text = styled.span`
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  color: ${({ theme }) => theme.colors.stormGray};

  strong {
    color: ${({ theme }) => theme.colors.shark};
  }
`;

export const NoticeContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const SupplierName = styled.span`
  font-weight: 600;
`;
