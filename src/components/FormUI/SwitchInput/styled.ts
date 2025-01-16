import styled from 'vue-styled-components';

export const Switch = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

export const Label = styled.div`
  font-weight: 600;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.manatee};
`;

const inputContainerProps = {
  isActivated: Boolean,
};

export const InputContainer = styled('div', inputContainerProps)`
  position: relative;
  cursor: pointer;
  width: 40px;
  height: 20px;
  box-sizing: border-box;
  border-radius: 20px;
  background-color: ${({ isActivated, theme }) =>
    isActivated ? theme.background.highland : theme.background.manatee};

  &:before {
    content: '';
    position: absolute;
    top: 4px;
    left: ${({ isActivated }) => (isActivated ? '24px' : '4px')};
    width: 12px;
    height: 12px;
    transition: 0.2s;
    border-radius: 20px;
    background: ${({ theme }) => theme.background.white};
  }
`;
