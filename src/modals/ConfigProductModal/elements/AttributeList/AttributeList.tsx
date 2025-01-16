import { Component, Prop, Vue } from 'vue-property-decorator';
import { cloneDeep, isEmpty } from 'lodash';
import Input from 'components/FormUI/Input';
import { getAttributes } from 'api/product-management';
import { handleError } from 'components/Toast';
import { SpinLoading } from 'components/Loaders';
import Button from 'components/FormUI/Button/Button';
import * as Styled from './styled';
import Attribute from './Attribute';

@Component
export default class AttributeList extends Vue {
  @Prop({
    default: () => {
      //
    },
  })
  createNewAttribute: () => void;
  @Prop({
    default: [],
  })
  selectedAttributesDefault: ProductManagement.AttributeParams[];
  @Prop({
    default: () => {
      //
    },
  })
  selectAttributes: (
    attributeParams: ProductManagement.AttributeParams[],
  ) => void;
  @Prop({
    default: () => {
      //
    },
  })
  editAttribute: (attribute: ProductManagement.ProductAttribute) => void;

  private search = '';
  private isLoading = true;
  private attributes: ProductManagement.ProductAttribute[] = [];
  private selectedAttributes: ProductManagement.AttributeParams[] = [];

  get isDisabled(): boolean {
    return isEmpty(this.selectedAttributes);
  }

  get attributesDisplayed(): ProductManagement.ProductAttribute[] {
    if (isEmpty(this.search)) {
      return this.attributes.sort((a, b) => a.name.localeCompare(b.name));
    }
    return this.attributes.filter(
      ({ name }) => name.toLowerCase().indexOf(this.search.toLowerCase()) > -1,
    );
  }

  created() {
    this.getAttributes();
    this.selectedAttributes = cloneDeep(this.selectedAttributesDefault);
  }

  async getAttributes(): Promise<void> {
    try {
      this.isLoading = true;
      this.attributes = await getAttributes();
    } catch (error) {
      handleError(error as App.ResponseError);
    } finally {
      this.isLoading = false;
    }
  }

  handleInputSearch(value: string): void {
    this.search = value;
  }

  onToggle(attribute: ProductManagement.ProductAttribute): void {
    const index = this.selectedAttributes.findIndex(
      ({ id }) => id === attribute.id,
    );
    if (index > -1) {
      this.selectedAttributes.splice(index, 1);
    } else {
      this.selectedAttributes.push({
        id: attribute.id,
        isAddManuallyOnly: false,
        isOptional: false,
        attribute: attribute,
      });
    }
  }

  renderSearch(): JSX.Element {
    return (
      <Input
        height="40px"
        name="search"
        size="large"
        value={this.search}
        placeholder={this.$t('search')}
        changeValue={(value: string) => {
          this.handleInputSearch(value);
        }}
        prefixIcon="search"
      />
    );
  }

  renderAttributes(): JSX.Element {
    return (
      <perfect-scrollbar>
        <Styled.List>
          {this.attributesDisplayed.map((attribute) => (
            <Attribute
              key={attribute.id}
              selectedAttributes={this.selectedAttributes}
              attribute={attribute}
              toggle={() => {
                this.onToggle(attribute);
              }}
              edit={() => {
                this.editAttribute(attribute);
              }}
            />
          ))}
        </Styled.List>
      </perfect-scrollbar>
    );
  }

  renderActions(): JSX.Element {
    return (
      <Styled.Actions>
        <Button
          type="button"
          variant="primary"
          label={this.$t('add')}
          disabled={this.isDisabled || this.isLoading}
          click={() => {
            this.selectAttributes(this.selectedAttributes);
          }}
        />
        <Styled.ButtonGroupEnd>
          <Button
            type="button"
            variant="primary"
            label={this.$t('create_new_attribute')}
            click={this.createNewAttribute}
          />
        </Styled.ButtonGroupEnd>
      </Styled.Actions>
    );
  }

  renderContent(): JSX.Element {
    if (this.isLoading) {
      return <SpinLoading />;
    }
    return (
      <fragment>
        {this.renderSearch()}
        {this.renderAttributes()}
        {this.renderActions()}
      </fragment>
    );
  }

  render(): JSX.Element {
    return <Styled.Wrapper>{this.renderContent()}</Styled.Wrapper>;
  }
}
