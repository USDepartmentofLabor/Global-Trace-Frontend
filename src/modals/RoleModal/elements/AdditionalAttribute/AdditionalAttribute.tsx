import { Component, Prop, Vue } from 'vue-property-decorator';
import { cloneDeep, isEmpty } from 'lodash';
import Input from 'components/FormUI/Input';
import { getAdditionalAttributes } from 'api/role';
import { handleError } from 'components/Toast';
import { SpinLoading } from 'components/Loaders';
import Button from 'components/FormUI/Button/Button';
import * as Styled from './styled';
import Attribute from './Attribute';

@Component
export default class AdditionalAttribute extends Vue {
  @Prop({
    default: [],
  })
  selectedAttributesDefault: RoleAndPermission.AttributeParams[];
  @Prop() createNewAttribute: () => void;
  @Prop() selectAttributes: (
    attributeParams: RoleAndPermission.AttributeParams[],
  ) => void;
  @Prop() editAttribute: (attribute: RoleAndPermission.RoleAttribute) => void;

  private search = '';
  private isLoading = true;
  private attributes: RoleAndPermission.RoleAttribute[] = [];
  private selectedAttributes: RoleAndPermission.AttributeParams[] = [];

  get isDisabled(): boolean {
    return isEmpty(this.selectedAttributes);
  }

  get attributesDisplayed(): RoleAndPermission.RoleAttribute[] {
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
      this.attributes = await getAdditionalAttributes();
    } catch (error) {
      handleError(error as App.ResponseError);
    } finally {
      this.isLoading = false;
    }
  }

  handleInputSearch(value: string): void {
    this.search = value;
  }

  onToggle(attribute: RoleAndPermission.RoleAttribute): void {
    const index = this.selectedAttributes.findIndex(
      ({ id }) => id === attribute.id,
    );
    if (index > -1) {
      this.selectedAttributes.splice(index, 1);
    } else {
      this.selectedAttributes.push({
        id: attribute.id,
        groupType: attribute.type,
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
          label={this.$t('add_selected_attributes')}
          disabled={this.isDisabled || this.isLoading}
          click={() => {
            this.selectAttributes(this.selectedAttributes);
          }}
        />
        <Styled.ButtonGroupEnd>
          <Button
            type="button"
            variant="outlinePrimary"
            label={this.$t('create_new_attribute')}
            disabled={this.isLoading}
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
