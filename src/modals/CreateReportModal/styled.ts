import styled from 'vue-styled-components';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 16px 0;
  gap: 16px;

  @media (max-width: 768px) {
    padding: 15px;
  }

  .ps {
    max-height: calc(100svh - 160px);
  }
`;

export const Form = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 0 30px;

  @media (max-width: 768px) {
    padding: 0;
  }
`;

export const Row = styled.div`
  display: flex;
`;

export const Col = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Actions = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;

  @media (max-width: 767px) {
    flex-direction: column-reverse;
  }
`;

export const DropdownGroup = styled.div`
  display: flex;
  gap: 10px;

  & > div {
    flex: 1;

    &:first-child {
      flex: 2;
    }
  }
`;

export const InputGroup = styled.div`
  width: 100%;
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

export const Label = styled.div`
  font-weight: 600;
  font-size: 14px;
  line-height: 20px;
  padding: 0 4px;
  color: ${({ theme }) => theme.colors.highland};
`;
