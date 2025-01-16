import { Vue, Component, Prop } from 'vue-property-decorator';
import Button from 'components/FormUI/Button';
import * as Styled from './styled';

@Component
export default class Partner extends Vue {
  @Prop({ default: '' }) readonly title: string;
  @Prop({ default: '100%' }) readonly width: string;
  @Prop({
    default: () => {
      //
    },
  })
  add: () => void;

  render(): JSX.Element {
    return (
      <Styled.Wrapper>
        <Styled.Title>{this.title}</Styled.Title>
        <Button
          label="Add"
          variant="transparentWarning"
          icon="plus"
          click={this.add}
        />
      </Styled.Wrapper>
    );
  }
}
