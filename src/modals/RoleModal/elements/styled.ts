import styled from 'vue-styled-components';

export const Info = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding-right: 20px;
`;

export const Row = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const CheckboxGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const PermissionList = styled.div`
  display: flex;
  flex-direction: column;
`;

export const PermissionTitle = styled.div`
  text-align: center;
  margin-bottom: 12px;
  font-weight: 700;
  font-size: 18px;
  color: ${({ theme }) => theme.colors.stormGray};
`;

export const PermissionContent = styled.div`
  padding-left: 12px;
  padding-bottom: 16px;
`;

export const CheckboxWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  padding: 12px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.ghost};
`;

export const CheckboxGroupWrapper = styled.div`
  padding: 12px;
  margin-left: 36px;
`;

const ExpandIconProps = {
  isOpen: Boolean,
};

export const ExpandIcon = styled('div', ExpandIconProps)`
  padding: 4px;
  display: inline-block;
  transform: ${({ isOpen }) => (isOpen ? 'rotate(177deg)' : 'inherit')};
`;

export const Label = styled.div`
  display: flex;
  padding: 12px 0;
  margin-top: 12px;
  font-size: 14px;
  font-weight: 400;
  color: ${({ theme }) => theme.colors.abbey};
`;

export const SeasonWrapper = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 32px;
`;
