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
}
`;

export default tooltip;
