import styled, { css } from 'vue-styled-components';

export const SearchInput = styled.div`
  margin-top: 24px;

  @media (max-width: 576px) {
    width: 100%;
  }
`;

export const PartnerInfoContainer = styled.div`
  padding: 0 80px;

  @media (max-width: 576px) {
    padding: 0;
    width: 100%;
    display: flex;
    flex-direction: column;
  }

  .menu-label {
    color: ${({ theme }) => theme.colors.envy};
  }
`;

export const Line = styled.div`
  width: 100%;
  margin: 24px auto 0;
  height: 1px;
  background-color: ${({ theme }) => theme.background.ghost};
`;

const activeLabelCSS = css`
  border-radius: 8px;

  background-color: ${({ theme }) => theme.background.envy};

  .label,
  .sub-label {
    color: ${({ theme }) => theme.colors.white};
  }
`;

const resultProps = {
  isActive: Boolean,
};

export const Result = styled('div', resultProps)`
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: 4px;
  overflow: hidden;
  padding: 6px 8px;

  &:hover {
    ${activeLabelCSS}
  }

  ${(props) => props.isActive && activeLabelCSS}
`;

export const Label = styled.div`
  display: flex;
  flex: 1 1 auto;
  font-weight: 500;
  font-size: 14px;
  line-height: 16px;
  color: ${({ theme }) => theme.colors.envy};
`;

export const SubLabel = styled.div`
  font-size: 12px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  color: ${({ theme }) => theme.colors.spunPearl};
`;
