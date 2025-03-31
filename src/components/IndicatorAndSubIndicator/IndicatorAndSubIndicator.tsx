import { Vue, Component, Prop } from 'vue-property-decorator';
import { get, isNull } from 'lodash';
import classNames from 'classnames';
import AppModule from 'store/modules/app';
import { LevelRiskCategoryEnum } from 'enums/saq';
import RiskLabel from 'components/RiskLabel';
import { formatDate } from 'utils/date';
import { getCategoryName } from 'utils/translation';
import { DATE_TIME_FORMAT } from 'config/constants';
import { RiskPreviewTypeEnum, SubIndicatorRiskEnum } from 'enums/brand';
import IndicatorAccordion from './IndicatorAccordion';
import * as Styled from './styled';

@Component
export default class IndicatorAndSubIndicator extends Vue {
  @Prop({ required: true })
  readonly indicatorRiskData: Auth.IndicatorRiskData[];
  @Prop({ required: true }) previewType: RiskPreviewTypeEnum;
  @Prop({
    default: () => {
      // TODO
    },
  })
  assignCAP: (indicatorIndex: number, subIndicatorIndex: number) => void;
  @Prop({
    default: () => {
      // TODO
    },
  })
  viewCAP: (indicatorId: string, subIndicatorId: string, capId: string) => void;

  get currentLocale(): string {
    return AppModule.locale;
  }

  get isExpanded(): boolean {
    return [RiskPreviewTypeEnum.PDF, RiskPreviewTypeEnum.ACTION_PLAN].includes(
      this.previewType,
    );
  }

  renderRiskItem(
    item: Auth.IndicatorRiskData | Auth.SubIndicatorRiskData,
    subIndicatorIndex: number,
  ): JSX.Element {
    const isIndicator = isNull(subIndicatorIndex);
    return (
      <Styled.RiskItem
        hasBorder={isIndicator}
        isExpanded={this.isExpanded}
        class={classNames('', {
          background: isIndicator,
        })}
      >
        <RiskLabel level={get(item, 'risk.level', '')} hasDot />
        <Styled.RiskLabel isBold={isIndicator} isExpanded={this.isExpanded}>
          {isIndicator
            ? getCategoryName(
                get(item, 'indicator.name', ''),
                get(item, 'indicator.translation'),
              )
            : getCategoryName(
                get(item, 'subIndicator.name', ''),
                get(item, 'subIndicator.translation'),
              )}
        </Styled.RiskLabel>
        <Styled.RiskItemActions>
          {!this.isExpanded && (
            <Styled.Arrow class="arrow">
              <font-icon name="chevron_right" color="black" size="20" />
            </Styled.Arrow>
          )}
        </Styled.RiskItemActions>
      </Styled.RiskItem>
    );
  }

  renderSubIndicatorRisk(
    content: Auth.SubIndicatorData,
    index: number,
  ): JSX.Element {
    const source = get(content, 'source', '');
    const isCAP = source === SubIndicatorRiskEnum.CAP;
    const isNoWeight =
      get(content, 'risk.level', '') === LevelRiskCategoryEnum.NO_WEIGHT;
    const showCap = isCAP && isNoWeight;
    return (
      <Styled.SubIndicator key={index} isExpanded={this.isExpanded}>
        <Styled.RickItem isExpanded={this.isExpanded}>
          <Styled.RickDate>
            {formatDate(
              get(content, 'createdAt', '') as number,
              DATE_TIME_FORMAT,
            )}
          </Styled.RickDate>
          <Styled.Risk>
            {showCap && <Styled.CAPTag>{source}</Styled.CAPTag>}
            {!showCap && (
              <RiskLabel
                width="130px"
                level={get(content, 'risk.level', '')}
                text={get(content, 'source', '')}
              />
            )}
          </Styled.Risk>
          <Styled.RickTitle>
            <Styled.ReportContent
              domProps={{
                innerHTML: get(content, 'note', ''),
              }}
            />
          </Styled.RickTitle>
          {content.isIndirect && <Styled.Tag>{this.$t('indirect')}</Styled.Tag>}
        </Styled.RickItem>
      </Styled.SubIndicator>
    );
  }

  renderSupplierDetail(): JSX.Element {
    return (
      <fragment>
        {this.indicatorRiskData.map((item, indicatorIndex) => (
          <IndicatorAccordion
            value={item}
            previewType={this.previewType}
            viewCAP={(subIndicatorId: string, capId: string) => {
              this.viewCAP(item.indicator.id, subIndicatorId, capId);
            }}
            assignCAP={(subIndicatorIndex: number) => {
              this.assignCAP(indicatorIndex, subIndicatorIndex);
            }}
          />
        ))}
      </fragment>
    );
  }

  renderPdf(): JSX.Element {
    return (
      <fragment>
        {this.indicatorRiskData.map((item, indicatorIndex) => (
          <Styled.IndicatorGroup key={indicatorIndex}>
            <Styled.IndicatorTitle>
              {this.renderRiskItem(item, null)}
            </Styled.IndicatorTitle>
            {item.subIndicatorRiskData.map(
              (subIndicator, subIndicatorIndex) => (
                <Styled.SubIndicatorGroup key={subIndicatorIndex}>
                  <Styled.SubIndicator isExpanded={this.isExpanded}>
                    {this.renderRiskItem(subIndicator, subIndicatorIndex)}
                  </Styled.SubIndicator>
                  {subIndicator.data.map((content, index) =>
                    this.renderSubIndicatorRisk(content, index),
                  )}
                </Styled.SubIndicatorGroup>
              ),
            )}
          </Styled.IndicatorGroup>
        ))}
      </fragment>
    );
  }

  renderActionPlan(): JSX.Element {
    return (
      <fragment>
        {this.indicatorRiskData.map((item, indicatorIndex) => (
          <Styled.IndicatorGroup key={indicatorIndex}>
            <Styled.IndicatorTitle>
              {this.renderRiskItem(item, null)}
            </Styled.IndicatorTitle>
            {item.subIndicatorRiskData.map(
              (subIndicator, subIndicatorIndex) => (
                <Styled.SubIndicatorGroup key={subIndicatorIndex}>
                  <Styled.SubIndicator isExpanded={this.isExpanded}>
                    {this.renderRiskItem(subIndicator, subIndicatorIndex)}
                  </Styled.SubIndicator>
                  <Styled.SubIndicator>
                    {subIndicator.data.map((content, index) =>
                      this.renderSubIndicatorRisk(content, index),
                    )}
                  </Styled.SubIndicator>
                </Styled.SubIndicatorGroup>
              ),
            )}
          </Styled.IndicatorGroup>
        ))}
      </fragment>
    );
  }

  render(): JSX.Element {
    return (
      <Styled.IndicatorList isExpanded={this.isExpanded}>
        {this.previewType === RiskPreviewTypeEnum.PDF && this.renderPdf()}
        {this.previewType === RiskPreviewTypeEnum.ACTION_PLAN &&
          this.renderActionPlan()}
        {this.previewType === RiskPreviewTypeEnum.SUPPLIER_DETAIL &&
          this.renderSupplierDetail()}
      </Styled.IndicatorList>
    );
  }
}
