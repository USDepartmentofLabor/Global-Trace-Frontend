import styled from 'vue-styled-components';

const colorProps = {
  color: String,
};

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  ul li {
    list-style: square;
  }
`;

export const Row = styled.div`
  display: flex;
  gap: 10px;
`;

export const Col = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 6px;
  flex: 1;
`;

export const Legend = styled.span`
  font-weight: 700;
  font-size: 8px;
  line-height: 10px;
  color: ${({ theme }) => theme.colors.stormGray};
`;

export const Color = styled('div', colorProps)`
  width: 11px;
  height: 11px;
  background-color: ${({ color }) => color};
`;

export const ChartInfo = styled.ul`
  align-self: self-start;
  margin: 0;
  padding-left: 15px;
  color: ${({ theme }) => theme.colors.envy};
`;

export const Label = styled.li`
  margin-left: 0;
  margin-top: 10px;
  font-weight: 400;
  font-size: 10px;
  line-height: 13px;
`;
