import { Vue, Component, Prop } from 'vue-property-decorator';
import { get } from 'lodash';
import RiskLabel from 'components/RiskLabel';
import * as Styled from './styled';

@Component
export default class RiskCard extends Vue {
  @Prop({ default: [] }) readonly risks: Auth.ViewRisk[];
  @Prop({ default: true }) readonly isGrid: boolean;

  render(): JSX.Element {
    return (
      <Styled.RisksList isGrid={this.isGrid}>
        {this.risks.map((risk) => (
          <fragment>
            <Styled.Risk>{risk.title}</Styled.Risk>

            <Styled.Label>
              <RiskLabel
                text={get(risk, 'risk.level', '')}
                level={get(risk, 'risk.level', '')}
              />
            </Styled.Label>
          </fragment>
        ))}
      </Styled.RisksList>
    );
  }
}
