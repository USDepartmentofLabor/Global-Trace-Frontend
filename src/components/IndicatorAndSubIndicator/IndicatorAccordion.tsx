import { Vue, Component, Prop } from 'vue-property-decorator';
import { get } from 'lodash';
import AppModule from 'store/modules/app';
import Accordion from 'components/Accordion';
import RiskLabel from 'components/RiskLabel';
import { formatDate } from 'utils/date';
import { getCategoryName } from 'utils/translation';
import { DATE_TIME_FORMAT } from 'config/constants';
import { RiskPreviewTypeEnum } from 'enums/brand';
import SubIndicatorAccordion from './SubIndicatorAccordion';
import * as Styled from './styled';

@Component
export default class IndicatorAccordion extends Vue {
  @Prop({ required: true })
  readonly value: Auth.IndicatorRiskData;
  @Prop({ required: true }) previewType: RiskPreviewTypeEnum;
  @Prop({
    default: () => {
      // TODO
    },
  })
  viewCAP: (subIndicatorId: string, capId: string) => void;
  @Prop({
    default: () => {
      // TODO
    },
  })
  assignCAP: (subIndicatorIndex: number) => void;

  private showSubIndicator = false;

  get currentLocale(): string {
    return AppModule.locale;
  }

  get isExpanded(): boolean {
    return [RiskPreviewTypeEnum.PDF, RiskPreviewTypeEnum.ACTION_PLAN].includes(
      this.previewType,
    );
  }

  created() {
    this.showSubIndicator = this.value.showSubIndicator;
  }

  toggle() {
    this.showSubIndicator = !this.showSubIndicator;
  }

  renderRiskItem(): JSX.Element {
    return (
      <Styled.RiskItem
        hasBorder
        isExpanded={this.isExpanded}
        class="background"
      >
        <RiskLabel level={get(this.value, 'risk.level', '')} hasDot />
        <Styled.RiskLabel isExpanded={this.isExpanded} isBold>
          {getCategoryName(
            get(this.value, 'indicator.name', ''),
            get(this.value, 'indicator.translation'),
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

  renderContent(content: Auth.SubIndicatorData, index: number): JSX.Element {
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
            <RiskLabel
              width="130px"
              level={get(content, 'risk.level', '')}
              text={get(content, 'source', '')}
            />
          </Styled.Risk>
          <Styled.RickTitle>{get(content, 'note', '')}</Styled.RickTitle>
          {content.isIndirect && <Styled.Tag>{this.$t('indirect')}</Styled.Tag>}
        </Styled.RickItem>
      </Styled.SubIndicator>
    );
  }

  render(): JSX.Element {
    return (
      <Accordion
        show={this.showSubIndicator}
        maxHeight="100%"
        toggle={this.toggle}
      >
        <fragment slot="title">{this.renderRiskItem()}</fragment>
        <fragment slot="content">
          {this.value.subIndicatorRiskData.map(
            (subIndicator, subIndicatorIndex) => (
              <SubIndicatorAccordion
                value={subIndicator}
                previewType={this.isExpanded}
                assignCAP={() => {
                  this.assignCAP(subIndicatorIndex);
                }}
                viewCAP={(capId: string) => {
                  this.viewCAP(subIndicator.subIndicator.id, capId);
                }}
              />
            ),
          )}
        </fragment>
      </Accordion>
    );
  }
}
