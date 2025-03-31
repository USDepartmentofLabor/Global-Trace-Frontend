import { Vue, Component, Prop } from 'vue-property-decorator';
import { get } from 'lodash';
import Checkbox from 'components/FormUI/Checkbox';
import AppModule from 'store/modules/app';
import { RoleAttributeTypeEnum } from 'enums/role';
import {
  convertEnumToTranslation,
  getInputCategoryName,
} from 'utils/translation';
import * as Styled from './styled';

@Component
export default class SelectedAttribute extends Vue {
  @Prop({ required: true }) groupType: string;
  @Prop({ required: true }) attributeData: RoleAndPermission.AttributeParams;
  @Prop() toggle: () => void;
  @Prop() changeIsOptional: () => void;
  @Prop() removeAttribute: () => void;

  get currentLocale(): string {
    return AppModule.locale;
  }

  get attributeName(): string {
    return (
      get(
        this.attributeData.attribute,
        `nameTranslation.${this.currentLocale}`,
      ) || get(this.attributeData, 'attribute.name')
    );
  }

  render(): JSX.Element {
    const enumName = convertEnumToTranslation(this.groupType);
    const visibility =
      this.groupType === RoleAttributeTypeEnum.ADDITIONAL_ATTRIBUTE
        ? 'inherit'
        : 'hidden';
    return (
      <Styled.BoxHeader>
        <Styled.VisibleAction visibility={visibility}>
          <font-icon
            class={enumName}
            name="drag_drop"
            color="highland"
            size="20"
          />
        </Styled.VisibleAction>
        <Styled.Name>{this.attributeData.attribute.name}</Styled.Name>
        <Styled.Type>
          {getInputCategoryName(this.attributeData.attribute.category)}
        </Styled.Type>
        <Styled.VisibleAction visibility={visibility}>
          <Styled.Checkbox>
            <Checkbox
              label={this.$t('optional')}
              value={this.attributeData.isOptional}
              valueChange={this.changeIsOptional}
            />
          </Styled.Checkbox>
        </Styled.VisibleAction>
        <Styled.VisibleAction visibility={visibility}>
          <font-icon
            name="remove"
            size="24"
            color="red"
            vOn:click_native={() => this.removeAttribute()}
          />
        </Styled.VisibleAction>
      </Styled.BoxHeader>
    );
  }
}
