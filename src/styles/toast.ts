import { css } from 'vue-styled-components';

const toast = css`
  .custom-toast {
    font-family: 'Sora';
    position: fixed;
    top: 50px;
    right: 50px;
    z-index: 10000;
    display: flex;
    flex-direction: column;

    &__body {
      margin-bottom: 20px;
      border-radius: 8px;
      background-color: white;
    }
  }
`;

export default toast;
