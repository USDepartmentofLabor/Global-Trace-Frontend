import styled, { css } from 'vue-styled-components';

const formParams = {
  isEdit: Boolean,
};
export const Form = styled('div', formParams)`
  display: flex;
  flex-direction: column;
  gap: ${({ isEdit }) => (isEdit ? '64px' : '32px')};

  @media (max-width: 992px) {
    width: 100%;
    padding: 0 16px;
    box-sizing: border-box;
  }
`;

export const Group = styled.div`
  display: flex;
  gap: 16px;
  flex-direction: column;
  width: 100%;

  @media screen and (max-width: 992px) {
    align-items: center;
    width: auto;
  }
`;

export const SubTitle = styled.div`
  font-weight: 800;
  font-size: 20px;
  line-height: 25px;
  color: ${({ theme }) => theme.colors.stormGray};

  @media (max-width: 767px) {
    font-weight: 700;
    font-size: 14px;
    text-align: center;
  }
`;

export const Column = styled.div`
  flex: 1;
  position: relative;

  &.last {
    .formulate-input-errors {
      position: absolute;
      right: 0;
    }
  }
`;

export const ColumnGroup = styled.div`
  display: flex;
  gap: 8px;
  flex-direction: column;
`;

export const Action = styled.div`
  display: flex;
  justify-content: center;
  gap: 16px;
`;

export const Text = styled.span`
  font-size: 12px;

  color: ${({ theme }) => theme.colors.spunPearl};
`;

export const Link = styled.span`
  font-size: 12px;
  cursor: pointer;
  text-decoration: underline;
  padding-left: 2px;

  color: ${({ theme }) => theme.colors.envy};
`;

const businessInformationProps = {
  column: Number,
};

export const BusinessInformation = styled('div', businessInformationProps)`
  display: grid;
  grid-template-columns: repeat(${({ column }) => column}, minmax(0, 1fr));
  gap: 16px 24px;

  @media (max-width: 992px) {
    grid-template-columns: 1fr;
    width: 100%;
  }
`;

export const Content = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;

  > div {
    :last-child {
      width: 100%;
    }
  }

  @media (max-width: 992px) {
    width: 100%;
    flex-wrap: inherit;
    flex-direction: column;

    > div {
      width: 100%;
    }
  }
`;

export const ErrorMessage = styled.span`
  color: ${({ theme }) => theme.colors.red};
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

export const InputLabel = styled.div`
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
