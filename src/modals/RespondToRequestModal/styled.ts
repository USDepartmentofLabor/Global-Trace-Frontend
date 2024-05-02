import styled from 'vue-styled-components';

export const Wrapper = styled.div`
  display: flex;
  justify-content: center;
`;

export const Form = styled.div`
  width: 312px;
  padding: 24px 0 48px;
  display: flex;
  gap: 8px;
  flex-direction: column;
`;

export const Row = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Line = styled.div`
  margin: 8px 0;
  border-top: 1px solid ${(props) => props.theme.colors.ghost};
`;

export const Action = styled.div`
  margin-top: 24px;
`;

export const InputGroup = styled.div`
  display: flex;
  cursor: pointer;
  height: 48px;
  align-items: center;
  justify-content: space-between;
  padding: 16px 12px;
  padding-right: 10px;
  box-sizing: border-box;
  border: 1px solid ${({ theme }) => theme.colors.surfCrest};
  border-radius: 4px;
`;

const inputGroupResultProps = {
  isActive: Boolean,
};

export const InputGroupResult = styled('div', inputGroupResultProps)`
  font-weight: 400;
  font-size: 14px;
  line-height: 18px;
  color: ${({ theme, isActive }) =>
    isActive ? theme.colors.highland : theme.colors.silverChalice};
`;
