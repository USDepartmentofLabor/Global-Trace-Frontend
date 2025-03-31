import { Vue, Component, Prop } from 'vue-property-decorator';
import { get, map } from 'lodash';
import { CapStatusEnum } from 'enums/brand';
import * as Styled from './styled';
import Indicators from '../Indicators';

const ActionPlanModal = () => import('modals/ActionPlanModal');

@Component
export default class TabInformation extends Vue {
  @Prop({ default: '' }) private currentIndicatorId: string;
  @Prop({ default: '' }) private currentSubIndicatorId: string;
  @Prop({ default: null }) private topIssue: Auth.TopIssue;
  @Prop({ required: true })
  readonly facility: Auth.Facility;
  @Prop({ required: true })
  readonly indicatorRiskData: Auth.IndicatorRiskData[];
  @Prop({
    default: () => {
      // TODO
    },
  })
  setCurrentRisk: (indicatorId: string, subIndicatorId: string) => void;
  @Prop({
    default: () => {
      // TODO
    },
  })
  addedCAP: (reload: boolean) => void;

  get expandedIndicatorIds(): string[] {
    return [this.currentIndicatorId, get(this.topIssue, 'indicator.id')];
  }

  get expandedSubIndicatorIds(): string[] {
    return [this.currentSubIndicatorId, get(this.topIssue, 'subIndicator.id')];
  }

  get indicatorRiskDisplay(): Auth.IndicatorRiskData[] {
    return map(this.indicatorRiskData, (item) => {
      item.showSubIndicator = this.currentIndicatorId === item.indicator.id;
      item.subIndicatorRiskData = item.subIndicatorRiskData.map(
        (subIndicator) => {
          subIndicator.showReport =
            this.currentSubIndicatorId === subIndicator.subIndicator.id;
          return subIndicator;
        },
      );
      return item;
    });
  }

  assignCAP(indicatorIndex: number, subIndicatorIndex: number): void {
    const indicatorRiskData: Auth.IndicatorRiskData = {
      indicator: this.indicatorRiskData[indicatorIndex].indicator,
      risk: this.indicatorRiskData[indicatorIndex].risk,
      subIndicatorRiskData: [
        this.indicatorRiskData[indicatorIndex].subIndicatorRiskData[
          subIndicatorIndex
        ],
      ],
    };
    this.setCurrentRisk(
      this.indicatorRiskData[indicatorIndex].indicator.id,
      this.indicatorRiskData[indicatorIndex].subIndicatorRiskData[
        subIndicatorIndex
      ].subIndicator.id,
    );
    this.$modal.show(
      ActionPlanModal,
      {
        facility: this.facility,
        indicatorRiskData: [indicatorRiskData],
        onSuccess: () => {
          this.addedCAP(false);
        },
      },
      {
        width: '729px',
        height: 'auto',
        clickToClose: false,
        scrollable: true,
        adaptive: true,
      },
    );
  }

  viewCAP(indicatorId: string, subIndicatorId: string, capId: string): void {
    this.setCurrentRisk(indicatorId, subIndicatorId);
    this.$modal.show(
      ActionPlanModal,
      {
        capId,
        facility: this.facility,
        indicatorRiskData: [],
        onSuccess: (status: CapStatusEnum) => {
          const reload = status === CapStatusEnum.RESOLVED;
          this.addedCAP(reload);
        },
      },
      {
        width: '729px',
        height: 'auto',
        clickToClose: false,
        scrollable: true,
        adaptive: true,
      },
    );
  }

  render(): JSX.Element {
    return (
      <Styled.Wrapper>
        <Indicators
          indicatorRiskData={this.indicatorRiskDisplay}
          facilityId={get(this.facility, 'id')}
          assignCAP={this.assignCAP}
          viewCAP={this.viewCAP}
        />
      </Styled.Wrapper>
    );
  }
}
