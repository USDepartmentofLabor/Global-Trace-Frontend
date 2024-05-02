import styled from 'vue-styled-components';

export const Wrapper = styled.div`
  padding: 30px;
`;

export const ModalContent = styled.div`
  margin-top: 30px;
`;

export const Message = styled.div`
  font-size: 14px;
  font-weight: 600;
  line-height: 17px;
  text-align: left;
  color: ${({ theme }) => theme.colors.stormGray};
  margin-bottom: 7px;
`;

export const ModalFooter = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 30px;
  gap: 20px;

  & > div {
    width: 100%;
  }
`;

export const Icon = styled.div`
  display: flex;
  justify-content: center;
`;

export const Note = styled.div`
  display: flex;
  gap: 7px;
  font-size: 12px;
  line-height: 15px;
`;

export const NoteLabel = styled.div`
  color: ${({ theme }) => theme.colors.envy};
  font-weight: 600;
`;

export const NoteMessage = styled.div`
  color: ${({ theme }) => theme.colors.stormGray};
  font-weight: 400;
`;
