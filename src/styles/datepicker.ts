import themeStyled from 'styles/theme';

const datepicker = `
  .mx-datepicker {
    .mx-input-wrapper {
      .mx-input {
        color: ${themeStyled.colors.stormGray};
        border: 1px solid ${themeStyled.colors.surfCrest};
        box-shadow: inherit;

        &:hover, &:focus {
          border: 1px solid ${themeStyled.colors.highland};
        }

        &::placeholder {
          color: ${themeStyled.colors.spunPearl};
        }
      }
    }
  }

  .mx-datepicker-main {
    display: flex;
    flex-direction: column-reverse;
  }

  .mx-datepicker-sidebar + .mx-datepicker-content {
    margin-left: 0;
  }

  .mx-datepicker-sidebar {
    float: none;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    border-top: 1px solid ${themeStyled.background.ghost};
  }
`;
export default datepicker;
