import styled, { css } from 'vue-styled-components';
import { RESOURCES } from 'config/constants';
import resources from 'config/resources';
import { LevelRiskCategoryEnum } from 'enums/saq';
import { getRiskColor } from 'utils/risk-assessment';

export const Wrapper = styled.div`
  padding: 16px;
  background-color: ${({ theme }) => theme.background.white};
`;

export const RiskInformation = styled.div`
  display: flex;
  gap: 24px;

  @media (max-width: 992px) {
    flex-direction: column;
  }
`;

export const OverallRisk = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  border-radius: 8px;
  border: 2px solid ${({ theme }) => theme.colors.ghost};
  padding: 20px;
  gap: 8px;
`;

export const OverallRiskTitle = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.stormGray};
`;

export const OverallRiskName = styled.div`
  font-size: 20px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.shark};
`;

export const OverallRiskChartWrapper = styled.div`
  position: relative;
  width: 120px;
  height: 64px;
`;

export const OverallRiskChartDonut = styled.img.attrs({
  src: RESOURCES.RISK,
})`
  width: 100%;
`;

const stickProps = {
  variant: String,
};

const riskCss = {
  Extreme: css`
    left: 54px;
    bottom: 2px;
    transform: rotate(162deg);
  `,
  High: css`
    left: 42px;
    bottom: 12px;
    transform: rotate(113deg);
  `,
  Medium: css`
    left: 29px;
    bottom: 12px;
    transform: rotate(68deg);
  `,
  Low: css`
    left: 18px;
    bottom: 2px;
    transform: rotate(18deg);
  `,
  'No weight': css`
    left: 18px;
    bottom: -9px;
    transform: rotate(0deg);
  `,
};

export const OverallRiskStickContainer = styled('div', stickProps)`
  position: absolute;
  left: 50%;
  bottom: 0;

  ${({ variant }) => riskCss[variant]}
`;

export const OverallRiskStick = styled.img.attrs({
  src: RESOURCES.STICK,
})`
  width: 48px;
`;

export const Information = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px 32px;
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
  border-radius: 8px;
  border: 2px solid ${({ theme }) => theme.colors.ghost};
  background-color: ${({ theme }) => theme.background.wildSand};

  @media (max-width: 992px) {
    grid-template-columns: 1fr;
  }
`;

export const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const textProps = {
  isBig: Boolean,
  color: String,
};

export const InfoTitle = styled('div', textProps)`
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: ${({ isBig }) => (isBig ? '14px' : '12px')};
  font-weight: ${({ isBig }) => (isBig ? '600' : '400')};
  color: ${({ theme }) => theme.colors.stormGray};
`;

export const Icon = styled.div`
  width: 20px;
  flex-shrink: 0;
`;

export const CategoryInformation = styled.div`
  display: flex;
  gap: 24px;
  margin-top: 20px;

  @media (max-width: 992px) {
    flex-direction: column;
  }
`;

const cardProps = {
  width: String,
};

export const Card = styled('div', cardProps)`
  position: relative;
  display: flex;
  width: 100%;
  flex-direction: column;
  border-radius: 8px;
  overflow: hidden;
  border: 2px solid ${({ theme }) => theme.colors.ghost};

  @media (min-width: 992px) {
    width: ${({ width }) => width};
  }
`;

export const CardHead = styled.div`
  display: flex;
  min-height: 64px;
  box-sizing: border-box;
  gap: 16px;
  padding: 10px 16px;
  align-items: center;
  justify-content: space-between;
  background-color: ${({ theme }) => theme.background.wildSand};
`;

export const CardHeadColumn = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
`;

export const TopIssueIcon = styled.img.attrs({
  src: resources.TOP_ISSUES,
})`
  width: 51px;
  height: 44px;
`;

export const CardTitle = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.stormGray};
`;

export const CardBody = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  padding: 16px;

  @media (max-width: 992px) {
    grid-template-columns: 1fr;
  }
`;

const CardBoxProps = {
  variant: String,
};

const cardBoxVariant = {
  [LevelRiskCategoryEnum.EXTREME]: css`
    border-color: ${({ theme }) =>
      theme.colors[getRiskColor(LevelRiskCategoryEnum.EXTREME)]};
  `,
  [LevelRiskCategoryEnum.HIGH]: css`
    border-color: ${({ theme }) =>
      theme.colors[getRiskColor(LevelRiskCategoryEnum.HIGH)]};
  `,
  [LevelRiskCategoryEnum.MEDIUM]: css`
    border-color: ${({ theme }) =>
      theme.colors[getRiskColor(LevelRiskCategoryEnum.MEDIUM)]};
  `,
  [LevelRiskCategoryEnum.LOW]: css`
    border-color: ${({ theme }) =>
      theme.colors[getRiskColor(LevelRiskCategoryEnum.LOW)]};
  `,
  [LevelRiskCategoryEnum.NO_WEIGHT]: css`
    border-color: ${({ theme }) =>
      theme.colors[getRiskColor(LevelRiskCategoryEnum.NO_WEIGHT)]};
  `,
};

export const CardBox = styled('div', CardBoxProps)`
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.15);
  border-width: 2px;
  border-style: solid;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.3);
  }

  ${({ variant }) => cardBoxVariant[variant]}
`;

export const CardBoxBody = styled.div`
  display: flex;
  gap: 16px;
  padding: 16px;
  background-color: ${({ theme }) => theme.background.white};
`;

export const IndicatorName = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.shark};
`;

export const CardBoxInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const categoryIconProps = {
  size: String,
};

export const CategoryIcon = styled('img', categoryIconProps)`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
`;

export const SubIndicatorName = styled.div`
  font-size: 16px;
  font-weight: 400;
  color: ${({ theme }) => theme.colors.manatee};
`;

export const CardBoxFooter = styled.div`
  display: flex;
  align-items: center;
  padding: 12px 16px;
  gap: 8px;
  background-color: ${({ theme }) => theme.background.wildSand};
`;

export const CategoryName = styled.div`
  font-size: 16px;
  font-weight: 700;
  flex: 1;
  color: ${({ theme }) => theme.colors.stormGray};
`;

export const CardList = styled.div`
  display: flex;
  flex-direction: column;
  padding: 16px;
  gap: 16px;
`;

export const ExternalRiskIndicator = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
  border-radius: 4px;
  border: 1px solid ${({ theme }) => theme.colors.ghost};
`;

export const ExternalRiskIndicatorInfo = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;
export const ExternalRiskCategory = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 8px;
`;

export const ViewDetail = styled.div`
  white-space: nowrap;
  font-size: 14px;
  font-weight: 400;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.envy};
`;
