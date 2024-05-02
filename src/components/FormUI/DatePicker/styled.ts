import styled, { css } from 'vue-styled-components';

const datePickerProps = {
  width: String,
  height: String,
  variant: String,
  readOnly: Boolean,
  hasValue: Boolean,
};

const activeMaterialWrapperCSS = css`
  .date-picker-label {
    top: 8px;
    opacity: 1;
  }

  .mx-input-wrapper {
    .mx-input {
      padding-top: 20px;
      padding-bottom: 10px;
    }
  }
`;

const materialWrapperCSS = css`
  .date-picker-label {
    position: absolute;
    font-weight: bold;
    font-size: 8px;
    top: 12px;
    left: 13px;
    padding: 0;
    z-index: 1;
    opacity: 0;
    transition: top 0.1s linear;
  }

  &:hover {
    ${activeMaterialWrapperCSS}
  }

  ${(props) => props.hasValue && activeMaterialWrapperCSS}
`;

export const Wrapper = styled('div', datePickerProps)`
  width: ${(props) => props.width};
  position: relative;

  ${(props) => props.variant === 'material' && materialWrapperCSS}

  .mx-input {
    padding: 12px 36px 12px 12px;
    height: ${(props) => props.height};
    border: 1px solid ${({ theme }) => theme.colors.snuff};
    color: ${({ theme }) => theme.colors.eastBay};
    pointer-events: ${(props) => (props.readOnly ? 'none' : 'unset')};
  }

  .mx-input:hover,
  .mx-input:focus {
    border: 1px solid ${({ theme }) => theme.colors.royalBlue};
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
