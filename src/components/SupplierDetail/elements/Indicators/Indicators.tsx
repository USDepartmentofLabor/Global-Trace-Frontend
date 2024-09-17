import { Vue, Component, Prop } from 'vue-property-decorator';
import { map } from 'lodash';
import Indicator from './Indicator';
import * as Styled from './styled';

@Component
export default class Indicators extends Vue {
  @Prop({ required: true })
  readonly indicatorRiskData: Auth.IndicatorRiskData[];
  @Prop({ required: true })
  readonly facilityId: string;
  @Prop({ required: true })
  assignCAP: (indicatorIndex: number, subIndicatorIndex: number) => void;
  @Prop({
    default: () => {
      // TODO
    },
  })
  viewCAP: (indicatorId: string, subIndicatorId: string, capId: string) => void;

  render(): JSX.Element {
    return (
      <Styled.Wrapper>
        {map(this.indicatorRiskData, (data, indicatorIndex) => (
          <Indicator
            data={data}
            facilityId={this.facilityId}
            assignCAP={(subIndicatorIndex: number) =>
              this.assignCAP(indicatorIndex, subIndicatorIndex)
            }
            viewCAP={(subIndicatorId: string, capId: string) =>
              this.viewCAP(data.indicator.id, subIndicatorId, capId)
            }
          />
        ))}
      </Styled.Wrapper>
    );
  }
}
