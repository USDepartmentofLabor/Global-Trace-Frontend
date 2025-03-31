import styled from 'vue-styled-components';

export const Form = styled.div`
  width: 100%;
  box-sizing: border-box;
  padding: 24px 32px;
  margin: auto;
  display: flex;
  gap: 24px;
  flex-direction: column;

  .ps {
    max-height: calc(100vh - 200px);
  }
`;

export const Row = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Location = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const Line = styled.div`
  margin: 8px 0;
  border-top: 1px solid ${(props) => props.theme.colors.ghost};
`;

export const Actions = styled.div`
  display: flex;
  justify-content: center;
  gap: 16px;
`;

export const ButtonGroupEnd = styled.div`
  display: flex;
  gap: 16px;
  flex: 1;
  justify-content: flex-end;
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
