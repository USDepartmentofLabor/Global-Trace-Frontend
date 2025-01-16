import styled, { css } from 'vue-styled-components';

const toggleProps = {
  label: String,
  labelPosition: String,
  disabled: Boolean,
};

const labelPosition = {
  before: css`
    margin-left: 10px;
  `,
  after: css`
    margin-right: 10px;
  `,
};

export const Wrapper = styled('div', toggleProps)`
  .formulate-input-wrapper {
    display: flex;
    align-items: center;
    pointer-events: ${(props) => (props.disabled ? 'none' : 'auto')};

    .formulate-input-element {
      position: relative;
      height: 25px;
      width: 40px;
      ${(props) => props.label && labelPosition[props.labelPosition]}

      input {
        &[type='checkbox'] {
          display: none;

          ~ .formulate-input-element-decorator {
            cursor: pointer;
            position: absolute;
            left: 0;
            top: 0;
            z-index: 1;
            width: 40px;
            height: 22px;
            background-color: ${({ theme }) => theme.background.ghost};
            border: 1.5px solid ${({ theme }) => theme.colors.ghost};
            border-radius: 200px;
            transition: 0.1s linear, background-color 0.1s linear;

            &:hover {
              border-color: ${({ theme }) => theme.colors.blueRibbon};
            }

            &:before {
              content: '';
              position: absolute;
              top: 3px;
              left: 3px;
              z-index: 2;
              width: 16px;
              height: 16px;
              border-radius: 50%;
              background-color: ${({ theme }) => theme.background.white};
              transition: 0.1s linear, background-color 0.1s linear;
            }
          }

          &:checked ~ .formulate-input-element-decorator {
            background-color: ${({ theme, disabled }) =>
              disabled ? theme.background.ghost : theme.background.blueRibbon};

            &:hover {
              background-color: ${({ theme }) => theme.background.blueRibbon};
            }

            &:before {
              left: 22px;
            }
          }
        }
      }
    }

    .formulate-input-label {
      font-size: 14px;
      font-weight: 400;
      line-height: 20px;
      color: ${({ theme, disabled }) =>
        disabled ? theme.colors.bombay : theme.colors.shark};
    }
  }
`;
