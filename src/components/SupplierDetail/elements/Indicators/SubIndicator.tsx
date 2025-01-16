import { Vue, Component, Prop } from 'vue-property-decorator';
import { every, filter, get, map } from 'lodash';
import auth from 'store/modules/auth';
import Accordion from 'components/Accordion';
import RiskLabel from 'components/RiskLabel';
import { CapStatusEnum, SubIndicatorRiskEnum } from 'enums/brand';
import { getUserFacility } from 'utils/user';
import { formatDate } from 'utils/date';
import { getCategoryName } from 'utils/translation';
import { DATE_TIME_FORMAT } from 'config/constants';
import * as Styled from './styled';

@Component
export default class SubIndicator extends Vue {
  @Prop({ required: true })
  readonly subIndicator: Auth.SubIndicatorRiskData;
  @Prop({ required: true })
  readonly facilityId: string;
  @Prop({ required: true })
  assignCAP: () => void;
  @Prop({
    default: () => {
      // TODO
    },
  })
  viewCAP: (capId: string) => void;

  private showReport = false;

  get showAssignCAP(): boolean {
    const userFacility = getUserFacility(auth.user);
    return auth.hasAssignCAP && get(userFacility, 'id') !== this.facilityId;
  }

  created() {
    this.showReport = this.subIndicator.showReport;
  }

  toggle() {
    this.showReport = !this.showReport;
  }

  handleAssignCAP(event: Event): void {
    event.stopPropagation();
    const capData = filter(
      this.subIndicator.data,
      ({ source }) => source === SubIndicatorRiskEnum.CAP,
    );
    const isResolvedAll = every(
      capData,
      ({ status }) => status === CapStatusEnum.RESOLVED,
    );
    if (isResolvedAll) {
      this.assignCAP();
    } else {
      this.$toast.error(this.$t('cap_assigned_not_completed'));
    }
  }

  renderAction(): JSX.Element {
    return (
      <Styled.RiskItemActions>
        {this.showAssignCAP && (
          <Styled.AssignCAP vOn:click={this.handleAssignCAP}>
            {this.$t('assign_cap')}
          </Styled.AssignCAP>
        )}
        <Styled.Arrow class="arrow">
          <font-icon name="chevron_right" color="black" size="20" />
        </Styled.Arrow>
      </Styled.RiskItemActions>
    );
  }

  renderContent(content: Auth.SubIndicatorData): JSX.Element {
    const source = get(content, 'source', '');
    const riskLevel = get(content, ['risk', 'level']);
    const isCAP = source === SubIndicatorRiskEnum.CAP;
    const showViewDetail = isCAP && auth.hasViewCAP;
    return (
      <Styled.RiskContent key={content.capId}>
        <Styled.RiskItem>
          {formatDate(
            get(content, 'createdAt', '') as number,
            DATE_TIME_FORMAT,
          )}
          <Styled.Tag level={riskLevel}>{source}</Styled.Tag>
          <Styled.ReportContent
            domProps={{
              innerHTML: get(content, 'note', ''),
            }}
          />
          {showViewDetail && (
            <Styled.ViewDetail vOn:click={() => this.viewCAP(content.capId)}>
              {this.$t('view_details')}
            </Styled.ViewDetail>
          )}
        </Styled.RiskItem>
      </Styled.RiskContent>
    );
  }

  render(): JSX.Element {
    const riskLevel = get(this.subIndicator, ['risk', 'level']);
    const name = get(this.subIndicator, 'subIndicator.name', '');
    const translation = get(this.subIndicator, 'subIndicator.translation', '');
    return (
      <Styled.SubIndicator>
        <Accordion
          show={this.showReport}
          maxHeight="100%"
          className="indicator"
          toggle={this.toggle}
        >
          <Styled.SubIndicatorTitle slot="title" isExpanded={this.showReport}>
            <RiskLabel
              level={get(this.subIndicator, ['risk', 'level'])}
              hasDot
            />
            <Styled.RiskTitle>
              {getCategoryName(name, translation)}
            </Styled.RiskTitle>
            {this.renderAction()}
          </Styled.SubIndicatorTitle>
          <Styled.SubIndicatorContent slot="content" level={riskLevel}>
            {map(this.subIndicator.data, this.renderContent)}
          </Styled.SubIndicatorContent>
        </Accordion>
      </Styled.SubIndicator>
    );
  }
}
