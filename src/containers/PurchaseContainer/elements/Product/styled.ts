import styled, { css } from 'vue-styled-components';

const textEllipsis = css`
  max-width: 100px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const totalProps = {
  isEllipsis: Boolean,
};

export const Row = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Total = styled('div', totalProps)`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.stormGray};
  ${(props) => props.isEllipsis && textEllipsis}
`;

export const Strong = styled.span`
  font-weight: 600;
  padding-right: 2px;
`;

export const LotWeight = styled.span`
  padding-right: 10px;
`;
