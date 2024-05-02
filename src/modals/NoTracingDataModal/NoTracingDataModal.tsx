import { Vue, Component, Prop } from 'vue-property-decorator';
import { getLastTiers } from 'utils/user';
import Button from 'components/FormUI/Button';
import * as Styled from './styled';

@Component
export default class NoTracingDataModal extends Vue {
  @Prop({ default: [] }) supplierGroups: BrandSupplier.TraceSupplierMapGroup[];

  get partner(): string {
    const tiers = getLastTiers(this.supplierGroups);
    return tiers.join(',');
  }

  closeModal(): void {
    this.$emit('close');
  }

  render(): JSX.Element {
    return (
      <modal-layout showCloseIcon={false} title="">
        <Styled.Wrapper>
          <font-icon name="warning_outline" color="red" size="53" />
          <Styled.Content>
            <Styled.Text
              domProps={{
                innerHTML: this.$t('noTracingDataModal.description', {
                  partner: this.partner,
                }),
              }}
            ></Styled.Text>
          </Styled.Content>
          <Button
            label={this.$t('common.action.ok')}
            width="120px"
            click={this.closeModal}
          />
        </Styled.Wrapper>
      </modal-layout>
    );
  }
}
