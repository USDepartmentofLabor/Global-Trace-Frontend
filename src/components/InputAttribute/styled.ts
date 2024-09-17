import styled from 'vue-styled-components';

const wrapperProps = {
  column: Number,
};

export const Wrapper = styled('div', wrapperProps)`
  display: grid;
  grid-template-columns: repeat(${({ column }) => column}, minmax(0, 1fr));
  gap: 24px;

  @media (max-width: 992px) {
    width: 100%;
    grid-template-columns: auto;
  }
`;

export const Attribute = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

export const Error = styled.div`
  width: 100%;
`;

export const UploadWrapper = styled.div`
  width: 100%;
`;

export const NumberUnitPair = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 18px;
  width: 100%;

  @media (max-width: 576px) {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
`;
