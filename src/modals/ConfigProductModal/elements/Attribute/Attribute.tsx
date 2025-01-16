import { Vue, Component, Prop } from 'vue-property-decorator';
import { get } from 'lodash';
import { getInputCategoryName } from 'utils/translation';
import AppModule from 'store/modules/app';
import Checkbox from 'components/FormUI/Checkbox';
import * as Styled from './styled';

@Component
export default class Attribute extends Vue {
  @Prop({ required: true })
  readonly productAttribute: ProductManagement.ProductDefinitionAttribute;
  @Prop({
    default: () => {
      //
    },
  })
  changeIsOptional: () => void;
  @Prop({
    default: () => {
      //
    },
  })
  changeIsAllManually: () => void;
  @Prop({
    default: () => {
      //
    },
  })
  removeAttribute: () => void;

  get currentLocale(): string {
    return AppModule.locale;
  }

  get attributeName(): string {
    return (
      get(
        this.productAttribute.attribute,
        `nameTranslation.${this.currentLocale}`,
      ) || get(this.productAttribute, 'attribute.name')
    );
  }

  render(): JSX.Element {
    return (
      <fragment>
        <Styled.BoxHeader>
          <font-icon
            class="drag-item"
            name="drag_drop"
            color="highland"
            size="20"
          />
          <Styled.Name>{this.attributeName}</Styled.Name>
          <Styled.Type>
            {getInputCategoryName(this.productAttribute.attribute.category)}
          </Styled.Type>
          <Styled.Checkbox>
            <Checkbox
              label={this.$t('optional')}
              value={this.productAttribute.isOptional}
              valueChange={this.changeIsOptional}
            />
          </Styled.Checkbox>
          <Styled.Checkbox>
            <Checkbox
              label={this.$t('manual_product_definition')}
              value={this.productAttribute.isAddManuallyOnly}
              valueChange={this.changeIsAllManually}
            />
          </Styled.Checkbox>
          <font-icon
            name="remove"
            size="24"
            color="red"
            vOn:click_native={() => this.removeAttribute()}
          />
        </Styled.BoxHeader>
      </fragment>
    );
  }
}
