import styled, { css } from 'vue-styled-components';

const wrapperProps = {
  isShow: Boolean,
};

const textProps = {
  isBold: Boolean,
};

const rowProps = {
  isFullWidth: Boolean,
};

const requestBlockProps = {
  isExpand: Boolean,
};

export const Wrapper = styled('div', wrapperProps)`
  position: fixed;
  top: 0;
  bottom: 0;
  right: 0;
  width: 580px;
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.background.wildSand};
  box-shadow: -4px 0px 4px rgba(100, 100, 94, 0.12);
  transition: transform 0.35s;
  transform: ${(props) =>
    !props.isShow ? 'translateX(2000px)' : 'translateX(0)'};
  z-index: 1;

  @media screen and (max-width: 768px) {
    width: 100%;
    top: 70px;
  }
`;

export const Header = styled.div`
  display: flex;
  flex-shrink: 0;
  align-items: center;
  height: 74px;
  padding-left: 64px;

  @media screen and (max-width: 992px) {
    height: 40px;
  }
`;

export const Footer = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  border-top: 1px solid;
  border-color: ${({ theme }) => theme.colors.ghost};
  padding: 24px;

  @media screen and (max-width: 992px) {
    padding: 8px 24px;
  }
`;

export const CloseIcon = styled.div`
  position: absolute;
  top: 26px;
  left: 26px;
  z-index: 1;
  cursor: pointer;

  @media screen and (max-width: 992px) {
    top: 10px;
    left: 16px;
  }
`;

export const Title = styled.div`
  font-weight: 800;
  text-align: center;
  font-size: 20px;
  line-height: 25px;
  color: ${({ theme }) => theme.colors.highland};
`;

export const Content = styled.div`
  padding: 3px 56px 0;
  .ps {
    max-height: calc(100svh - 200px);
  }

  @media screen and (max-width: 768px) {
    padding: 24px;
  }
`;

const RequestBlockExpended = css`
  height: auto;
  max-height: 100%;
  border-width: 24px 40px;

  @media screen and (max-width: 768px) {
    border-width: 24px;
  }
`;

export const RequestBlock = styled('div', requestBlockProps)`
  max-height: 18px;
  border-width: 15px 40px;
  border-style: solid;
  border-color: ${({ theme }) => theme.background.white};
  background-color: ${({ theme }) => theme.background.white};
  overflow: hidden;
  cursor: pointer;
  transition: border 0.3s;
  &:not(:first-child) {
    margin-top: 12px;
  }
  ${(props) => props.isExpand && RequestBlockExpended}
`;

const RowFullWidth = css`
  display: block;
  dt {
    margin-bottom: 4px;
  }
`;

export const Row = styled('dl', rowProps)`
  margin: 0;
  display: flex;
  font-size: 14px;
  line-height: 18px;
  &:not(:first-child) {
    margin-top: 12px;
  }
  ${(props) => props.isExpand && RowFullWidth}
`;

export const Label = styled.dt`
  flex-shrink: 0;
  width: 140px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.ghost};
`;

export const Text = styled('dd', textProps)`
  flex: 1;
  position: relative;
  margin: 0;
  font-weight: ${({ isBold }) => (isBold ? '600' : '400')};
  color: ${({ theme }) => theme.colors.abbey};
  word-break: break-word;
`;

export const FileList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

export const FileItem = styled.div`
  display: flex;
  padding: 15px 20px;
  color: ${({ theme }) => theme.colors.envy};
  background-color: ${({ theme }) => theme.background.white};
  box-shadow: 0px 0px 4px ${({ theme }) => theme.colors.blackTransparent3};
  border-radius: 8px;
  align-items: center;
  gap: 10px;
  cursor: pointer;
`;

export const FileName = styled.div`
  font-size: 14px;
  flex: 1;
  word-break: break-all;
`;

export const Line = styled.div`
  border-top: 1px solid ${({ theme }) => theme.background.ghost};
  margin: 16px 0;
`;

export const Inner = styled.div`
  width: 312px;
  margin-top: 12px;
`;
