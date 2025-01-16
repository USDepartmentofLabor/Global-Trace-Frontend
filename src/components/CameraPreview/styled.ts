import styled from 'vue-styled-components';

const cameraContainerParams = {
  show: Boolean,
};

export const Wrapper = styled('div', cameraContainerParams)`
  position: fixed;
  top: ${(props) => (props.show ? 0 : '99999px')};
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

export const CameraBackDrop = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

export const CloseIcon = styled.div`
  position: absolute;
  right: 30px;
  top: 30px;
  cursor: pointer;
`;
