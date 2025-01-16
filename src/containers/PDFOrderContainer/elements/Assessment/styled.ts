/* eslint-disable max-lines */
import styled, { css } from 'vue-styled-components';
import { LevelRiskCategoryEnum } from 'enums/saq';
import { getRiskColor } from 'utils/risk-assessment';

const colProps = {
  width: Number,
  borderTop: Boolean,
  isRow: Boolean,
  padding: Boolean,
  background: Boolean,
};

const rowProps = {
  isColumn: Boolean,
  borderTop: Boolean,
  borderLeft: Boolean,
  padding: Boolean,
  gap: String,
  isSpaceBetween: Boolean,
};

const labelProps = {
  bold: Boolean,
};

const contentProps = {
  bold: Boolean,
};

const levelProps = {
  level: String,
};

const rickProp = {
  level: String,
};

const levelStyles = {
  [LevelRiskCategoryEnum.EXTREME]: css`
    background-color: ${({ theme }) =>
      theme.colors[getRiskColor(LevelRiskCategoryEnum.EXTREME)]};
  `,
  [LevelRiskCategoryEnum.HIGH]: css`
    background-color: ${({ theme }) =>
      theme.colors[getRiskColor(LevelRiskCategoryEnum.HIGH)]};
  `,
  [LevelRiskCategoryEnum.MEDIUM]: css`
    background-color: ${({ theme }) =>
      theme.colors[getRiskColor(LevelRiskCategoryEnum.MEDIUM)]};
  `,
  [LevelRiskCategoryEnum.LOW]: css`
    background-color: ${({ theme }) =>
      theme.colors[getRiskColor(LevelRiskCategoryEnum.LOW)]};
  `,
};

export const Wrapper = styled.div`
  padding: 20px;
  position: relative;

  table {
    border: 1px solid ${({ theme }) => theme.colors.ghost};
    border-collapse: collapse;

    thead {
      color: ${({ theme }) => theme.colors.black};
      border-bottom: 1px solid ${({ theme }) => theme.colors.ghost};
    }
  }

  @media print {
    break-inside: avoid;
  }
`;

export const TableWrapper = styled.div`
  margin-top: 20px;

  table {
    border: 1px solid ${({ theme }) => theme.colors.ghost};
    border-collapse: collapse;

    thead {
      border-bottom: 1px solid ${({ theme }) => theme.colors.ghost};

      span {
        color: ${({ theme }) => theme.colors.black};
      }
    }
  }
`;

export const MapContainer = styled.div`
  @media print {
    break-inside: avoid;
  }
`;

export const Text = styled.div`
  font-weight: 400;
  font-size: 14px;
  line-height: 18px;
  margin-bottom: 8px;
  padding-top: 30px;
  color: ${({ theme }) => theme.colors.black};
`;

export const Tr = styled.tr`
  @media print {
    break-inside: avoid;
  }
`;

export const Td = styled.td``;

export const Name = styled.label`
  color: ${({ theme }) => theme.colors.stormGray};
  font-weight: 600;
  font-size: 10px;
`;

export const Information = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

export const Detail = styled.span`
  font-weight: 400;
  font-size: 12px;
  word-break: break-all;
  color: ${({ theme }) => theme.colors.stormGray};
`;

export const Value = styled.span`
  color: ${({ theme }) => theme.colors.highland};
`;

export const Notice = styled.label`
  font-weight: 400;
  font-size: 10px;
  color: ${({ theme }) => theme.colors.stormGray};
`;

export const Title = styled.div`
  font-weight: 600;
  font-size: 20px;
  line-height: 25px;
  margin-bottom: 12px;
  color: ${({ theme }) => theme.colors.stormGray};
`;

export const AssessmentInformation = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.ghost};
  display: flex;
  flex-direction: column;
  margin-top: 30px;

  @media print {
    break-inside: avoid;
  }
`;

export const AssessmentContent = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export const Col = styled('div', colProps)`
  width: ${({ width }) => (width ? `${width}px` : '100%')};
  box-sizing: border-box;
  display: flex;
  flex-direction: ${({ isRow }) => (isRow ? 'row' : 'column')};
  background-color: ${({ background, theme }) =>
    background ? theme.background.hintOfGreen : 'transparent'};
  justify-content: space-between;
  gap: 4px;
  padding: ${({ padding }) => (padding ? '8px' : 0)};
  border-top: 1px solid;
  border-top-color: ${({ borderTop, theme }) =>
    borderTop ? theme.colors.ghost : 'transparent'};
`;

export const Row = styled('div', rowProps)`
  flex: 1;
  display: flex;
  flex-direction: ${({ isColumn }) => (isColumn ? 'column' : 'row')};
  justify-content: ${({ isSpaceBetween }) =>
    isSpaceBetween ? 'space-between' : 'inherit'};
  gap: ${({ gap }) => (gap ? gap : 0)};
  padding: ${({ padding }) => (padding ? '8px' : 0)};
  border-top: 1px solid
    ${({ borderTop, theme }) =>
      borderTop ? theme.colors.ghost : 'transparent'};
  border-left: 1px solid
    ${({ borderLeft, theme }) =>
      borderLeft ? theme.colors.ghost : 'transparent'};
`;

export const Label = styled('span', labelProps)`
  font-weight: ${({ bold }) => (bold ? 600 : 400)};
  line-height: ${({ bold }) => (bold ? '18px' : '14px')};
  font-size: 11px;
  color: ${({ theme }) => theme.colors.stormGray};
`;

export const Content = styled('span', contentProps)`
  font-weight: ${({ bold }) => (bold ? 600 : 400)};
  font-size: 12px;
  text-align: right;
  color: ${({ theme }) => theme.colors.shark};
`;

export const DocumentPurpose = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
  margin-top: 12px;

  @media print {
    break-inside: avoid;
  }
`;

export const PurposeInformation = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding: 8px 12px;
  border-radius: 8px;
  background: ${({ theme }) => theme.background.wildSand};
`;

export const Heading = styled.span`
  font-weight: 600;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.highland};
  text-transform: uppercase;
`;

export const PurposeContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const PurposeText = styled.span`
  font-weight: 300;
  font-size: 11px;
  color: ${({ theme }) => theme.colors.black};
  line-height: 16px;
`;

export const PurposeBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 9px;
  padding: 16px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.surfCrest};
`;

export const Issues = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 12px;
`;

export const IssuesBody = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Issue = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  padding: 12px 8px;
  border-top: 1px solid ${({ theme }) => theme.colors.silver};
  font-weight: 600;
`;

export const Order = styled('div', levelProps)`
  width: 20px;
  height: 20px;
  border-radius: 100px;
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  color: ${({ theme }) => theme.colors.white};

  ${({ level }) => levelStyles[level]}
`;

export const IssueContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 4px 8px;
`;

export const Type = styled.span`
  font-size: 10px;
  color: ${({ theme }) => theme.colors.spunPearl};
`;

export const RiskLevelResponse = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const LevelWrapper = styled.span`
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: space-between;
`;

export const LevelFacility = styled.div`
  color: ${({ theme }) => theme.colors.stormGray};
  font-weight: 400;
  font-size: 14px;
`;

export const Group = styled.div`
  margin-top: 14px;
`;
