import styled from 'vue-styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 15px;
  border-radius: 8px;
  box-shadow: 0px 4px 4px rgba(155, 174, 217, 0.12);
  background-color: ${({ theme }) => theme.background.white};
`;

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const tagContentParams = {
  height: String,
};

export const TagContent = styled('div', tagContentParams)`
  display: grid;
  grid-template-columns: auto auto 1fr auto;
  gap: 15px;
  align-items: center;

  height: ${(props) => props.height};

  button {
    padding: 0;
  }
`;

export const SubTitle = styled.div`
  text-align: right;
`;
