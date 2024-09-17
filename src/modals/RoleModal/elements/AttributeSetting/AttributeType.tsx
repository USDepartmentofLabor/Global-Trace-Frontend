import { Component, Prop, Vue } from 'vue-property-decorator';
import Radio from 'components/FormUI/Radio/Radio';
import { InputAttributeEnum } from 'enums/app';
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
    required: true,
  })
  type: RoleAndPermission.AttributeType;
  @Prop() changeType: (value: string) => void;
  @Prop() changeTags: (tags: string[]) => void;

  get showInputTag(): boolean {
    return (
      (this.type.id === InputAttributeEnum.LIST ||
        this.type.id === InputAttributeEnum.NUMBER_UNIT_PAIR) &&
      this.type.id === this.value
    );
  }

  render(): JSX.Element {
    return (
      <Styled.Item>
        <Radio
          name="type"
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
