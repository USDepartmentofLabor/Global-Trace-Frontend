import { Vue, Component, Prop } from 'vue-property-decorator';
import RadioGroup from 'components/FormUI/Radio/RadioGroup';
import { MethodologyEnum } from 'enums/risk-assessment';
import Button from 'components/FormUI/Button';
import * as Styled from './styled';

@Component
export default class Methodology extends Vue {
  @Prop({ default: '' }) defaultValue: string;
  @Prop({
    default: () => {
      //
    },
  })
  next: (methodology: string) => void;

  private value: string = '';
  private options: App.Radio[] = [
    {
      label: this.$t('highest_reported'),
      value: MethodologyEnum.HIGHEST_RISK,
    },
    {
      label: this.$t('average_reported'),
      value: MethodologyEnum.AVERAGE_RISK,
    },
    {
      label: this.$t('weighted_average_reported'),
      value: MethodologyEnum.WEIGHTED_AVERAGE,
    },
  ];

  created() {
    this.value = this.defaultValue;
  }

  change(value: string): void {
    this.value = value;
  }

  render(): JSX.Element {
    return (
      <Styled.Wrapper>
        <Styled.Box>
          <Styled.Title>{this.$t('risk_assessment_question_1')}</Styled.Title>
          <RadioGroup
            value={this.value}
            name="methodology"
            options={this.options}
            changeValue={this.change}
          />
        </Styled.Box>
        <Button label={this.$t('next')} click={() => this.next(this.value)} />
      </Styled.Wrapper>
    );
  }
}
