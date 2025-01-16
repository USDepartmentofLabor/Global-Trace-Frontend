import { Vue, Component, Prop } from 'vue-property-decorator';
import Button from 'components/FormUI/Button';
import * as Styled from './styled';

@Component
export default class NoTracingDataModal extends Vue {
  @Prop({ required: true }) producerName: string;

  closeModal(): void {
    this.$emit('close');
  }

  render(): JSX.Element {
    return (
      <modal-layout closeModal={this.closeModal} title="">
        <Styled.Wrapper>
          <font-icon name="warning_outline" color="red" size="53" />
          <Styled.Content>
            <Styled.Text
              domProps={{
                innerHTML: this.$t('noTracingDataModal.description', {
                  partner: this.producerName,
                }),
              }}
            ></Styled.Text>
          </Styled.Content>
          <Button label={this.$t('common.action.ok')} click={this.closeModal} />
        </Styled.Wrapper>
      </modal-layout>
    );
  }
}
