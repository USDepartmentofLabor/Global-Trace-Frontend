import styled, { css } from 'vue-styled-components';
import { LevelRiskCategoryEnum } from 'enums/saq';
import { getRiskColor } from 'utils/risk-assessment';

const wrapperProps = {
  direction: String,
};

export const Wrapper = styled('div', wrapperProps)`
  display: flex;
  flex-direction: ${({ direction }) => direction};
  align-items: center;
  gap: 10px;
`;

const rickProps = {
  level: String,
  width: String,
  isUppercase: Boolean,
  hasDot: Boolean,
};

const riskStyles = {
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
  [LevelRiskCategoryEnum.NO_WEIGHT]: css`
    background-color: ${({ theme }) =>
      theme.colors[getRiskColor(LevelRiskCategoryEnum.NO_WEIGHT)]};
  `,
};

export const Dot = styled('div', rickProps)`
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  border-radius: 2px;
  ${({ level }) => riskStyles[level]}
`;

export const Level = styled('div', rickProps)`
  display: inline-block;
  border-radius: 4px;
  word-break: break-word;
  box-sizing: border-box;
  font-weight: ${({ hasDot }) => (hasDot ? 400 : 700)};
  font-size: 12px;
  text-align: center;
  padding: ${({ hasDot }) => (hasDot ? 'inherit' : '5px 20px')};
  text-transform: ${({ isUppercase }) =>
    isUppercase ? 'uppercase' : 'inherit'};
  color: ${({ hasDot, theme }) =>
    hasDot ? theme.colors.shark : theme.colors.white};
  width: ${({ width }) => width};
  ${({ hasDot, level }) => (!hasDot ? riskStyles[level] : '')}
`;
