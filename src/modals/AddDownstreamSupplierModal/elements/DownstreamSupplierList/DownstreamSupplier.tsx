import { Vue, Component, Prop } from 'vue-property-decorator';
import { orderBy } from 'lodash';
import Dropdown from 'components/FormUI/Dropdown';
import * as Styled from './styled';

@Component
export default class DownstreamSupplier extends Vue {
  @Prop({ required: true }) index: number;
  @Prop({ required: true }) value: SupplyChain.DownstreamSupplierListParams;
  @Prop({ required: true }) list: SupplyChain.DownstreamSupplierListParams[];
  @Prop({ required: true }) roles: RoleAndPermission.Role[];
  @Prop({ required: true }) productOptions: ProductManagement.Product[];
  @Prop({ required: true }) currentNode: SupplyChain.Node;
  @Prop({ required: true }) changeRole: (option: App.DropdownOption) => void;
  @Prop({ required: true }) changeProductOutputs: (
    options: App.DropdownOption[],
  ) => void;
  @Prop({ required: true }) remove: () => void;

  private selectedRole: App.DropdownOption = null;
  private selectedProductOutputs: App.DropdownOption[] = [];

  get roleOptions(): App.DropdownOption[] {
    return orderBy(
      this.roles.filter(
        ({ id, isRawMaterialExtractor }) =>
          !isRawMaterialExtractor && id !== this.currentNode.roleId,
      ),
      [(item) => item.name.toLowerCase()],
      'asc',
    );
  }

  get outputProductsOptions(): ProductManagement.Product[] {
    return orderBy(
      this.productOptions,
      [(item) => item.name.toLowerCase()],
      'asc',
    );
  }

  onChangeRole(option: App.DropdownOption): void {
    this.selectedRole = option;
    this.changeRole(option);
  }

  onChangeProductOutputs(options: App.DropdownOption[]): void {
    this.selectedProductOutputs = options;
    this.changeProductOutputs(options);
  }

  render(): JSX.Element {
    return (
      <Styled.Container isFirst={this.index === 0}>
        <Styled.SupplierHeader>
          <Styled.Title>
            {this.$t('downstream_supplier_number', { value: this.index + 1 })}
          </Styled.Title>
          {this.list.length > 1 && (
            <font-icon
              name="remove_circle_outline"
              size="16"
              color="manatee"
              vOn:click_native={this.remove}
            />
          )}
        </Styled.SupplierHeader>
        <Dropdown
          title={this.$t('select_role')}
          options={this.roleOptions}
          height="48px"
          trackBy="id"
          value={this.selectedRole}
          changeOptionValue={this.onChangeRole}
          placeholder={this.$t('select_role')}
          allowEmpty={false}
          overflow
        />
        <Dropdown
          title={this.$t('select_product_outputs')}
          options={this.outputProductsOptions}
          height="48px"
          trackBy="id"
          value={this.selectedProductOutputs}
          changeOptionValue={this.onChangeProductOutputs}
          placeholder={this.$t('select_product_outputs')}
          allowEmpty={false}
          overflow
          isMultiple
          limit={1}
          taggable
        />
      </Styled.Container>
    );
  }
}
