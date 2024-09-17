import styled from 'vue-styled-components';

const rowProps = {
  disabled: Boolean,
};

export const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 27px 40px;

  table {
    thead {
      background-color: ${({ theme }) => theme.background.wildSand};
    }
  }

  @media (max-width: 920px) {
    padding: 14px;
  }
`;

export const HeaderAction = styled.div`
  display: flex;

  @media (max-width: 920px) {
    width: 100%;
    justify-content: flex-end;
  }
`;

export const EmptyData = styled.div`
  min-height: 180px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const Tr = styled('tr', rowProps)`
  td {
    color: ${(props) =>
      props.disabled ? props.theme.colors.abbey : props.theme.colors.spunPearl};
  }
`;

export const Td = styled.td`
  border-top: 1px solid ${({ theme }) => theme.colors.snuff};
  background: transparent;
  line-height: 22px;
`;

export const Email = styled.p`
  max-width: 120px;
  display: inline-block;
  text-overflow: ellipsis;
  overflow: hidden;
`;

export const RowActions = styled.div`
  display: flex;
  border-left: 1px solid ${({ theme }) => theme.colors.ghost};
  justify-content: end;
  padding: 0 10px;
  width: 350px;

  button span:not(.usdol-icon) {
    text-decoration: underline;
  }

  & > div {
    width: 33.3334%;
    box-sizing: border-box;
  }
`;

export const ResendInvitation = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 0 16px;
  &:hover {
    color: ${({ theme }) => theme.colors.envy};
    background-color: ${({ theme }) => theme.background.wildSand};
    border-radius: 8px;
  }
`;

export const InviteText = styled.p`
  font-size: 12px;
  line-height: 16px;
  margin: 0;
  margin-left: 4px;
  text-decoration: underline;
  color: ${({ theme }) => theme.colors.abbey};
`;

export const Label = styled.span`
  display: flex;
  flex: 1 1 auto;
  font-weight: 500;
  font-size: 14px;
  line-height: 16px;
  padding: 6px 8px;
  word-break: break-word;

  color: ${({ theme }) => theme.colors.stormGray};

  &:hover {
    border-radius: 8px;

    background-color: ${({ theme }) => theme.background.envy};
    color: ${({ theme }) => theme.colors.white};
  }
`;

export const Cell = styled.div`
  word-break: break-word;
`;
