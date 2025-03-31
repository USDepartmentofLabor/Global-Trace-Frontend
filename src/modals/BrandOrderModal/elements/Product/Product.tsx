import { Vue, Component, Prop } from 'vue-property-decorator';
import Input from 'components/FormUI/Input';
import * as Styled from '../../styled';

@Component
export default class Product extends Vue {
  @Prop({ default: false }) isSubmitting: boolean;
  @Prop() clearMessageErrors: () => void;

  render(): JSX.Element {
    return (
      <Styled.Row>
        <Input
          label={this.$t('brandOrderModal.product_description')}
          name="productDescription"
          maxLength={255}
          disabled={this.isSubmitting}
          height="48px"
          autoTrim
          changeValue={this.clearMessageErrors}
          validation="bail|required"
          validationMessages={{
            required: this.$t('validation.required', {
              field: this.$t(
                'brandOrderModal.product_description',
              ).toLowerCase(),
            }),
          }}
        />
        <Input
          label={this.$t('brandOrderModal.quantity')}
          name="quantity"
          maxLength={255}
          disabled={this.isSubmitting}
          height="48px"
          autoTrim
          changeValue={this.clearMessageErrors}
          validation="bail|required"
          validationMessages={{
            required: this.$t('validation.required', {
              field: this.$t('brandOrderModal.quantity').toLowerCase(),
            }),
          }}
        />
      </Styled.Row>
    );
  }
}
