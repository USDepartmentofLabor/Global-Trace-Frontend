import { Vue, Component, Prop } from 'vue-property-decorator';
import { head } from 'lodash';
import { WeightUnit } from 'enums/product';
import Dropdown from 'components/FormUI/Dropdown';
import MessageError from 'components/FormUI/MessageError';
import Input from './Input';
import * as Styled from './styled';

@Component
export default class InputWeight extends Vue {
  @Prop({ default: null }) readonly messageErrors: App.MessageError;
  @Prop({ default: false }) readonly disabled: boolean;
  @Prop({ default: false }) readonly hasUnit: boolean;
  @Prop({ default: null }) readonly minWeight: number | null;
  @Prop({ default: 'totalWeight' }) readonly name: string;
  @Prop({ default: 'total_weight' }) readonly inputLabel: string;
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
  changeUnit: (id: string) => void;

  private unitSelected: App.DropdownOption = null;

  get unitOptions(): App.DropdownOption[] {
    const unitOptions = [
      {
        id: WeightUnit.KG,
        name: this.$t('kg'),
      },
      {
        id: WeightUnit.LBS,
        name: this.$t('lbs'),
      },
    ];
    if (this.hasUnit) {
      unitOptions.push({
        id: WeightUnit.UNIT,
        name: this.$t('unit').toUpperCase(),
      });
    }
    return unitOptions;
  }

  get weightValidation(): string {
    const validation = ['bail', 'required', 'integer'];
    if (this.minWeight) {
      validation.push(`min:${this.minWeight}`);
    }
    return validation.join('|');
  }

  created(): void {
    this.onChangeUnit(head(this.unitOptions));
  }

  onChangeUnit(option: App.DropdownOption): void {
    this.unitSelected = option;
    this.changeUnit(option ? (option.id as string) : null);
  }

  renderWeight(): JSX.Element {
    return (
      <Styled.InputWrapper>
        <Input
          type="number"
          label={this.$t(this.inputLabel)}
          name={this.name}
          variant="material"
          height="48px"
          placeholder={this.$t(this.inputLabel)}
          validation={this.weightValidation}
          disabled={this.disabled}
          min={this.minWeight}
          changeValue={this.changeInput}
          validationMessages={{
            required: this.$t('validation.required', {
              field: this.$t(this.inputLabel).toLowerCase(),
            }),
            integer: this.$t('validation.integer', {
              field: this.$t(this.inputLabel),
            }),
            min: this.$t('validate_field_min', {
              field: this.$t(this.inputLabel),
              min: this.minWeight,
            }),
          }}
        />
        {this.messageErrors && (
          <MessageError field={this.name} messageErrors={this.messageErrors} />
        )}
      </Styled.InputWrapper>
    );
  }

  renderUnit(): JSX.Element {
    return (
      <Styled.InputWrapper>
        <Dropdown
          title={this.$t('unit')}
          options={this.unitOptions}
          width="100%"
          height="48px"
          variant="material"
          value={this.unitSelected}
          changeOptionValue={this.onChangeUnit}
          placeholder={this.$t('unit')}
          allowEmpty={false}
          disabled={this.disabled}
          overflow
        />
      </Styled.InputWrapper>
    );
  }

  render(): JSX.Element {
    return (
      <Styled.InputPriceContainer>
        {this.renderWeight()}
        {this.renderUnit()}
      </Styled.InputPriceContainer>
    );
  }
}
