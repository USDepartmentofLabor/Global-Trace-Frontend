import styled from 'vue-styled-components';
import spriteFlags from 'assets/images/flags.png';

const flagProps = { position: String };

export default styled('span', flagProps)`
  display: inline-block;
  width: 16px;
  min-width: 16px;
  height: 12px;
  background-image: url(${spriteFlags});
  background-repeat: no-repeat;
  background-position: ${(props) => props.position};
`;
