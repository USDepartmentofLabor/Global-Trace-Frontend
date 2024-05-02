import styled, { css } from 'vue-styled-components';

export const Row = styled.div`
  display: flex;
  gap: 8px;
`;

export const Column = styled.div`
  flex: 1;
`;

export const Label = styled.div`
  font-size: 14px;
  line-height: 20px;
  padding: 0 4px;
  font-weight: 400;
  color: ${({ theme }) => theme.colors.highland};
`;

export const Box = styled.div`
  margin: 24px auto;
`;

export const PartnerInfo = styled.div`
  & > .ps {
    max-height: calc(100svh - 270px);
  }
`;

export const PartnerInfoContainer = styled.div`
  width: 312px;
  margin: auto;

  @media (max-width: 576px) {
    width: 100%;
  }
`;

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const Title = styled.div`
  font-size: 14px;
  text-align: center;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.highland};
`;

export const BusinessContainer = styled.div`
  width: 700px;
  margin: auto;

  @media (max-width: 576px) {
    width: 100%;
  }
`;

const informationLayoutProps = {
  layout: String,
  isTransporter: Boolean,
};

const informationTransporter = css`
  grid-template-areas:
    'a a'
    'b b';
  & > div:first-child {
    grid-area: a;
  }
`;

const layoutCss = {
  facilityCustom: css`
    & > div {
      &:nth-child(2) {
        order: 4;
      }
      &:nth-child(3) {
        order: 3;
      }
      &:nth-child(4) {
        order: 2;
      }
      &:nth-child(n + 5) {
        order: 5;
      }
    }
  `,
  facilityDefault: css`
    & > div:first-child {
      order: unset;
    }
  `,
  partnerDefault: css`
    & > div:last-child {
      grid-column: 1/3;
      width: 312px;
      margin: auto;

      @media (max-width: 576px) {
        width: 100%;
      }
    }
  `,
};

export const InformationLayout = styled('div', informationLayoutProps)`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 8px;

  @media (max-width: 576px) {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  ${(props) => layoutCss[props.layout]}
  ${(props) => props.isTransporter && informationTransporter}
`;

export const Action = styled.div`
  display: flex;
  margin: auto;
`;

const listItemProps = {
  disabled: Boolean,
};

export const ListItem = styled('div', listItemProps)`
  display: flex;
  border-radius: 8px;
  padding: 15px;

  background-color: ${({ theme, disabled }) =>
    disabled ? theme.background.wildSand : theme.background.white};
  box-shadow: 0px 0px 4px ${({ theme }) => theme.colors.blackTransparent6};

  .usdol-icon {
    cursor: pointer;
  }
`;

export const Name = styled.div`
  flex: 1;
  font-weight: 600;
  font-size: 14px;

  color: ${({ theme }) => theme.background.envy};
`;

export const ContactLayout = styled.div`
  display: grid;
  grid-gap: 8px;
  grid-template-columns: 1fr 1fr;

  @media (max-width: 576px) {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
`;
