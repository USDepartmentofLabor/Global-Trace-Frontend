import styled from 'vue-styled-components';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Information = styled.div`
  margin-bottom: 8px;
  display: flex;
  flex-direction: column;
`;

export const Text = styled.span`
  font-weight: 600;
  font-size: 14px;
  line-height: 18px;
  text-align: center;
  color: ${({ theme }) => theme.colors.stormGray};
`;

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 460px;
  height: 460px;
  margin: auto;
  border-radius: 100%;
  box-sizing: border-box;
  border-width: 1px;
  border-style: solid;
  border: 1px solid ${({ theme }) => theme.colors.wildSand};
  background: ${({ theme }) => theme.background.white};
`;
