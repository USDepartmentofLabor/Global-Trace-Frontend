import styled, { css } from 'vue-styled-components';

const colProps = {
  width: Number,
  borderTop: Boolean,
};

const levelProps = {
  level: String,
};

const rickProp = {
  level: String,
};

const levelStyles = {
  Extreme: css`
    background: ${({ theme }) => theme.colors.persimmon};
  `,
  High: css`
    background: ${({ theme }) => theme.colors.red};
  `,
  Medium: css`
    background: ${({ theme }) => theme.background.sandyBrown};
  `,
  Low: css`
    background: ${({ theme }) => theme.background.highland};
  `,
};

const riskStyles = {
  Extreme: css`
    color: ${({ theme }) => theme.colors.persimmon};
  `,
  High: css`
    color: ${({ theme }) => theme.colors.red};
  `,
  Medium: css`
    color: ${({ theme }) => theme.colors.sandyBrown};
  `,
  Low: css`
    color: ${({ theme }) => theme.colors.highland};
  `,
  'No weight': css`
    color: ${({ theme }) => theme.colors.alto};
  `,
};

const scoreStyles = {
  Extreme: css`
    background-color: ${({ theme }) => theme.colors.persimmon};
    width: 100%;
  `,
  High: css`
    background-color: ${({ theme }) => theme.colors.red};
    width: 75%;
  `,
  Medium: css`
    background-color: ${({ theme }) => theme.colors.sandyBrown};
    width: 50%;
  `,
  Low: css`
    background-color: ${({ theme }) => theme.colors.highland};
    width: 25%;
  `,
  'No weight': css`
    background-color: ${({ theme }) => theme.colors.alto};
    width: 0;
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
  width: 100%;
`;

export const Col = styled('div', colProps)`
  width: ${({ width }) => (width ? `${width}px` : '100%')};
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 4px 8px;
  border-top: 1px solid;
  border-top-color: ${({ borderTop, theme }) =>
    borderTop ? theme.colors.ghost : 'transparent'};
`;

export const Row = styled.div`
  flex: 1;
  display: flex;
  border-left: 1px solid ${({ theme }) => theme.colors.ghost};
`;

export const Label = styled.span`
  font-weight: 400;
  font-size: 11px;
  height: 14px;
  color: ${({ theme }) => theme.colors.stormGray};
`;

export const Content = styled.span`
  font-weight: 600;
  font-size: 12px;
  height: 14px;
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
`;

export const PurposeBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 9px;
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
  gap: 16px;
`;

export const LevelWrapper = styled.span`
  display: flex;
  gap: 8px;
  align-items: center;
`;

export const LevelTitle = styled('div', rickProp)`
  flex: 1;
  font-weight: 700;
  font-size: 16px;
  text-transform: uppercase;
  ${({ level }) => riskStyles[level]}
`;

export const Status = styled.div`
  flex: 2;
  position: relative;
  height: 8px;
  width: 100%;
  background: ${({ theme }) => theme.colors.stormGray};
`;

export const LevelScore = styled('div', rickProp)`
  height: 8px;
  ${({ level }) => scoreStyles[level]}
`;

export const LevelFacility = styled.div`
  flex: 1;
  color: ${({ theme }) => theme.colors.stormGray};
  font-weight: 400;
  font-size: 14px;
`;
