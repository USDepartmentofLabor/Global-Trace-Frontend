import { Component, Prop, Vue } from 'vue-property-decorator';
import { get } from 'lodash';
import Checkbox from 'components/FormUI/Checkbox';
import AppModule from 'store/modules/app';
import { getInputCategoryName } from 'utils/translation';
import * as Styled from './styled';

@Component
export default class Attribute extends Vue {
  @Prop({
    required: true,
  })
  selectedAttributes: ProductManagement.ProductAttribute[];
  @Prop({
    required: true,
  })
  attribute: ProductManagement.ProductAttribute;
  @Prop({
    default: () => {
      //
    },
  })
  toggle: () => void;
  @Prop({
    default: () => {
      //
    },
  })
  edit: () => void;

  private isChecked = false;

  get currentLocale(): string {
    return AppModule.locale;
  }

  get attributeName(): string {
    return (
      get(this.attribute, `nameTranslation.${this.currentLocale}`) ||
      this.attribute.name
    );
  }

  created() {
    this.isChecked = this.selectedAttributes.some(
      ({ id }) => id === this.attribute.id,
    );
  }

  change(): void {
    this.isChecked = !this.isChecked;
    this.toggle();
  }

  render(): JSX.Element {
    return (
      <Styled.Item>
        <Checkbox
          label={this.attributeName}
          valueChange={this.change}
          value={this.isChecked}
        />
        <Styled.AttributeActions>
          <Styled.AttributeType>
            {getInputCategoryName(this.attribute.category)}
          </Styled.AttributeType>
          <font-icon
            name="edit_outline"
            color="highland"
            size="18"
            vOn:click_native={this.edit}
          />
        </Styled.AttributeActions>
      </Styled.Item>
    );
  }
}
