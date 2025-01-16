import styled from 'vue-styled-components';

export const Wrapper = styled.div`
  position: relative;
  margin-top: 27px;
  border: 1px solid ${({ theme }) => theme.colors.stormGray};
`;

export const Header = styled.div`
  display: flex;
  gap: 8px;
  padding: 8px 10px;
  background-color: ${({ theme }) => theme.background.hintOfGreen};
  border-bottom: 1px solid ${({ theme }) => theme.colors.stormGray};
`;

export const Label = styled.div`
  flex: 1;
  font-weight: 600;
  font-size: 14px;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.stormGray};
`;

export const Empty = styled.div`
  display: flex;
  flex-direction: column;
  padding: 8px 0;
  gap: 4px;
  align-items: center;
  font-size: 14px;
  font-weight: 400;
`;
