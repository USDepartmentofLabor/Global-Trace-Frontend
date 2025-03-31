import { Vue, Component, Prop } from 'vue-property-decorator';
import * as Styled from './styled';

@Component
export default class ProducerLayout extends Vue {
  @Prop({ required: true }) title: string;

  backToHomePage(): void {
    this.$router.push({ name: 'Homepage' });
  }

  render(): JSX.Element {
    return (
      <Styled.ProducerWrapper>
        <Styled.ProducerHeader>
          <font-icon
            name="arrow_left"
            size="24"
            color="envy"
            cursor
            vOn:click_native={this.backToHomePage}
          />
          <Styled.ProduceTitle>{this.title}</Styled.ProduceTitle>
        </Styled.ProducerHeader>
        {this.$slots.default}
      </Styled.ProducerWrapper>
    );
  }
}
