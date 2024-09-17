import styled, { css } from 'vue-styled-components';

export const Wrapper = styled.div`
  display: flex;
  margin-top: 20px;
  margin-bottom: 32px;

  @media (max-width: 576px) {
    flex-direction: column;
    gap: 15px;
    margin-bottom: 15px;
    margin-top: 15px;
    align-items: center;
  }
`;

const filterContentProps = {
  isActive: Boolean,
};

export const FilterContent = styled('div', filterContentProps)`
  display: flex;
  flex: 1;
  gap: 30px;

  color: ${(props) =>
    props.isActive ? props.theme.colors.envy : props.theme.colors.spunPearl};

  @media (max-width: 576px) {
    margin-left: 15px;
    justify-content: center;
  }
`;

export const ResetFilter = styled.div`
  padding: 0 14px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;

  color: ${({ theme }) => theme.colors.sandyBrown};
`;

export const FilterAction = styled.div`
  display: flex;
  gap: 4px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;

  @media (max-width: 576px) {
    justify-content: center;
  }
`;

const filterTextProps = {
  color: String,
};

export const FilterText = styled('div', filterTextProps)`
  color: ${(props) => props.theme.colors[props.color]};
`;

const labelGroupProps = {
  isActive: Boolean,
};

const activeLabelCSS = css`
  border-radius: 8px;

  background-color: ${({ theme }) => theme.background.envy};
  color: ${({ theme }) => theme.colors.white};
`;

export const Label = styled('div', labelGroupProps)`
  display: flex;
  flex: 1 1 auto;
  font-weight: 500;
  font-size: 14px;
  line-height: 16px;
  padding: 6px 8px;

  &:hover {
    ${activeLabelCSS}
  }

  ${(props) => props.isActive && activeLabelCSS}
`;
