import { Vue, Component, Prop } from 'vue-property-decorator';
import { get } from 'lodash';
import AppModule from 'store/modules/app';
import auth from 'store/modules/auth';
import Accordion from 'components/Accordion';
import RiskLabel from 'components/RiskLabel';
import { formatDate } from 'utils/date';
import { LevelRiskCategoryEnum } from 'enums/saq';
import { getCategoryName } from 'utils/translation';
import { DATE_TIME_FORMAT } from 'config/constants';
import { RiskPreviewTypeEnum, SubIndicatorRiskEnum } from 'enums/brand';
import * as Styled from './styled';

@Component
export default class SubIndicatorAccordion extends Vue {
  @Prop({ required: true })
  readonly value: Auth.SubIndicatorRiskData;
  @Prop({ required: true }) previewType: RiskPreviewTypeEnum;
  @Prop({
    default: () => {
      // TODO
    },
  })
  assignCAP: () => void;
  @Prop({
    default: () => {
      // TODO
    },
  })
  viewCAP: (capId: string) => void;

  private showReport = false;

  get currentLocale(): string {
    return AppModule.locale;
  }

  get isExpanded(): boolean {
    return [RiskPreviewTypeEnum.PDF, RiskPreviewTypeEnum.ACTION_PLAN].includes(
      this.previewType,
    );
  }

  created() {
    this.showReport = this.value.showReport;
  }

  toggle() {
    this.showReport = !this.showReport;
  }

  renderRiskItem(): JSX.Element {
    const showAssignCAP = !this.isExpanded && auth.hasAssignCAP;
    return (
      <Styled.RiskItem isExpanded={this.isExpanded}>
        <RiskLabel level={get(this.value, 'risk.level', '')} hasDot />
        <Styled.RiskLabel isExpanded={this.isExpanded}>
          {getCategoryName(
            get(this.value, 'subIndicator.name', ''),
            get(this.value, 'subIndicator.translation'),
          )}
        </Styled.RiskLabel>
        <Styled.RiskItemActions>
          {showAssignCAP && (
            <Styled.AssignCAP
              vOn:click={(event: Event) => {
                event.stopPropagation();
                this.assignCAP();
              }}
            >
              {this.$t('assign_cap')}
            </Styled.AssignCAP>
          )}
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
    const source = get(content, 'source', '');
    const isCAP = source === SubIndicatorRiskEnum.CAP;
    const showViewDetail = isCAP && auth.hasViewCAP;
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
            {showViewDetail && (
              <Styled.ViewDetail
                vOn:click={() => {
                  this.viewCAP(content.capId);
                }}
              >
                {this.$t('view_details')}
              </Styled.ViewDetail>
            )}
          </Styled.RickTitle>
          {content.isIndirect && <Styled.Tag>{this.$t('indirect')}</Styled.Tag>}
        </Styled.RickItem>
      </Styled.SubIndicator>
    );
  }

  render(): JSX.Element {
    return (
      <Styled.Group>
        <Accordion show={this.showReport} maxHeight="100%" toggle={this.toggle}>
          <Styled.SubIndicator slot="title">
            {this.renderRiskItem()}
          </Styled.SubIndicator>
          <Styled.Content slot="content">
            <perfect-scrollbar>
              <Styled.SubIndicator>
                {this.value.data.map((content, index) =>
                  this.renderContent(content, index),
                )}
              </Styled.SubIndicator>
            </perfect-scrollbar>
          </Styled.Content>
        </Accordion>
      </Styled.Group>
    );
  }
}
