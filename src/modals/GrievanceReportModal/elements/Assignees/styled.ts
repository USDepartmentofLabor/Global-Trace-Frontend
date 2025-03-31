import styled from 'vue-styled-components';

const valueProps = {
  isBlur: Boolean,
};

export const Assignee = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 4px;
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 4px 12px;
`;

export const Label = styled.span`
  font-weight: 600;
  font-size: 14px;
  line-height: 18px;
  margin-top: 2px;
  color: ${(props) => props.theme.colors.highland};
`;

export const Value = styled('span', valueProps)`
  font-weight: 400;
  font-size: 14px;
  line-height: 18px;
  max-width: 300px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  color: ${(props) =>
    props.isBlur ? props.theme.colors.spunPearl : props.theme.colors.stormGray};
`;

export const Role = styled.span`
  color: ${(props) => props.theme.colors.spunPearl};
  font-weight: 700;
  font-size: 8px;
  line-height: 10px;
`;
