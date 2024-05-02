import styled from 'vue-styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 48px;

  @media (max-width: 767px) {
    gap: 16px;
  }
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const Title = styled.div`
  font-weight: 800;
  font-size: 20px;
  line-height: 25px;
  color: ${({ theme }) => theme.colors.envy};

  @media (max-width: 767px) {
    font-weight: 700;
    font-size: 14px;
    text-align: center;
  }
`;

export const Input = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

export const Password = styled.div`
  position: relative;

  .usdol-icon {
    position: absolute;
    top: 50%;
    right: 15px;
    transform: translateY(-50%);
    cursor: pointer;
  }
`;

export const Actions = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;

  @media (max-width: 767px) {
    grid-template-columns: auto;

    div:last-child {
      grid-row: 2/1;
    }
  }
`;

export const FormContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 16px;
  max-width: 968px;

  div {
    &:nth-child(4) {
      grid-column: 2/4;
    }

    :last-child {
      grid-column: 1;
      grid-row: 2;

      .multiselect__tags {
        padding-top: 16px;
      }
    }
  }

  @media (max-width: 767px) {
    display: flex;
    flex-direction: column;
  }
`;

export const FormContentFull = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
  max-width: 968px;

  @media (max-width: 767px) {
    display: flex;
    flex-direction: column;
  }
`;

export const FormContactProfile = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
  max-width: 968px;

  @media (max-width: 767px) {
    display: flex;
    flex-direction: column;
  }
`;

export const BusinessModelContent = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
  max-width: 968px;

  @media (max-width: 767px) {
    display: flex;
    flex-direction: column;
    max-width: unset;
  }
`;

export const FullName = styled.div`
  display: flex;
  gap: 8px;

  @media (max-width: 767px) {
    flex-direction: column;
  }
`;

export const DateInput = styled.div`
  display: block;
`;

export const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const SelfAssessment = styled.div`
  display: none;

  @media (max-width: 767px) {
    display: flex;
    justify-content: center;
    gap: 8px;
    text-align: center;
    font-weight: 600;
    font-size: 12px;
    color: ${({ theme }) => theme.colors.envy};
  }
`;
