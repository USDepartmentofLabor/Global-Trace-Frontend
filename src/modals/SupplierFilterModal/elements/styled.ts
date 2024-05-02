import styled from 'vue-styled-components';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const CheckboxGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const IndicatorList = styled.div`
  display: flex;
  flex-direction: column;
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

export const SelectAll = styled.div`
  padding: 12px 12px 0;
`;
