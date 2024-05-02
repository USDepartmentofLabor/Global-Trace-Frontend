import styled, { css } from 'vue-styled-components';

const fontProps = {
  content: String,
  size: String,
  color: Function,
  cursor: Boolean,
};

const cursor = css`
  cursor: pointer;
`;

export default styled('span', fontProps)`
  font-family: 'font-icons' !important;
  speak: none;
  font-style: normal;
  font-weight: normal;
  font-variant: normal;
  text-transform: none;
  line-height: 1;
  color: ${(props) => props.color};
  font-size: ${(props) => props.size}px;
  vertical-align: middle;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  ${(props) => props.cursor && cursor}

  &:before {
    content: '${(props) => props.content}';
  }
`;
