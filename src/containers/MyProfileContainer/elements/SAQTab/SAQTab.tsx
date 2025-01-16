import { Component, Prop, Vue } from 'vue-property-decorator';
import SAQ from 'components/SAQ';
import * as Styled from './styled';

@Component
export default class SAQTab extends Vue {
  @Prop({
    default: () => {
      //
    },
  })
  finishSAQ: () => void;

  render(): JSX.Element {
    return (
      <Styled.Container>
        <SAQ finishSAQ={this.finishSAQ} />
      </Styled.Container>
    );
  }
}
