/* eslint-disable max-lines */
import styled, { css } from 'vue-styled-components';

const dropdownProps = {
  width: String,
  height: String,
  disabled: Boolean,
  isOpenMenu: Boolean,
  validation: Boolean,
  loading: Boolean,
  hasValue: Boolean,
};

const labelProps = {
  validation: Boolean,
  required: Boolean,
};

const elementProps = {
  color: String,
  background: String,
};

const elementLabelProps = {
  type: String,
  color: String,
};

const hasValueCSS = css`
  font-size: 9px;
  line-height: 16px;
  height: 16px;
  top: -8px;
  background-color: ${({ theme }) => theme.background.white};
`;

const notHasValueCSS = css`
  font-size: 14px;
  line-height: 20px;
  height: 20px;
  top: 10px;
  background-color: transparent;
`;

export const Title = styled('label', labelProps)`
  font-weight: 600;
  font-size: 14px;
  line-height: 15px;
  color: ${({ theme }) => theme.colors.highland};
  padding: 0 4px;
  margin-bottom: 4px;
`;

export const Limit = styled.div`
  display: flex;
  align-items: center;
  flex-shrink: 0;
  padding: 6px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 400;
  background: ${({ theme }) => theme.background.surfCrest};
  color: ${({ theme }) => theme.colors.stormGray};
`;

const circleCSS = css`
  &:before {
    display: block;
    margin-right: 5px;
    content: '';
    width: 12px;
    height: 12px;
    background-color: ${({ theme, color }) => theme.colors[color]};
    border: 2px solid ${({ theme }) => theme.colors.white};
    border-radius: 50%;
  }
`;

export const ElementLabel = styled('span', elementLabelProps)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: ${(props) => (props.type === 'color' ? '100%' : 'auto')};
  ${(props) => props.type === 'color' && circleCSS}
`;

export const Option = styled('div', elementProps)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  line-height: 20px;
  height: 40px;
  padding: 8px;

  &:hover {
    background-color: ${({ theme, background }) =>
      background ? theme.background[background] : theme.background.zircon}};
    color: ${({ theme, color }) => theme.background[color]};
  }
`;

export const NoResult = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 40px;
  padding: 8px;
  color: ${({ theme }) => theme.colors.stormGray};
`;

export const Wrapper = styled('div', dropdownProps)`
  width: ${(props) => props.width};
  position: relative;
  display: flex;
  flex-direction: column;

  .multiselect--active .multiselect__current,
  .multiselect--active .multiselect__input,
  .multiselect--active .multiselect__tags {
      border-radius: 4px;
  }
  .multiselect {
    font-weight: 400;

    color: ${({ theme }) => theme.colors.stormGray};
    &.multiselect--above {
      .multiselect__content-wrapper {
        transform: translateY(-8px);
      }
    }
    &.multiselect--disabled {
      .multiselect__tags {
        background-color: ${({ theme }) => theme.background.athensGray};
        border: 1px solid ${({ theme }) => theme.colors.spunPearl};
      }
      .multiselect__select:before {
        border-color: ${({ theme }) =>
          theme.colors.spunPearl} transparent transparent;
        border-width: 4px 4px 0;
      }
    }
    & > label {
      left: 12px;
      padding: 0 4px;
      border-radius: 1px;
      ${(props) => (props.hasValue ? hasValueCSS : notHasValueCSS)};
    }

    &__select {
      width: 42px;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      transform: none;
      border-radius: 8px;
      background-color: transparent;
      padding: 10px 12px;
      color: ${({ theme }) => theme.colors.stormGray}

      &:before {
        position: unset;
        color: ${({ theme }) => theme.colors.highland};
        border-color: ${({ theme }) =>
          theme.colors.highland} transparent transparent;
        transform: translateY(-50%);
      }
    }

    &__input {
      margin-bottom: 0;
      padding: 0;

      &::placeholder {
        color: ${({ theme }) => theme.colors.spunPearl};
      }
    }

    &__tags {
      font-size: 14px;
      line-height: 10px;
      padding: 12px 36px 12px 12px;
      overflow: hidden;
      min-height: ${(props) => props.height};
      display: flex;
      align-items: center;
      gap: 10px;
      background-color: ${({ theme }) => theme.colors.white};
      border-radius: 4px;
      border: 1px solid ${({ theme, validation }) =>
        validation ? theme.colors.red : theme.colors.surfCrest};

      &:hover {
        border: 1px solid ${({ theme, validation }) =>
          validation ? theme.colors.red : theme.colors.highland};
      }

      .multiselect {
        &__spinner {
          display: ${(props) => (props.loading ? 'block' : 'none')}
          right: 10px;
          top: 1px;
          width: 38px;
          height: 38px;
          background-color: ${({ theme }) => theme.background.white};
          &:before,
          &:after {
            top: 46%;
            border-top-color: ${({ theme }) => theme.colors.highland};
          }
        }

        &__tags-wrap {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;

          .multiselect__tag {
            font-size: 12px;
            border-radius: 4px;
            margin: 0;
            border: 1px solid ${({ theme }) => theme.background.ghost};
            background-color: ${({ theme }) => theme.background.wildSand};
            color: ${({ theme }) => theme.background.stormGray};
            &-icon {
              width: 20px;
              height: 20px;
              line-height: 20px;
              border-radius: 0;
              &:hover {
                background-color: ${({ theme }) => theme.background.highland};
                :after {
                  color: ${({ theme }) => theme.colors.white};
                }
              }
              :after {
                color: ${({ theme }) => theme.colors.stormGray};
              }
            }
          }
        }

        &__single {
          font-size: 14px;
          padding-left: 0;
          margin-bottom: 0;
          background-color: transparent;
          white-space: pre;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        &__placeholder {
          display: none;
          max-width: 100%;
          padding: 0;
          margin: 0;
          overflow: hidden;
          white-space: nowrap;
        }
      }

      .multiselect__placeholder {
        display: inline-block;
        line-height: 18px;
      }
    }

    &__content-wrapper {
      margin-top: 4px;
      box-shadow: 0px 4px 4px rgba(85, 85, 85, 0.12);
      border-radius: 8px;
      padding: 4px;

      .multiselect {
        &__element {
          &:last-child {
            border-bottom: none;
          }
        }

        &__option {
          border-radius: 8px;
          min-height: 30px;
          padding: 0;
          color: ${({ theme }) => theme.colors.stormGray};

          &--highlight {
            background: ${({ theme }) => theme.background.wildSand};
          }

          &--selected {
            background-color: ${({ theme }) => theme.background.wildSand};
          }
        }
      }
    }

    .multiselect__content-wrapper {
      &::-webkit-scrollbar {
        width: 6px;
        height: 6px;
      }

      &::-webkit-scrollbar-track {
        border-radius: 4px;
        background-color: ${({ theme }) => theme.background.ghost};
      }

      &::-webkit-scrollbar-thumb {
        border-radius: 4px;
        background-color: ${({ theme }) => theme.background.highland};
      }
    }

    &--active {
      & > label {
        font-size: 9px;
        line-height: 16px;
        height: 16px;
        top: -8px;
        background-color: ${({ theme }) => theme.background.white};
        color: ${({ theme }) => theme.colors.highland};
      }

      .multiselect__tags {
        border: 1px solid ${({ theme }) => theme.colors.highland};

        .multiselect {
          &__input {
            font-size: 14px;

            &::-webkit-input-placeholder,
            &:-ms-input-placeholder,
            &::placeholder {
              color: ${({ theme }) => theme.colors.midGray};
            }
          }
        }
      }
    }

    &--disabled {
      opacity: 1;
      .multiselect {
        &__tags, &__single,  &__select  {
          background-color: ${({ theme }) => theme.background.whisper};
        }
      }
    }
  }

  .select-language {
    width: 206px;

    .multiselect__option {
      display: flex;
      padding: 14px 8px;
    }

    .multiselect__element {
      margin-bottom: 4px;

      &:last-child {
        margin-bottom: 0;
      }
    }

    @media screen and (max-width: 768px) {
      width: 132px;
    }
  }

`;

export const LanguageOption = styled.div`
  display: flex;
  align-items: center;

  span:last-child {
    margin-left: 10px;
    font-size: 14px;
    font-weight: 400;
    line-height: 18px;
    color: ${({ theme }) => theme.colors.stormGray};
  }
`;

export const Tag = styled.div`
  display: -webkit-box;
  padding: 2px 6px;
  border-radius: 6px;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  word-wrap: break-word;
  line-height: 18px;
  background: ${({ theme }) => theme.background.wildSand};
`;

export const Placeholder = styled.span`
  font-size: 14px;
  font-weight: 400;
  color: ${({ theme }) => theme.colors.spunPearl};
`;
