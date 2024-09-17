import themeStyled from 'styles/theme';

const modal = `
  .vm--overlay {
    background: ${themeStyled.colors.blackTransparent4};
  }

  .fromRight.vm-transition--modal-enter,
  .fromRight.vm-transition--modal-leave-active {
    transform: translateX(50px);
  }
  .vm--modal.modal-center {
    width: fit-content!important;
    left: auto!important;
    margin: auto!important;
  }
`;

export default modal;
