import { Vue, Component, Prop } from 'vue-property-decorator';
import { find, head } from 'lodash';
import Dropdown from 'components/FormUI/Dropdown';
import { geCurrencyOptions } from 'utils/app';
import Input from './Input';
import * as Styled from './styled';

@Component
export default class InputPrice extends Vue {
  @Prop({ default: null }) readonly messageErrors: App.MessageError;
  @Prop({ default: false }) readonly disabled: boolean;
  @Prop({ default: '' }) readonly currencyDefault: string;
  @Prop({ default: 'totalPrice' }) readonly name: string;
  @Prop({ default: 'total_price' }) readonly inputLabel: string;
  @Prop({
    type: Function,
    default: () => {
      //
    },
  })
  changeInput: () => void;
  @Prop({
    type: Function,
    default: () => {
      //
    },
  })
  changeCurrency: (id: string) => void;

  private selectedCurrency: App.DropdownOption = null;

  private currencyOptions: App.DropdownOption[] = geCurrencyOptions();

  created(): void {
    this.initFacilityType();
  }

  initFacilityType(): void {
    const currencyDefault = find(
      this.currencyOptions,
      (option) => option.id === this.currencyDefault,
    );
    this.onChangeCurrency(currencyDefault || head(this.currencyOptions));
  }

  onChangeCurrency(option: App.DropdownOption): void {
    this.selectedCurrency = option;
    this.changeCurrency(option ? (option.id as string) : null);
  }

  renderPrice(): JSX.Element {
    return (
      <Styled.InputWrapper>
        <Input
          type="number"
          min="0"
          label={this.$t(this.inputLabel)}
          name={this.name}
          height="48px"
          placeholder={this.$t(this.inputLabel)}
          validation="bail|min:0"
          disabled={this.disabled}
          changeValue={this.changeInput}
          validationMessages={{
            min: this.$t('validation.min', {
              field: this.$t(this.inputLabel),
              compare_field: 0,
            }),
          }}
        />
      </Styled.InputWrapper>
    );
  }

  renderCurrency(): JSX.Element {
    return (
      <Styled.InputWrapper>
        <Dropdown
          title={this.$t('currency')}
          options={this.currencyOptions}
          width="100%"
          height="48px"
          value={this.selectedCurrency}
          changeOptionValue={this.onChangeCurrency}
          placeholder={this.$t('currency')}
          allowEmpty={false}
          overflow
        />
      </Styled.InputWrapper>
    );
  }

  render(): JSX.Element {
    return (
      <Styled.InputPriceContainer>
        {this.renderPrice()}
        {this.renderCurrency()}
      </Styled.InputPriceContainer>
    );
  }
}
