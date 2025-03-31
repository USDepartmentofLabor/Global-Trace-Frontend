import styled, { css } from 'vue-styled-components';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;

  & > .ps {
    max-height: calc(100vh - 140px);
  }
`;

export const Row = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 24px 32px;
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 32px;
  background-color: ${({ theme }) => theme.background.surfCrest};
  box-shadow: 0px 1px 2px 0px ${({ theme }) => theme.colors.blackTransparent6};
  box-shadow: 0px 1px 3px 0px ${({ theme }) => theme.colors.blackTransparent1};
`;

export const CategoryName = styled.div`
  font-size: 16px;
  font-weight: 700;
  line-height: 24px;
  color: ${({ theme }) => theme.colors.shark};
`;

const statusProps = {
  variant: String,
};

const statusVariant = {
  Draft: css`
    background-color: ${({ theme }) => theme.colors.spunPearl};
  `,
  New: css`
    background-color: ${({ theme }) => theme.colors.royalBlue};
  `,
  'In progress': css`
    background-color: ${({ theme }) => theme.colors.diSerria};
  `,
  'Under review': css`
    background-color: ${({ theme }) => theme.colors.jungleGreen};
  `,
  Resolved: css`
    background-color: ${({ theme }) => theme.colors.green2};
  `,
  Overdue: css`
    background-color: ${({ theme }) => theme.colors.crail};
    color: ${({ theme }) => theme.colors.crail};
  `,
};

export const Status = styled('div', statusProps)`
  position: relative;
  padding: 8px 8px 8px 24px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.abbey};
  border: 1px solid ${({ theme }) => theme.colors.ghost};
  background-color: ${({ theme }) => theme.background.wildSand};

  &:before {
    content: '';
    position: absolute;
    top: 12px;
    left: 8px;
    width: 8px;
    height: 8px;
    border-radius: 10px;
    ${({ variant }) => statusVariant[variant]}
  }
`;

export const CAPFiles = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const CAPFile = styled.div`
  &:first-child {
    padding-top: 16px;
    border-top: 1px solid ${({ theme }) => theme.colors.surfCrest};
  }
`;

export const ResolvedAction = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const Label = styled.div`
  font-size: 14px;
  line-height: 15px;
  font-weight: 600;
  padding: 0 4px;
  color: ${({ theme }) => theme.colors.highland};
`;

export const Text = styled.div`
  width: 100%;
  min-height: 66px;
  font-size: 14px;
  line-height: 20px;
  font-weight: 400;
  padding: 8px 12px;
  border-radius: 4px;
  box-sizing: border-box;
  background-color: ${({ theme }) => theme.background.athensGray2};
  border: 1px solid ${({ theme }) => theme.colors.spunPearl};
  color: ${({ theme }) => theme.colors.stormGray};
`;

export const File = styled.div`
  display: flex;
  cursor: pointer;
  gap: 4px;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  padding: 8px 12px;
  border-radius: 4px;
  color: ${({ theme }) => theme.colors.highland};
  border: 1px solid ${({ theme }) => theme.colors.highland};
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
