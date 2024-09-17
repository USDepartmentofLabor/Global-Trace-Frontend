import styled from 'vue-styled-components';

export const Row = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 4px;

  .v-popover > div {
    width: 100%;
  }
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
  margin-bottom: 12px;
  padding: 8px 10px;
  font-weight: 700;
  font-size: 14px;
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

export const Raw = styled.div`
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 8px;
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

export const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;

  .ps {
    max-height: calc(100svh - 450px);
    margin-bottom: 8px;
  }
`;

export const AttributeWrapper = styled.div`
  padding: 4px 0;
  .ps {
    max-height: calc(100svh - 320px);
  }
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Head = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const AddAttribute = styled.div`
  display: flex;
  gap: 4px;
  font-size: 16px;
  color: ${({ theme }) => theme.colors.highland};
  font-weight: 400;
  line-height: 20px;
  cursor: pointer;
`;

export const AttributeGroup = styled.div`
  min-height: 200px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px 0;
  background: ${({ theme }) => theme.background.wildSand};
`;

export const GroupTitle = styled.div`
  color: ${({ theme }) => theme.colors.stormGray};
  font-size: 14px;
  font-weight: 600;
  line-height: 18px;
  text-indent: 8px;
`;

export const AttributeGroupWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 0 20px;
`;

export const AttributeHead = styled.div`
  font-size: 12px;
  font-weight: 400;
  color: ${({ theme }) => theme.colors.spunPearl};

  &:first-child {
    width: 282px;
  }
`;

export const AttributeGroupContent = styled.div`
  border-radius: 8px;
  background-color: ${({ theme }) => theme.background.white};
`;

export const BoxHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 10px;

  .usdol-icon {
    cursor: pointer;
  }
`;

const visibleActionProps = {
  visibility: String,
};

export const VisibleAction = styled('div', visibleActionProps)`
  visibility: ${({ visibility }) => visibility};
`;

export const Name = styled.div`
  width: 50%;
  font-weight: 400;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.abbey};
`;

export const Type = styled.div`
  width: 40%;
  font-weight: 400;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.abbey};
`;

export const Checkbox = styled.div`
  padding: 16px 0;
`;

export const Box = styled.div`
  display: flex;
  flex-direction: column;
  border-bottom: 1px solid ${({ theme }) => theme.colors.ghost};

  &:last-child {
    border-bottom: 0;
  }
`;

export const AttributeHeader = styled.div`
  display: flex;
  gap: 16px;
  padding: 16px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.ghost};
`;
