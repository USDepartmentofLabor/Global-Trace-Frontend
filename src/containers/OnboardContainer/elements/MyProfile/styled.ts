import styled from 'vue-styled-components';

export const Form = styled.div`
  min-height: 475px;

  @media (max-width: 992px) {
    width: 100%;
    padding: 0 16px;
    box-sizing: border-box;
  }
`;

export const Title = styled.div`
  font-weight: 800;
  font-size: 32px;
  line-height: 40px;

  color: ${({ theme }) => theme.colors.highland};
`;

export const Group = styled.div`
  display: flex;
  gap: 8px;
  flex-direction: column;
  margin-top: 32px;
  width: 632px;

  @media screen and (max-width: 992px) {
    align-items: center;
    width: auto;
  }
`;

export const SubTitle = styled.div`
  font-weight: 600;
  font-size: 16px;
  line-height: 20px;
  margin-bottom: 8px;

  color: ${({ theme }) => theme.colors.highland};
`;

export const Row = styled.div`
  display: flex;
  gap: 8px;

  @media (max-width: 992px) {
    flex-direction: column;
    width: 100%;
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

export const BusinessContent = styled.div`
  display: flex;
  flex-direction: column;
`;

export const BusinessDetail = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: end;
  gap: 8px;
`;

export const Action = styled.div`
  display: flex;
  justify-content: center;
  margin: 64px 0;
`;

export const Label = styled.div`
  font-size: 14px;
  line-height: 20px;
  padding: 0 4px;
  font-weight: 400;

  color: ${({ theme }) => theme.colors.highland};
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

export const BusinessAddress = styled.div`
  display: flex;
  gap: 8px;
  flex-direction: column;
`;

export const BusinessInformation = styled.div`
  display: grid;
  grid-template-columns: 312px 312px;
  gap: 8px;

  @media (max-width: 992px) {
    grid-template-columns: 1fr;
    width: 100%;
  }
`;

export const BusinessCircleWrapper = styled.div`
  margin-top: 24px;
`;

export const BusinessCircleContent = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 8px;
`;

export const Content = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
  > div {
    width: 312px;

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

export const BusinessGroup = styled.div`
  display: flex;
  gap: 7px;

  @media (max-width: 992px) {
    flex-direction: column;
  }
`;
