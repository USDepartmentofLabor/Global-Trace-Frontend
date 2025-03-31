import styled from 'vue-styled-components';

const containerProps = {
  showAddBroker: Boolean,
  showAddProcessingFacility: Boolean,
  showAddTransporter: Boolean,
};

export const Container = styled('div', containerProps)`
  display: grid;
  grid-template-columns: ${({ showAddBroker }) =>
      showAddBroker ? '300px' : ''} ${({ showAddProcessingFacility }) =>
      showAddProcessingFacility ? '300px' : ''} ${({ showAddTransporter }) =>
      showAddTransporter ? '300px' : ''};
  gap: 24px;
`;

export const Action = styled.div`
  width: 240px;
  margin: 32px auto 0;
`;
