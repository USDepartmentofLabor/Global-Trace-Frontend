import styled, { css } from 'vue-styled-components';

const itemProps = {
  disabled: Boolean,
};

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  max-height: 430px;
  padding: 32px;

  .ps {
    margin: 0 -30px;
    padding: 0 30px;
  }
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const Title = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.stormGray};
`;

export const Input = styled.div`
  display: flex;
  flex-direction: column;
`;

export const List = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Item = styled('div', itemProps)`
  padding: 16px 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.wildSand};
  ${(props) =>
    props.disabled &&
    css`
      pointer-events: none;
    `}
`;

export const ItemWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  position: relative;

  .add-tag {
    position: absolute;
    top: 12px;
    right: 12px;
    cursor: pointer;
  }
`;

export const Tags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 16px;
`;

export const Tag = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 400;
  color: ${({ theme }) => theme.colors.abbey};
  background-color: ${({ theme }) => theme.colors.wildSand};
`;

export const Actions = styled.div`
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 16px;
  height: 40px;

  & > div {
    width: 50%;
  }
`;
