import { Vue, Component, Prop, PropSync } from 'vue-property-decorator';
import * as Styled from './styled';

@Component
export default class Duration extends Vue {
  @PropSync('duration') durationValue!: number;
  @Prop({
    default: () => {
      //
    },
  })
  changeValue: (value: number) => void;

  private months: number = 12;

  renderMonths(): JSX.Element {
    const monthElements: JSX.Element[] = [];

    for (let i = 1; i <= this.months; i++) {
      monthElements.push(
        <Styled.Month
          isSelected={Number(this.durationValue) === i}
          vOn:click={() => this.changeValue(i)}
          key={i}
        >
          {i}
        </Styled.Month>,
      );
    }

    return <Styled.Months>{monthElements}</Styled.Months>;
  }

  render(): JSX.Element {
    return (
      <Styled.Wrapper>
        <Styled.Header>{this.$t('duration_months')}</Styled.Header>
        {this.renderMonths()}
      </Styled.Wrapper>
    );
  }
}
