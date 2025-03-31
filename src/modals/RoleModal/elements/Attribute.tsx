import { Vue, Component, Prop } from 'vue-property-decorator';
import {
  cloneDeep,
  flatMap,
  forOwn,
  groupBy,
  head,
  isEmpty,
  keys,
} from 'lodash';
import Button from 'components/FormUI/Button';
import { handleError } from 'components/Toast';
import { getRoleAttributes } from 'api/role';
import Dropdown from 'components/FormUI/Dropdown';
import InputGroup from 'components/FormUI/InputGroup';
import { SpinLoading } from 'components/Loaders';
import * as Styled from './styled';
import AttributeGroup from './AttributeGroup';

@Component
export default class Attribute extends Vue {
  @Prop({ default: [] })
  identifierTypes: App.DropdownOption[];
  @Prop({ default: [] })
  identityTypesOptions: App.DropdownOption[];
  @Prop({ default: [] })
  additionalAttributes: RoleAndPermission.AttributeParams[];
  @Prop({ default: false }) formData: RoleAndPermission.RoleParams;
  @Prop() cancel: () => void;
  @Prop() gotoAddAdditionalAttribute: () => void;
  @Prop() changeIdentifierTypes: (options: App.DropdownOption[]) => void;
  @Prop() removeAttribute: (id: string) => void;
  @Prop() next: (formInput: RoleAndPermission.RoleParams) => void;
  private isLoading = true;
  private selectedIdentifierTypes: App.DropdownOption[] = [];
  private systemAttributes: RoleAndPermission.SystemAttributeResponse = null;
  private attributes: RoleAndPermission.AttributeParams[] = [];
  private groupTypes: string[] = [];

  get isDisabled(): boolean {
    return isEmpty(this.selectedIdentifierTypes);
  }

  created() {
    this.initData();
  }

  async initData() {
    this.isLoading = true;
    this.selectedIdentifierTypes = this.identifierTypes;
    await this.getSystemAttributes();
    this.isLoading = false;
  }

  async getSystemAttributes(): Promise<void> {
    try {
      this.systemAttributes = await getRoleAttributes({
        types: flatMap(this.selectedIdentifierTypes, 'name'),
      });
    } catch (error) {
      handleError(error as App.ResponseError);
    } finally {
      this.setSystemAttributes();
    }
  }

  setSystemAttributes() {
    this.attributes = [];
    forOwn(this.systemAttributes, (items, key) => {
      const attributes = items.map((item: RoleAndPermission.RoleAttribute) => ({
        id: item.id,
        attribute: item,
        isOptional: false,
        groupType: key,
      }));
      this.attributes = [...this.attributes, ...attributes];
    });
    if (!isEmpty(this.additionalAttributes)) {
      this.attributes = [...this.attributes, ...this.additionalAttributes];
    }
    this.groupTypes = cloneDeep(keys(groupBy(this.attributes, 'groupType')));
  }

  onChangeIdentifierTypes(option: App.DropdownOption[] = []): void {
    this.selectedIdentifierTypes = option;
    this.changeIdentifierTypes(option);
    this.getSystemAttributes();
  }

  onSort(attributes: RoleAndPermission.AttributeParams[]) {
    const type = head(attributes).groupType;
    this.attributes = this.attributes.filter(
      ({ groupType }) => groupType !== type,
    );
    attributes.forEach((attribute) => {
      this.attributes.push({
        id: attribute.id,
        isOptional: attribute.isOptional,
        groupType: type,
        attribute: attribute.attribute,
      });
    });
  }

  handleSubmit() {
    this.next({
      attributes: this.getAttributes(),
    });
  }

  getAttributes(): RoleAndPermission.AttributesPayload[] {
    return this.attributes.map(({ id, groupType, isOptional }, order) => ({
      attributeId: id,
      roleAttributeType: groupType,
      order,
      isOptional,
    }));
  }

  remove(attributeId: string): void {
    this.attributes = this.attributes.filter(({ id }) => id !== attributeId);
    this.removeAttribute(attributeId);
  }

  changeIsOptional(attributeId: string): void {
    const index = this.attributes.findIndex(({ id }) => id === attributeId);
    if (index > -1) {
      this.attributes[index].isOptional = !this.attributes[index].isOptional;
    }
  }

  renderContent(): JSX.Element {
    const attributeGroups = groupBy(this.attributes, 'groupType');
    return (
      <Styled.AttributeGroup>
        {this.groupTypes.map((key) => {
          const group = attributeGroups[key];
          return (
            <AttributeGroup
              key={key}
              name={key}
              data={group}
              sort={this.onSort}
              removeAttribute={this.remove}
              changeIsOptional={this.changeIsOptional}
            />
          );
        })}
      </Styled.AttributeGroup>
    );
  }

  renderActions(): JSX.Element {
    return (
      <Styled.Actions>
        <Styled.ButtonGroupEnd>
          <Button
            label={this.$t('common.action.cancel')}
            variant="outlinePrimary"
            click={this.cancel}
          />
          <Button
            variant="primary"
            label={this.$t('done')}
            disabled={this.isDisabled}
            click={this.handleSubmit}
          />
        </Styled.ButtonGroupEnd>
      </Styled.Actions>
    );
  }

  renderHead(): JSX.Element {
    return (
      <Styled.Head>
        <Dropdown
          title={this.$t('identifier_system')}
          placeholder={this.$t('identifier_system_placeholder')}
          height="48px"
          isMultiple
          options={this.identityTypesOptions}
          width="100%"
          value={this.selectedIdentifierTypes}
          trackBy="id"
          closeOnSelect={false}
          changeOptionValue={this.onChangeIdentifierTypes}
          limit={1}
          taggable
        />
        <Styled.AddAttribute vOn:click={this.gotoAddAdditionalAttribute}>
          {this.$t('add_additional_attributes')}
          <font-icon name="arrow_forward" color="highland" size="20" />
        </Styled.AddAttribute>
      </Styled.Head>
    );
  }

  render(): JSX.Element {
    return (
      <InputGroup>
        {this.isLoading && <SpinLoading />}
        {!this.isLoading && (
          <InputGroup>
            <Styled.FormContainer>{this.renderHead()}</Styled.FormContainer>
            <Styled.AttributeWrapper>
              <perfect-scrollbar>{this.renderContent()}</perfect-scrollbar>
            </Styled.AttributeWrapper>
          </InputGroup>
        )}
        {this.renderActions()}
      </InputGroup>
    );
  }
}
