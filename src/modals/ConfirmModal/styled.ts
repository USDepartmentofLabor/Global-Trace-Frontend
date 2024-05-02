import styled from 'vue-styled-components';

const messageProps = {
  textAlign: String,
};

export const Wrapper = styled.div`
  padding: 30px;
`;

export const ModalContent = styled.div`
  margin-top: 30px;
`;

export const Message = styled('div', messageProps)`
  font-size: 14px;
  font-weight: 600;
  line-height: 17px;
  text-align: ${({ textAlign }) => textAlign};
  color: ${({ theme }) => theme.colors.stormGray};
  margin-bottom: 7px;

  @media (max-width: 767px) {
    text-align: left;
  }
`;

export const ModalFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 30px;
  gap: 20px;
`;

export const Icon = styled.div`
  display: flex;
  justify-content: center;
`;

export const Note = styled.span`
  gap: 7px;
  font-size: 12px;
  line-height: 15px;
`;

export const NoteLabel = styled.span`
  color: ${({ theme }) => theme.colors.envy};
  font-weight: 600;
`;

export const NoteMessage = styled.span`
  color: ${({ theme }) => theme.colors.stormGray};
  font-weight: 400;

  b {
    color: ${({ theme }) => theme.colors.envy};
    font-weight: 600;
  }
`;
