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
