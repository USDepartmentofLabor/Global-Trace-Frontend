import { Component, Prop, Vue } from 'vue-property-decorator';
import Radio from 'components/FormUI/Radio/Radio';
import { InputAttributeEnum } from 'enums/app';
import { ProductAttributeTypeEnum } from 'enums/product';
import * as Styled from './styled';
import AttributeInputTag from './AttributeInputTag';

@Component
export default class AttributeType extends Vue {
  @Prop({
    default: [],
  })
  tagIds: string[];
  @Prop({
    default: null,
  })
  value: string;
  @Prop({
    default: null,
  })
  selectedAttributeType: ProductAttributeTypeEnum;
  @Prop({
    required: true,
  })
  type: ProductManagement.AttributeType;
  @Prop({
    default: () => {
      //
    },
  })
  changeType: (value: string) => void;
  @Prop({
    default: () => {
      //
    },
  })
  changeTags: (tags: string[]) => void;

  get isSelectedProductId(): boolean {
    return this.selectedAttributeType === ProductAttributeTypeEnum.PRODUCT_ID;
  }

  get isSelectedProductQuantity(): boolean {
    return (
      this.selectedAttributeType === ProductAttributeTypeEnum.PRODUCT_QUANTITY
    );
  }

  get showInputTag(): boolean {
    return (
      (this.type.id === InputAttributeEnum.LIST ||
        this.type.id === InputAttributeEnum.NUMBER_UNIT_PAIR) &&
      this.type.id === this.value
    );
  }

  get isDisabled(): boolean {
    return (
      (this.isSelectedProductId && this.type.id !== InputAttributeEnum.TEXT) ||
      (this.isSelectedProductQuantity &&
        this.type.id !== InputAttributeEnum.NUMBER_UNIT_PAIR)
    );
  }

  render(): JSX.Element {
    return (
      <Styled.Item disabled={this.isDisabled}>
        <Radio
          name="type"
          disabled={this.isDisabled}
          checkboxValue={this.type.id}
          value={this.value}
          label={this.type.label}
          changeValue={this.changeType}
        />
        {this.showInputTag && (
          <AttributeInputTag
            tagIds={this.tagIds}
            changeTags={this.changeTags}
          />
        )}
      </Styled.Item>
    );
  }
}
