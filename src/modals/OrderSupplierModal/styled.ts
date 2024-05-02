import styled from 'vue-styled-components';

export const Content = styled.div`
  padding: 20px 30px;
`;

const actionsProps = {
  isColumn: Boolean,
};

export const Actions = styled('div', actionsProps)`
  display: flex;
  flex-direction: ${({ isColumn }) => (isColumn ? 'column' : 'row')};
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  gap: 4px;

  @media (max-width: 776px) {
    flex-direction: column;
  }
`;

export const Row = styled.div`
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 10px;

  @media (max-width: 992px) {
    flex-direction: column;
  }
`;

export const Col = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Box = styled.div`
  margin-top: 10px;
  padding: 10px;
  text-align: center;
  font-size: 12px;
  line-height: 15px;
  color: ${({ theme }) => theme.colors.highland};
  background-color: ${({ theme }) => theme.background.wildSand};
`;

export const Strong = styled.div`
  font-weight: 600;
`;
