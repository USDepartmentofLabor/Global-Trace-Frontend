import { get, map } from 'lodash';
import { Vue, Component, Prop } from 'vue-property-decorator';
import { getCategoryName } from 'utils/translation';
import Accordion from 'components/Accordion';
import * as Styled from './styled';
import SubIndicator from './SubIndicator';

@Component
export default class Indicator extends Vue {
  @Prop({ required: true })
  readonly data: Auth.IndicatorRiskData;
  @Prop({ required: true })
  readonly facilityId: string;
  @Prop({ required: true })
  assignCAP: (subIndicatorIndex: number) => void;
  @Prop({
    default: () => {
      // TODO
    },
  })
  viewCAP: (subIndicatorId: string, capId: string) => void;

  private showSubIndicator = false;

  created() {
    this.showSubIndicator = this.data.showSubIndicator;
  }

  toggle() {
    this.showSubIndicator = !this.showSubIndicator;
  }

  renderTitle(): JSX.Element {
    const name = get(this.data, 'indicator.name', '');
    const translation = get(this.data, 'indicator.translation', '');
    return (
      <Styled.IndicatorTitle slot="title" isExpanded={this.showSubIndicator}>
        {getCategoryName(name, translation)}
        <Styled.IndicatorAction>
          <Styled.Arrow class="arrow">
            <font-icon name="chevron_right" color="black" size="20" />
          </Styled.Arrow>
        </Styled.IndicatorAction>
      </Styled.IndicatorTitle>
    );
  }

  renderContent(): JSX.Element {
    const riskLevel = get(this.data, ['risk', 'level']);
    return (
      <Styled.IndicatorContent slot="content" level={riskLevel}>
        {map(
          this.data.subIndicatorRiskData,
          (subIndicator, subIndicatorIndex) => (
            <SubIndicator
              subIndicator={subIndicator}
              facilityId={this.facilityId}
              assignCAP={() => this.assignCAP(subIndicatorIndex)}
              viewCAP={(capId: string) =>
                this.viewCAP(subIndicator.subIndicator.id, capId)
              }
            />
          ),
        )}
      </Styled.IndicatorContent>
    );
  }

  render(): JSX.Element {
    const id = get(this.data, ['indicator', 'id']);
    const riskLevel = get(this.data, ['risk', 'level']);
    return (
      <Styled.Indicator
        key={id}
        level={riskLevel}
        isExpanded={this.showSubIndicator}
      >
        <Styled.RiskLabel level={riskLevel} />
        <Accordion
          show={this.showSubIndicator}
          maxHeight="100%"
          className="indicator"
          toggle={this.toggle}
        >
          {this.renderTitle()}
          {this.renderContent()}
        </Accordion>
      </Styled.Indicator>
    );
  }
}
