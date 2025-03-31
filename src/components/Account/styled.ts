import styled, { css } from 'vue-styled-components';

const wrapperProps = {
  hasBorder: Boolean,
};

const hasBorderCss = css`
  border: 1px solid ${({ theme }) => theme.colors.ghost};
`;

export const Wrapper = styled('div', wrapperProps)`
  padding: 20px 40px;
  background-color: ${({ theme }) => theme.background.white};
  display: flex;
  flex-direction: column;
  gap: 16px;
  ${({ hasBorder }) => hasBorder && hasBorderCss}
`;

export const Head = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
  padding-bottom: 16px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.ghost};
`;

export const Body = styled.div`
  display: flex;
  gap: 16px;
  flex-direction: column;
`;

export const Title = styled.div`
  font-size: 20px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.alizarinCrimson};
`;

export const Description = styled.div`
  font-size: 16px;
  font-weight: 400;
  color: ${({ theme }) => theme.colors.eastBay};
`;
