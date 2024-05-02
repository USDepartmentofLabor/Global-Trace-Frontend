import styled, { css } from 'vue-styled-components';

const checkboxProps = {
  label: String,
  labelPosition: String,
  icon: String,
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

export const Wrapper = styled('div', checkboxProps)`
  .formulate-input-wrapper {
    display: flex;
    align-items: center;
    pointer-events: ${(props) => (props.disabled ? 'none' : 'auto')};

    .formulate-input-element {
      position: relative;
      height: 20px;
      width: 20px;
      min-width: 20px;

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
            width: 20px;
            height: 20px;
            background-color: ${({ theme, disabled }) =>
              disabled ? theme.background.snuff : theme.background.white};
            border: 1px solid ${({ theme }) => theme.colors.ghost};
            border-radius: 2px;
            line-height: 18px;

            &:hover {
              border-color: ${({ theme }) => theme.colors.highland};
            }

            &:before {
              position: absolute;
              font-family: 'font-icons';
              font-size: 20px;
              width: 20px;
              height: 20px;
              z-index: 2;
              content: '${(props) => props.icon}';
              color: ${({ theme, disabled }) =>
                disabled ? theme.colors.snuff : theme.colors.white};
            }
          }

          &:checked ~ .formulate-input-element-decorator {
            border-color: ${({ theme, disabled }) =>
              disabled ? theme.colors.snuff : theme.colors.highland};
            background-color: ${({ theme, disabled }) =>
              disabled ? theme.background.snuff : theme.background.highland};

            &:before {
              color: ${({ theme, disabled }) =>
                disabled ? theme.colors.ghost : theme.colors.white};
            }
          }

          &:checked ~ label:after {
            content: '${(props) => props.icon}';
            font-family: 'font-icons';
            font-weight: bold;
            color: ${({ theme }) => theme.colors.white};
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 18px;
          }
        }
      }
    }

    .formulate-input-label {
      font-size: 14px;
      font-weight: 400;
      line-height: 20px;
      cursor: ${({ disabled }) => (disabled ? 'inherit' : 'pointer')};
      color: ${({ theme, disabled }) =>
        disabled ? theme.colors.bombay : theme.colors.shark};
    }
  }
`;

const checkboxGroupProps = {
  readOnly: Boolean,
  bordered: Boolean,
  icon: String,
};

const wrapperBorderedCss = css`
  border-radius: 4px;
  border: 1px solid ${({ theme }) => theme.colors.ghost};

  .formulate-input-group-item {
    padding: 10px 12px;
  }
  .formulate-input-group-item:not(:last-child) {
    margin-bottom: 0;
    border-bottom: 1px solid ${({ theme }) => theme.colors.wildSand};
  }
`;

export const CheckboxGroupWrapper = styled('div', checkboxGroupProps)`
  width: 100%;

  input,
  label {
    pointer-events: ${(props) => (props.readOnly ? 'none' : 'unset')};
  }

  .formulate-input-group {
    width: 100%;
  }

  .formulate-input-group-item {
    &:not(:last-child) {
      margin-bottom: 20px;
    }
  }

  .formulate-input-wrapper {
    display: flex;
    align-items: center;
  }

  & > .formulate-input {
    & > .formulate-input-wrapper {
      flex-direction: column;
      align-items: inherit;

      & > label {
        font-weight: 600;
        font-size: 14px;
        line-height: 18px;
        margin: 0;
        padding: 10px 12px;
        color: ${({ theme }) => theme.colors.abbey};
        border-bottom: 1px solid ${({ theme }) => theme.colors.wildSand};
      }
    }
  }
  .formulate-input-label {
    margin-left: 9px;
    font-size: 14px;
    font-weight: 400;
    line-height: 18px;
    word-break: break-word;
    color: ${({ theme }) => theme.colors.stormGray};
  }

  .formulate-input-group-item .formulate-input-label {
    cursor: pointer;
  }

  .formulate-input-element--checkbox {
    input {
      position: absolute;
      left: -999px;
      opacity: 0;
      pointer-events: none;

      &[type='checkbox']:checked ~ label {
        border-color: ${({ theme }) => theme.colors.highland};
      }

      &[type='checkbox']:checked ~ label:after {
        content: '${(props) => props.icon}';
        font-family: 'font-icons';
        font-weight: bold;
        color: ${({ theme }) => theme.colors.white};
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 18px;
      }

      &[type='checkbox']:checked ~ label:before {
        background-color: ${({ theme }) => theme.background.highland};
      }
    }

    label {
      position: relative;
      display: block;
      border-radius: 2px;
      border: 1px solid ${({ theme }) => theme.colors.highland};
      cursor: pointer;
      width: 20px;
      height: 20px;

      &:before {
        content: '';
        display: block;
        background-size: contain;
        background-position: 100%;
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
      }
    }
  }

  ${({ bordered }) => bordered && wrapperBorderedCss};
`;

const LabelProps = {
  disabled: Boolean,
};

const checkboxLabelDisabled = css`
  color: ${({ theme }) => theme.colors.spunPearl};
  cursor: inherit;
`;

export const CheckboxGroupLabel = styled('span', LabelProps)`
  ${(props) => props.disabled && checkboxLabelDisabled}
`;
