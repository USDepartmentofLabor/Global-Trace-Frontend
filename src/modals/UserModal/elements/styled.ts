import styled from 'vue-styled-components';

const rowProps = {
  isSupplier: Boolean,
};

export const Row = styled('div', rowProps)`
  display: flex;
  flex-direction: column;
`;
