const tooltip = `
.tooltip {
  font-family: 'Sora';

  .tooltip-arrow {
    width: 0;
    height: 0;
  }

  &[x-placement^='bottom'] {
    margin-top: 5px;
  }

  &.overwrite-popper {
    z-index: 1000;
  }

  &.shadow-popper .wrapper {
    box-shadow: 0px 3px 6px 4px rgba(0,0,0,0.12);
  }
}
`;

export default tooltip;
