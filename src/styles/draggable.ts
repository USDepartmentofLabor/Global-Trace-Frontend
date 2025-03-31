import { css } from 'vue-styled-components';

const draggable = css`
  .ghost-item {
    background-color: ${({ theme }) => theme.background.surfCrest};
  }
`;

export default draggable;
