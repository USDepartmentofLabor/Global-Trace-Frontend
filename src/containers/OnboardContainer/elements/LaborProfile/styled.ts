import styled from 'vue-styled-components';

export const Wrapper = styled.div`
  width: 100%;
  padding: 16px;
  box-sizing: border-box;
`;

export const Content = styled.div`
  display: grid;
  grid-template-columns: 312px 312px;
  gap: 8px;

  @media screen and (max-width: 992px) {
    grid-template-columns: 1fr;
    width: 100%;
  }
`;

export const Group = styled.div`
  display: flex;
  gap: 8px;
  flex-direction: column;
  margin-top: 32px;
  width: 632px;

  @media screen and (max-width: 992px) {
    align-items: center;
    width: auto;
  }
`;

const columnProps = {
  isFullWidth: Boolean,
};

export const Column = styled('div', columnProps)`
  flex: 1;
  position: relative;
  ${({ isFullWidth }) => (isFullWidth ? 'grid-column: 1/3' : '')}

  &.last {
    .formulate-input-errors {
      position: absolute;
      right: 0;
    }
  }
`;

export const Row = styled.div`
  display: flex;
  gap: 8px;

  @media screen and (max-width: 992px) {
    flex-direction: column;
    width: 100%;
  }
`;

export const Title = styled.div`
  font-weight: 600;
  font-size: 16px;
  line-height: 20px;
  margin-bottom: 8px;
  text-align: center;

  color: ${({ theme }) => theme.colors.highland};
`;

export const Actions = styled.div`
  display: flex;
  justify-content: center;
  margin: 64px 0;
`;
