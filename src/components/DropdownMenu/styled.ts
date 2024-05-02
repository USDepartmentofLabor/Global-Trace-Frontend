import styled, { css } from 'vue-styled-components';

const toggleProps = {
  isOpen: Boolean,
};

const toggleOpenStyled = css`
  position: relative;
  z-index: 1000;
`;

const wrapperProps = {
  width: String,
};

export const Wrapper = styled('div', wrapperProps)`
  width: ${(props) => props.width};
  font-size: 8px;
  position: relative;
  display: inline-block;
  border-radius: 4px;
`;

export const Toggle = styled('div', toggleProps)`
  cursor: pointer;
  ${(props) => props.isOpen && toggleOpenStyled};
`;

export const Popup = styled.div`
  width: 100%;
  margin-top: 10px;
  padding: 10px 0;
  border: 1px solid ${({ theme }) => theme.colors.surfCrest};
  background: ${({ theme }) => theme.background.white};
  box-shadow: 0px 2px 4px rgba(202, 202, 202, 0.5),
    0px 1px 4px rgba(218, 218, 224, 0.4);
  border-radius: 4px;
  min-width: 108px;
  position: absolute;
  z-index: 1000;
  top: auto;
  right: 0;
  box-sizing: border-box;
`;

export const Search = styled.div`
  padding: 0 10px 10px;
`;

export const Menu = styled.div`
  text-align: left;
`;

export const List = styled.ul`
  margin: 0;
  padding: 0;

  & > .ps {
    max-height: 300px;
  }
`;

export const Option = styled.li`
  display: flex;
  align-items: center;
  cursor: pointer;
  gap: 4px;
  margin: 0 10px;
`;

export const Backdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background: transparent;
  z-index: 999;
`;

export const Empty = styled.div`
  white-space: pre;
  text-align: center;
  font-weight: 400;
  font-size: 8px;
  line-height: 12px;

  color: ${({ theme }) => theme.colors.spunPearl};
`;

export const Loading = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;
