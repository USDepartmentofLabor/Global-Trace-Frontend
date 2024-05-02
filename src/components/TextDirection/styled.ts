import styled from 'vue-styled-components';

const directionProps = {
  isRight: Boolean,
};

export const Wrapper = styled('span', directionProps)`
  direction: ${({ isRight }) => (isRight ? 'rtl' : 'inherit')};
`;
