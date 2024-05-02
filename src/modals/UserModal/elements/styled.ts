import styled, { css } from 'vue-styled-components';

const rowProps = {
  isSupplier: Boolean,
};

export const Row = styled('div', rowProps)`
  margin-bottom: 10px;

  ${(props) =>
    props.isSupplier &&
    css`
      display: flex;
    `}
`;

export const Tier = styled.div`
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;
