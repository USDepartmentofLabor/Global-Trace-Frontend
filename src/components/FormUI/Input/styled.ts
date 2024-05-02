import styled, { css } from 'vue-styled-components';

const inputProps = {
  width: String,
  height: String,
  prefixIcon: String,
  suffixIcon: String,
  iconError: String,
  disabled: Boolean,
  variant: String,
};

const labelProps = {
  required: Boolean,
  prefixIcon: String,
};

const asteriskCSS = css`
  &:after {
    width: 4px;
    height: 12px;
    margin: 0px 2px;
    color: ${({ theme }) => theme.colors.red};
    content: '*';
  }
`;

export const PrefixIcon = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 20px;
  padding: 0 12px;
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.colors.stormGray};
`;

export const Label = styled('span', labelProps)`
  left: ${(props) => (props.prefixIcon ? '34px' : '14px')};
  font-size: 14px;
  line-height: 15px;
  font-weight: 600;
  word-break: break-word;
  transition: 0.1s linear, background-color 0.1s linear;
  z-index: 2;
  padding: 0 4px;
  margin-bottom: 4px;
  color: ${({ theme }) => theme.colors.highland};
  background-color: transparent;
  ${(props) => props.required && asteriskCSS}
`;

export const LabelWrapper = styled.div`
  display: flex;
`;

export const SuffixIcon = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  height: 100%;
  padding: 12px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.bombay};
`;

const inputPrefixIcon = css`
  padding-left: ${(props) => props.height};
`;

const inputSuffixIcon = css`
  padding-right: ${(props) => props.height};
`;

const inputElementCSS = css`
  .formulate-input-wrapper {
    position: relative;

    .formulate-input-element {
      position: relative;
      width: ${(props) => props.width};
    }

    .formulate-input-element {
      input,
      textarea {
        font-size: 14px;
        line-height: 20px;
        font-weight: 400;
        padding: 8px 12px;
        width: ${(props) => props.width};
        height: ${(props) => props.height};
        ${(props) => props.prefixIcon !== '' && inputPrefixIcon}
        ${(props) => props.suffixIcon !== '' && inputSuffixIcon}
        box-sizing: border-box;
        border: 1px solid ${({ theme }) => theme.colors.surfCrest};
        color: ${({ theme }) => theme.colors.stormGray};
        border-radius: 4px;
        outline: none;

        &:focus,
        &:hover {
          border: 1px solid ${({ theme }) => theme.colors.highland};
        }

        &:disabled {
          background-color: ${({ theme }) => theme.background.wildSand};
          border: 1px solid ${({ theme }) => theme.colors.spunPearl};
          color: ${({ theme }) => theme.colors.stormGray};
        }

        &::placeholder {
          color: ${({ theme }) => theme.colors.spunPearl};
        }
      }

      input[type='number']::-webkit-inner-spin-button,
      input[type='number']::-webkit-outer-spin-button {
        -webkit-appearance: none;
      }
    }
  }
`;

const inputErrorCSS = css`
  &[data-is-showing-errors='true'] {
    .formulate-input-wrapper {
      > span {
        color: ${({ theme }) => theme.colors.red};
      }

      .formulate-input-element {
        input,
        textarea {
          border-color: ${({ theme }) => theme.colors.red};

          &::placeholder {
            color: ${({ theme }) => theme.colors.red};
          }
        }
      }
    }
  }
`;

const errorMessageCSS = css`
  .formulate-input-errors {
    margin: 4px 0;
    padding: 0;
    list-style: none;

    .formulate-input-error {
      align-items: center;
      font-size: 14px;
      line-height: 20px;
      color: ${({ theme }) => theme.colors.red};
      text-align: right;
      word-break: break-word;
    }
  }
`;

const textareaScrollCSS = css`
  textarea {
    min-height: 82px;
    position: relative;
    resize: none;

    &::-webkit-scrollbar {
      width: 6px;
    }

    &::-webkit-scrollbar-track {
      border-radius: 4px;
      background-color: ${({ theme }) => theme.background.ghost};
    }

    &::-webkit-scrollbar-thumb {
      background: ${({ theme }) => theme.colors.highland};
    }

    ::-webkit-resizer {
      display: none;
    }
  }
`;

const materialWrapperCSS = css`
  .formulate-input-wrapper {
    .input-label {
      font-size: 8px;
      position: absolute;
      top: 5px;
      left: 10px;
      opacity: 0;
      height: 0;
      font-weight: bold;
      transition: all 0.1s linear;
      transition-property: height, top, opacity;
    }

    .formulate-input-element {
      input,
      textarea {
        transition: all 0.1s linear;
        transition-property: height, top, opacity;
      }
    }
  }
`;

export const activeMaterialWrapperCSS = css`
  &:hover,
  .formulate-input[data-has-value='true'] {
    .formulate-input-wrapper {
      .input-label {
        opacity: 1;
        top: 2px;
        height: auto;
      }

      .formulate-input-element {
        input,
        textarea {
          padding-top: 20px;
        }
      }
    }
  }
`;

export const errorMaterialWrapperCSS = css`
  .formulate-input[data-is-showing-errors='true'] {
    .input-label {
      color: ${({ theme }) => theme.colors.red};
    }
  }
`;

export const materialStyleCSS = css`
  ${materialWrapperCSS}
  ${activeMaterialWrapperCSS}
  ${errorMaterialWrapperCSS}
`;

export const Wrapper = styled('div', inputProps)`
  position: relative;
  width: ${(props) => (props.width ? props.width : '100%')};

  .formulate-input {
    ${inputElementCSS}
    ${inputErrorCSS}
    ${errorMessageCSS}
    ${textareaScrollCSS}
  }

  ${(props) => props.variant === 'material' && materialStyleCSS}
`;

export const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1em 1em 1em;
`;

export const Clear = styled.div`
  display: flex;
  cursor: pointer;
`;

export const Cancel = styled.div`
  display: flex;
  cursor: pointer;
`;

export const InputPriceContainer = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 8px;
  width: 100%;
`;

export const InputWrapper = styled.div`
  min-width: 100%;
  display: flex;
  flex-direction: column;
`;
