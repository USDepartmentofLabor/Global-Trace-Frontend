/* eslint-disable max-lines */
import styled from 'vue-styled-components';

const dropdownProps = {
  width: String,
  height: String,
  isOpenMenu: Boolean,
  validation: Boolean,
  loading: Boolean,
  hasValue: Boolean,
};

const elementProps = {
  color: String,
  background: String,
};

export const Title = styled.label`
  font-weight: 600;
  font-size: 12px;
  line-height: 15px;
  color: ${({ theme }) => theme.colors.highland};
  padding: 0 4px;
  margin-bottom: 4px;
`;

export const ElementLabel = styled.span`
  color: ${({ theme }) => theme.colors.stormGray};
`;

export const ElementTier = styled.span`
  color: ${({ theme }) => theme.colors.highland};
`;

export const Option = styled('div', elementProps)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  line-height: 20px;
  height: 48px;
  padding: 8px 13px;

  &:hover {
    background-color: ${({ theme, background }) =>
      background ? theme.background[background] : theme.background.zircon};
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
    }

    &__select {
      display: none;
    }

    &__input {
      margin-bottom: 0;
      padding: 0;
      color: ${({ theme }) => theme.colors.envy};
      width: 100% !important;
      position: relative !important;
      font-size: 14px;
      background-color: transparent;
      &::placeholder {
        color: ${({ theme }) => theme.colors.surfCrest};
      }
    }

    &__tags {
      font-size: 14px;
      line-height: 20px;
      height: ${(props) => props.height};
      padding: 12px 12px 12px 46px;
      overflow: hidden;
      min-height: ${(props) => props.height};
      display: flex;
      align-items: center;
      background-color: ${({ theme }) => theme.colors.white};
      border-radius: 4px;
      border: 1px solid
        ${({ theme, validation, hasValue }) => {
          if (validation) return theme.colors.red;
          if (hasValue) return theme.colors.highland;
          return theme.colors.surfCrest;
        }};

      &:hover {
        border: 1px solid
          ${({ theme, validation }) =>
            validation ? theme.colors.red : theme.colors.highland};
      }

      .multiselect {
        &__spinner {
          display: ${(props) => (props.loading ? 'block' : 'none')};
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
        &__placeholder {
          display: none;
        }
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
      }

      &::-webkit-scrollbar-track {
        border-radius: 4px;
        background-color: ${({ theme }) => theme.background.ghost};
      }

      &::-webkit-scrollbar-thumb {
        background-color: ${({ theme }) => theme.background.highland};
      }
    }

    &--active {
      .multiselect__tags {
        border: 1px solid ${({ theme }) => theme.colors.highland};
      }
    }

    &--disabled {
      opacity: 1;
      .multiselect {
        &__tags,
        &__single {
          background-color: ${({ theme }) => theme.background.whisper};
        }
      }
    }
  }
`;

export const SearchIcon = styled.span`
  position: absolute;
  top: 29px;
  left: 13px;
  z-index: 100;
`;

export const SelectedWrapper = styled.div`
  margin-top: 4px;
  padding: 10px;
  border-radius: 4px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  background-color: ${({ theme }) => theme.background.white};
  border: 1px solid ${({ theme }) => theme.colors.highland};
`;

export const Tag = styled.span`
  padding: 6px;
  border-radius: 6px;
  font-weight: 400;
  font-size: 14px;
  display: flex;
  align-items: center;
  background-color: ${({ theme }) => theme.background.wildSand};
  color: ${({ theme }) => theme.colors.stormGray};
`;

export const RemoveIcon = styled.span`
  margin-left: 10px;
  cursor: pointer;
`;

export const SuggestionText = styled.span`
  height: 18px;
  font-weight: 400;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.envy};
`;
