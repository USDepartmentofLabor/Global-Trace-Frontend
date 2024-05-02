import styled from 'vue-styled-components';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
`;

export const Attribute = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
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

export const Locations = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
`;
