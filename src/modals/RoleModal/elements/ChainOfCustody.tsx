import { Vue, Component, Prop, PropSync } from 'vue-property-decorator';
import { ChainOfCustodyEnum } from 'enums/role';
import RadioGroup from 'components/FormUI/Radio/RadioGroup';
import * as Styled from './styled';

@Component
export default class ChainOfCustody extends Vue {
  @PropSync('value') valueModel!: ChainOfCustodyEnum;

  @Prop({
    default: () => {
      //
    },
  })
  change: (value: string) => void;

  private chainOfCustodyOptions: App.Radio[] = [
    { label: this.$t('mass_balance'), value: ChainOfCustodyEnum.MASS_BALANCE },
    {
      label: this.$t('product_segregation'),
      value: ChainOfCustodyEnum.PRODUCT_SEGREGATION,
    },
  ];

  render(): JSX.Element {
    return (
      <Styled.PermissionList>
        <Styled.PermissionTitle>
          {this.$t('chain_model')}
        </Styled.PermissionTitle>
        <Styled.PermissionContent>
          <RadioGroup
            value={this.valueModel}
            name="chainOfCustody"
            options={this.chainOfCustodyOptions}
            changeValue={this.change}
          />
        </Styled.PermissionContent>
      </Styled.PermissionList>
    );
  }
}
