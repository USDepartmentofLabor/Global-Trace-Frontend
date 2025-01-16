import styled, { css, keyframes } from 'vue-styled-components';
/* eslint-disable max-lines */

export const Wrapper = styled.div`
  position: relative;
  width: 100%;
`;

export const Inner = styled.div`
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  -ms-overflow-style: -ms-autohiding-scrollbar;
`;

const tableProps = {
  fixedLayout: Boolean,
  variant: String,
};

const fixedLayout = css`
  table-layout: fixed; ;
`;

const tableStyles = {
  spaceBetweenRow: css`
    border-collapse: separate;
    border-spacing: 0 12px;
  `,
};

export const Table = styled('table', tableProps)`
  min-width: 100%;
  margin: 0;
  margin-bottom: 0;
  clear: both;
  border-collapse: separate;
  border-spacing: 0;
  font-size: 14px;
  width: 100%;

  &:focus {
    outline: none;
  }
  ${(props) => props.fixedLayout && fixedLayout}
  ${(props) => tableStyles[props.variant]}
`;

export const Tr = styled.tr``;

const TdProps = {
  type: String,
};

export const Td = styled('td', TdProps)`
  border: none;
  padding: 14px 16px;
  vertical-align: middle;
  text-align: left;
  color: ${({ theme }) => theme.colors.abbey};
`;

const thLabelProps = {
  sortable: Boolean,
  sort: String,
  icon: String,
};

const thProps = {
  type: String,
  disabled: Boolean,
};

const thAction = css`
  padding: 0 11px 0 13px;
  vertical-align: middle;
`;

export const Th = styled('th', thProps)`
  padding: 10px 16px;
  vertical-align: bottom;
  text-align: left;
  user-select: none;

  ${(props) => props.type === 'action' && thAction}
  ${(props) => props.disabled && 'pointer-events: none;'}
`;

const thLabelSortable = css`
  padding-right: 18px;
  position: relative;
  cursor: pointer;

  &:before,
  &:after {
    font-family: 'font-icons';
    content: '${(props) => props.icon}';
    display: block;
    height: 0;
    right: 15px;
    top: 50%;
    position: absolute;
    width: 0;
  }

  &:before {
    color: ${({ theme }) => theme.colors.spunPearl};
    margin-top: 3px;
    transform: rotate(270deg);
  }

  &:after {
    color: ${({ theme }) => theme.colors.spunPearl};
    margin-top: -5px;
    right: -5px;
    transform: rotate(90deg);
  }
`;

const thLabelAsc = css`
  &:before {
    color: ${({ theme }) => theme.colors.highland};
  }

  &:after {
    color: ${({ theme }) => theme.colors.spunPearl};
  }
`;

const thLabelDesc = css`
  &:before {
    color: ${({ theme }) => theme.colors.spunPearl};
  }

  &:after {
    color: ${({ theme }) => theme.colors.highland};
  }
`;

export const ThLabel = styled('span', thLabelProps)`
  color: ${({ theme }) => theme.colors.highland};
  white-space: nowrap;
  font-weight: 600;
  line-height: 20px;
  font-size: 16px;
  padding-right: 10px;
  cursor: pointer;

  ${(props) => props.sortable && thLabelSortable}
  ${(props) => props.sort === 'asc' && thLabelAsc}
  ${(props) => props.sort === 'desc' && thLabelDesc}
`;

const theadStyles = {
  default: css`
    background-color: ${({ theme }) => theme.background.white};
    color: ${({ theme }) => theme.colors.highland};

    tr {
      background-color: transparent;
    }
  `,
  secondary: css`
    background-color: transparent;
    color: ${({ theme }) => theme.colors.spunPearl};

    tr {
      background-color: transparent;
      th {
        padding-bottom: 22px;
      }
      th:first-child {
        padding-left: 30px;
      }
    }
  `,
  spaceBetweenRow: css`
    background-color: transparent;
    color: ${({ theme }) => theme.colors.spunPearl};

    tr {
      background-color: transparent;
      th {
        span {
          font-size: 14px;
        }
      }
      th:first-child {
        padding-left: 58px;
      }
    }
  `,
};

const theadProps = {
  variant: String,
};

export const Thead = styled('thead', theadProps)`
  ${(props) => theadStyles[props.variant]}
`;

const tbodyProps = {
  isLoading: Boolean,
  hasAction: Boolean,
  variant: String,
};

const tbodyLoading = css`
  td {
    padding: 13px 0px;
  }
`;

const tbodyNotLoading = css`
  tr {
    td {
      border: none;
      padding: 14px 16px;
      vertical-align: middle;
      text-align: left;
    }
    &:hover {
      background-color: ${({ theme }) => theme.background.surfCrest};
    }
  }
`;

const tbodyHasAction = css`
  tr td:first-child {
    padding-left: 13px;
  }
`;

const tbodyStyles = {
  default: css`
    background-color: inherit;
    tr {
      td {
        border-bottom: 1px solid ${({ theme }) => theme.background.surfCrest};
      }
    }
  `,
  secondary: css`
    background-color: ${({ theme }) => theme.background.white};
    tr {
      td {
        border-top: 8px solid ${({ theme }) => theme.colors.white};
        padding: 12px 16px;
      }
      td:first-child {
        border-left: 8px solid ${({ theme }) => theme.colors.white};
      }
      td:last-child {
        border-right: 8px solid ${({ theme }) => theme.colors.white};
      }
    }
    tr:first-child {
      td:first-child {
        border-top-left-radius: 8px;
      }
      td:last-child {
        border-top-right-radius: 8px;
      }
    }
    tr:last-child {
      td:first-child {
        border-bottom-left-radius: 8px;
      }
      td:last-child {
        border-bottom-right-radius: 8px;
      }
      td {
        border-bottom: 8px solid ${({ theme }) => theme.colors.white};
      }
    }
  `,
  spaceBetweenRow: css`
    tr {
      border-radius: 8px;
      box-shadow: 0px 0px 4px rgba(109, 111, 126, 0.12);
      cursor: pointer;
      td {
        height: 44px;
        background-color: ${({ theme }) => theme.background.white};
        transition: background-color 0.2s ease;
        color: ${({ theme }) => theme.colors.abbey};
        &:first-child {
          padding-left: 58px;
          border-radius: 8px 0 0 8px;
        }
        &:last-child {
          padding-left: 10px;
          padding-right: 24px;
          text-align: right;
          border-radius: 0 8px 8px 0;
        }
      }
      &:hover {
        td {
          background-color: ${({ theme }) => theme.background.surfCrest};
        }
      }
    }
  `,
};

export const TBody = styled('tbody', tbodyProps)`
  ${(props) => props.isLoading && tbodyLoading}
  ${(props) => !props.isLoading && tbodyNotLoading}
  ${(props) => props.hasAction && tbodyHasAction}
  ${(props) => tbodyStyles[props.variant]}
`;

const ShimmerAnimation = keyframes`
  0% { background-position: -468px 0; }
  100% { background-position: 468px 0; }
`;

const backgroundImage = css`
  background-image: linear-gradient(
    to right,
    ${({ theme }) => theme.colors.skeletonLight} 0%,
    ${({ theme }) => theme.colors.skeletonDark} 20%,
    ${({ theme }) => theme.colors.skeletonLight} 40%,
    ${({ theme }) => theme.colors.skeletonLight} 100%
  );
`;

const Animation = css`
  background: ${({ theme }) => theme.colors.skeletonLight};
  ${backgroundImage}
  background-repeat: no-repeat;
  background-size: 800px 104px;
  position: relative;
  animation-duration: 1s;
  animation-fill-mode: forwards;
  animation-iteration-count: infinite;
  animation-name: ${ShimmerAnimation};
  animation-timing-function: linear;
`;

export const IconLoading = styled.span`
  width: 20px;
  height: 20px;
  margin-right: 20px;
  display: inline-block;
  ${Animation}
`;

export const LineLoading = styled.span`
  width: calc(100% - 44px);
  height: 20px;
  display: inline-block;
  ${Animation}
`;

const tableFooterProps = {
  isLoading: Boolean,
};

export const TableFooter = styled('div', tableFooterProps)`
  display: flex;
  justify-content: center;
`;

/*eslint-disable */

const ListItemProps = {
  isLoading: Boolean,
  isActive: Boolean,
  isBreakView: Boolean,
  isDisabled: Boolean,
};

const ItemLinkProps = {
  isPrevLink: Boolean,
  isNextLink: Boolean,
  isFirstPageLink: Boolean,
  isLastPageLink: Boolean,
};

export const Paginate = styled.ul`
  margin-top: 40px;
  margin-bottom: 0;
  user-select: none;

  @media screen and (max-width: 480px) {
    padding-left: 0;
    margin-top: 20px;
  }
`;

const listItemLoading = css`
  pointer-events: none;
  cursor: default;
`;

const listItemActive = css`
  a {
    color: ${({ theme }) => theme.colors.highland};
  }
`;

const listItemBreakView = css`
  display: none;
`;

const listItemDisabled = css`
  pointer-events: none;
  cursor: default;
  opacity: 0.5;
`;

export const ListItem = styled('li', ListItemProps)`
  display: inline-block;
  border-radius: 2px;
  margin-right: 4px;
  cursor: pointer;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.manatee};

  ${(props) => props.isLoading && listItemLoading}

  ${(props) => props.isActive && listItemActive}

  ${(props) => props.isBreakView && listItemBreakView}

  ${(props) => props.isDisabled && listItemDisabled}

  &:last-child {
    margin-right: 0px;
  }
`;

const arrowCss = css`
  content: '';
  border: solid ${({ theme }) => theme.colors.kimberly};
  border-width: 0 2px 2px 0;
  display: inline-block;
  padding: 3px;
`;

const arrowLeftCss = css`
  ${arrowCss}
  transform: rotate(135deg) translate(-1px, -1px);
`;

const arrowRightCss = css`
  ${arrowCss}
  transform: rotate(-45deg) translate(-1px, -1px);
`;

const itemLinkPrev = css`
  &:before {
    ${arrowLeftCss}
  }
`;

const itemLinkNext = css`
  &:before {
    ${arrowRightCss}
  }
`;

const itemLinkFirstPage = css`
  &:before {
    ${arrowLeftCss}
  }
  &:after {
    ${arrowLeftCss}
  }
`;

const itemLinkLastPage = css`
  &:before {
    ${arrowRightCss}
  }
  &:after {
    ${arrowRightCss}
  }
`;

export const ItemLink = styled('a', ItemLinkProps)`
  padding: 4px 11px;
  display: block;
  font-size: 14px;
  line-height: 22px;
  color: ${({ theme }) => theme.colors.kimberlyExtra};
  text-decoration: none;
  ${(props) => props.isPrevLink && itemLinkPrev}
  ${(props) => props.isNextLink && itemLinkNext}
  ${(props) => props.isFirstPageLink && itemLinkFirstPage}
  ${(props) => props.isLastPageLink && itemLinkLastPage}
`;

export const EmptyText = styled.p`
  text-align: center;
  margin: 0;
`;
