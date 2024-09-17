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
      <Styled.Container>
        <Styled.Title>{this.title}</Styled.Title>
        <Styled.Action>
          <Button
            width={this.width}
            type="button"
            variant="transparentWarning"
            label={this.$t('add_item', {
              item: this.title,
            })}
            icon="plus"
            click={this.add}
          />
        </Styled.Action>
      </Styled.Container>
    );
  }
}
