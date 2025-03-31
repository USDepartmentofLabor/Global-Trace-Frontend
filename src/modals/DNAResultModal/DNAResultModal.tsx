import { Vue, Component, Prop } from 'vue-property-decorator';
import { isEmpty } from 'lodash';
import Button from 'components/FormUI/Button';
import { AddDNAOptionEnum } from 'enums/dna';
import * as Styled from './styled';

@Component
export default class DNAResultModal extends Vue {
  @Prop({ required: true }) readonly type: AddDNAOptionEnum;
  @Prop({ default: '' }) readonly facilityName: string;
  @Prop({ default: '' }) readonly productId: string;
  @Prop({ default: [] }) readonly countries: string[];
  @Prop({ default: [] }) readonly DNAIdentifiers: string[];
  @Prop({ required: true }) readonly isSuccess: boolean;

  get buttonVariant(): string {
    return this.isSuccess ? 'primary' : 'outlinePrimary';
  }

  get icon(): string {
    return this.isSuccess ? 'check_circle' : 'warning_outline';
  }

  get iconColor(): string {
    return this.isSuccess ? 'highland' : 'alizarinCrimson';
  }

  get title(): string {
    return this.type === AddDNAOptionEnum.ISOTOPIC
      ? this.$t('isotopic_DNA_test_summary')
      : this.$t('synthetic_DNA_marking_summary');
  }

  get result(): string {
    if (this.type === AddDNAOptionEnum.ISOTOPIC) {
      return this.$t(
        this.isSuccess
          ? 'createDNATestModal.isotopic_DNA_matched'
          : 'createDNATestModal.isotopic_DNA_not_match',
      );
    }
    return this.$t(
      this.isSuccess
        ? 'createDNATestModal.synthetic_DNA_matched'
        : 'createDNATestModal.synthetic_DNA_not_match',
    );
  }

  closeModal(): void {
    this.$emit('close');
  }

  render(): JSX.Element {
    return (
      <modal-layout closeModal={this.closeModal}>
        <Styled.Wrapper>
          <Styled.Icon>
            <font-icon name={this.icon} size="64" color={this.iconColor} />
          </Styled.Icon>
          <Styled.Title>{this.title}</Styled.Title>
          <Styled.Content>
            <Styled.ResultGroup>
              <text-direction>
                {this.$t('product_id')}: {this.productId}
              </text-direction>
            </Styled.ResultGroup>
            <Styled.ResultGroup>
              <text-direction>
                {this.$t('product_supplier')}: {this.facilityName}
              </text-direction>
            </Styled.ResultGroup>
            {!isEmpty(this.countries) && (
              <Styled.ResultGroup>
                <text-direction>
                  {this.$t('country')}: {this.countries.join(', ')}
                </text-direction>
              </Styled.ResultGroup>
            )}
            {!isEmpty(this.DNAIdentifiers) && (
              <Styled.ResultGroup>
                <text-direction>
                  {this.$t('dna_identifier')}: {this.DNAIdentifiers.join(', ')}
                </text-direction>
              </Styled.ResultGroup>
            )}
          </Styled.Content>
          <Styled.Result isSuccess={this.isSuccess}>
            {this.result}
          </Styled.Result>
          <Button
            width="100%"
            label={this.$t('common.action.ok')}
            variant={this.buttonVariant}
            click={this.closeModal}
          />
        </Styled.Wrapper>
      </modal-layout>
    );
  }
}
