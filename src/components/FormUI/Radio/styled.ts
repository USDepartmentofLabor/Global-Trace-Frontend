import styled, { css } from 'vue-styled-components';

const radioProps = {
  disabled: Boolean,
  variant: String,
  readOnly: Boolean,
};

const radioCheckedStyles = {
  primary: css`
    input:checked + label {
      &:before {
        border-color: ${({ theme }) => theme.colors.highland};
      }

      &:after {
        background-color: ${({ theme }) => theme.colors.highland};
      }
    }
  `,
  warning: css`
    input:checked + label {
      &:before {
        border-color: ${({ theme }) => theme.colors.sandyBrown};
      }

      &:after {
        background-color: ${({ theme }) => theme.colors.sandyBrown};
      }
    }
  `,
};

export const Radio = styled('div', radioProps)`
  .formulate-input-wrapper {
    display: flex;
    align-items: center;
    pointer-events: ${(props) => (props.readOnly ? 'none' : 'unset')};
  }

  .formulate-input-element--radio {
    display: inline-block;
    position: relative;
    margin-bottom: 16px;
    margin-right: 10px;

    input {
      position: absolute;
      top: -4px;
      left: 0;
      width: 20px;
      height: 20px;
      opacity: 0;
      z-index: 0;
      cursor: pointer;
    }

    label {
      display: block;
      padding-left: 18px;
      cursor: pointer;

      &:before,
      &:after {
        content: '';
        position: absolute;
        border-radius: 14px;
      }

      &:before {
        top: -2px;
        left: 0;
        width: 16px;
        height: 16px;
        background-color: transparent;
        border: 2px solid ${({ theme }) => theme.colors.spunPearl};
        z-index: 1;
      }

      &:after {
        top: 3px;
        left: 5px;
        width: 10px;
        height: 10px;
        z-index: 2;
        background-color: ${({ theme }) => theme.colors.spunPearl};
        transform: scale(0, 0);
      }
    }

    input:checked + label {
      &:after {
        transform: scale(1, 1);
      }
    }

    ${(props) => radioCheckedStyles[props.variant]}
  }

  .formulate-input-label {
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
    cursor: ${({ disabled }) => (disabled ? 'inherit' : 'pointer')};
    color: ${({ theme, disabled }) =>
      disabled ? theme.colors.mercury : theme.colors.shark};
  }
`;

const radioGroupProps = {
  readOnly: Boolean,
  direction: String,
};

export const RadioGroup = styled('div', radioGroupProps)`
  .formulate-input-element {
    display: flex;
    gap: 20px;
    flex-direction: ${({ direction }) =>
      direction === 'vertical' ? 'column' : 'row'};
  }

  .formulate-input-group-item {
    pointer-events: ${(props) => (props.readOnly ? 'none' : 'unset')};
  }

  .formulate-input-element--radio {
    display: inline-block;
    position: relative;
    margin: 0 5px 12px 0px;
    font-size: 16px;
    line-height: 24px;

    input {
      position: absolute;
      top: -4px;
      left: 0;
      width: 36px;
      height: 20px;
      opacity: 0;
      z-index: 0;
      cursor: pointer;
    }

    label {
      display: block;
      padding: 0 0 0 24px;
      cursor: pointer;

      &:before,
      &:after {
        content: '';
        position: absolute;
        border-radius: 14px;
        transition: border-color 0.28s cubic-bezier(0.4, 0, 0.2, 1);
      }

      &:before {
        top: -4px;
        left: 0;
        width: 18px;
        height: 18px;
        background-color: transparent;
        border: 1px solid ${({ theme }) => theme.colors.highland};
        z-index: 1;
      }

      &:after {
        top: 1px;
        left: 5px;
        width: 10px;
        height: 10px;
        z-index: 2;
        background-color: ${({ theme }) => theme.background.highland};
        transform: scale(0, 0);
      }
    }

    input:checked + label {
      &:before {
        border-color: ${({ theme }) => theme.colors.highland};
      }

      &:after {
        transform: scale(1, 1);
      }
    }
  }

  & > .formulate-input-wrapper {
    display: flex;
    flex-direction: column;
  }

  .formulate-input-label {
    font-size: 14px;
    font-weight: 400;
    line-height: 22px;
    color: ${({ theme }) => theme.colors.stormGray};
    cursor: pointer;
  }
`;

const yesNoProps = {
  readOnly: Boolean,
};

export const YesNo = styled('div', yesNoProps)`
  .formulate-input-element {
    display: flex;
    justify-content: center;
    gap: 18px;

    .formulate-input-group-item {
      width: 133px;
      border-radius: 8px;
      border: 1px solid ${({ theme }) => theme.colors.envy};
      pointer-events: ${(props) => (props.readOnly ? 'none' : 'unset')};

      .formulate-input-element {
        display: none;
      }

      .formulate-input-label {
        display: block;
        padding: 12px 24px;
        font-weight: 600;
        font-size: 14px;
        line-height: 18px;
        color: ${({ theme }) => theme.colors.stormGray};
        cursor: ${(props) => (props.readOnly ? 'inherit' : 'pointer')};
      }

      &[data-has-value] {
        background-color: ${({ theme }) => theme.colors.cornflowerBlue};
      }
    }
  }
`;
