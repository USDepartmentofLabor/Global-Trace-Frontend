import styled from 'vue-styled-components';

export const Wrapper = styled.div`
  width: 100%;
  box-sizing: border-box;
`;

export const Content = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;

  @media screen and (max-width: 992px) {
    grid-template-columns: 1fr;
    width: 100%;
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

const columnProps = {
  isFullWidth: Boolean,
};

export const Column = styled('div', columnProps)`
  flex: 1;
  position: relative;
  ${({ isFullWidth }) => (isFullWidth ? 'grid-column: 1/3' : '')}

  &.last {
    .formulate-input-errors {
      position: absolute;
      right: 0;
    }
  }
`;

export const Row = styled.div`
  display: flex;
  gap: 8px;

  @media screen and (max-width: 992px) {
    flex-direction: column;
    width: 100%;
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

export const Actions = styled.div`
  display: flex;
  justify-content: center;
`;

export const Form = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;

  @media (max-width: 992px) {
    width: 100%;
    padding: 0 16px;
    box-sizing: border-box;
  }
`;
