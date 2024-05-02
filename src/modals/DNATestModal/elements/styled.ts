import styled from 'vue-styled-components';

export const Title = styled.div`
  font-weight: 600;
  font-size: 16px;
  text-align: center;
  color: ${({ theme }) => theme.colors.stormGray};
`;

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-top: 10px;
  margin: 10px 30px 16px;
  border-top: 1px solid ${({ theme }) => theme.colors.cornflowerBlue};
`;

export const InputGroup = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 14px;
  gap: 14px;

  @media (max-width: 767px) {
    grid-template-columns: 1fr;
  }
`;

export const DNAListWrapper = styled.div`
  max-width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.background.wildSand};
`;

export const DNAList = styled.div`
  display: flex;
  padding: 16px;
  border-radius: 8px;
  color: ${({ theme }) => theme.colors.highland};
  background-color: ${({ theme }) => theme.background.white};

  .usdol-icon {
    cursor: pointer;
  }
`;

export const Name = styled.div`
  font-size: 14px;
  font-weight: 400;
  flex: 1;
  word-break: break-word;
`;

export const Action = styled.div`
  display: flex;
  justify-content: end;
`;
