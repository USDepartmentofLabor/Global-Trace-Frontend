import styled, { css } from 'vue-styled-components';

const contentProps = {
  isShow: Boolean,
  maxHeight: String,
};

const titleProps = {
  isShow: Boolean,
  maxHeight: String,
};

export const Wrapper = styled.div`
  margin-bottom: 10px;
`;

const showTitleStyle = css`
  .background {
    background-color: ${({ theme }) => theme.background.wildSand};
  }

  .arrow {
    transform: rotate(-90deg);
  }
`;

const hideTitleStyle = css`
  .arrow {
    transform: rotate(90deg);
  }
`;

export const Title = styled('div', titleProps)`
  display: block;
  ${({ isShow }) => (isShow ? showTitleStyle : hideTitleStyle)};
`;

const showContentStyle = css`
  opacity: 1;

  & > .arrow {
    transform: rotate(-90deg);
  }
`;

const hideContentStyle = css`
  opacity: 0;
  overflow: hidden;

  & > .arrow {
    transform: rotate(90deg);
  }
`;

export const Content = styled('div', contentProps)`
  position: relative;
  display: block;
  transition: opacity 0.3s ease, max-height 0.35s ease;
  max-height: ${({ maxHeight, isShow }) => (isShow ? maxHeight : 0)};
  ${({ isShow }) => (isShow ? showContentStyle : hideContentStyle)};

  .ps {
    max-height: ${({ maxHeight }) => maxHeight};
    padding: 0;
  }
`;
