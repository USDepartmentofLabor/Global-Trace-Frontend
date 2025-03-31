import styled from 'vue-styled-components';

const datePickerProps = {
  width: String,
  height: String,
  disabled: Boolean,
  readOnly: Boolean,
  hasValue: Boolean,
};

export const Wrapper = styled('div', datePickerProps)`
  width: ${(props) => props.width};
  position: relative;

  .mx-input-wrapper {
    .mx-input {
      cursor: inherit;
      padding: 8px 36px 8px 12px;
      height: ${(props) => props.height};
      border: 1px solid
        ${({ disabled, theme }) =>
          disabled ? theme.colors.spunPearl : theme.colors.snuff};
      color: ${({ theme }) => theme.colors.eastBay};
      pointer-events: ${(props) => (props.readOnly ? 'none' : 'unset')};
      background-color: ${({ disabled, theme }) =>
        disabled ? theme.background.athensGray2 : theme.background.white};
    }

    .mx-input:hover,
    .mx-input:focus {
      padding: 8px 36px 8px 12px;
      padding-bottom: 8px;
      border-color: ${({ disabled, theme }) =>
        disabled ? theme.colors.spunPearl : theme.colors.highland};
    }
  }

  .mx-datepicker {
    width: 100%;
  }

  .mx-icon-calendar {
    right: 12px;
  }

  .mx-datepicker-range {
    .mx-datepicker-sidebar {
      display: none;
    }
  }
`;

export const LabelWrapper = styled.div`
  display: flex;
`;

export const Label = styled.div`
  font-weight: 600;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.highland};
  padding: 0 4px;
  line-height: 15px;
  margin-bottom: 4px;
`;
