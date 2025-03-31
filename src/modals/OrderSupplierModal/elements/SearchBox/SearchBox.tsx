import { Vue, Component, Prop } from 'vue-property-decorator';
import { debounce, get } from 'lodash';
import { handleError } from 'components/Toast';
import { getPartnerSuppliers } from 'api/brand-orders';
import DropdownMenu from 'components/DropdownMenu';
import Input from 'components/FormUI/Input';
import * as Styled from './styled';

@Component
export default class SearchBox extends Vue {
  @Prop({ default: null }) selectedSupplier: Auth.Facility;
  @Prop({ default: '' }) readonly parentId: string;
  @Prop({ default: '' }) readonly fromSupplierId: string;
  @Prop({ required: true }) setSupplier: (supplier: string) => void;
  @Prop({ required: true }) changeSearch: (value: string) => void;
  @Prop({ default: false }) readonly isEdit: boolean;

  private suppliers: Auth.Facility[] = [];
  private disableChangeSearch: boolean = false;
  private search: string = '';
  private searchResult: App.DropdownMenuOption[] = [];

  created(): void {
    if (this.selectedSupplier) {
      this.search = this.selectedSupplier.name;
      this.setSupplier(this.selectedSupplier.id);
    }
    this.getSupplierList();
    this.onDebouncedSearch = debounce(this.onDebouncedSearch, 300);
  }

  async getSupplierList(search: string = ''): Promise<void> {
    try {
      const params: BrandSupplier.SupplierPartnerRequestParams = {
        key: search,
      };
      this.suppliers = await getPartnerSuppliers(this.fromSupplierId, params);
      this.searchResult = this.suppliers.map(({ id, name }) => ({
        id,
        name,
      }));
    } catch (error) {
      handleError(error as App.ResponseError);
    }
  }

  handleInputSearch(value: string): void {
    this.search = value;
    if (!this.disableChangeSearch) {
      this.onDebouncedSearch(value);
      this.changeSearch(value);
    } else {
      this.disableChangeSearch = false;
    }
  }

  onDebouncedSearch(value: string): void {
    this.getSupplierList(value);
  }

  selectResult(option: App.DropdownMenuOption): void {
    const supplier = this.searchResult.find(({ id }) => id === option.id);
    this.disableChangeSearch = true;
    this.search = supplier.name;
    this.setSupplier(supplier.id);
  }

  renderSearchResult(option: App.DropdownMenuOption): JSX.Element {
    const isActive = get(this.selectedSupplier, 'id') === option.id;
    return (
      <Styled.Result isActive={isActive}>
        <Styled.Label>{option.name}</Styled.Label>
      </Styled.Result>
    );
  }

  render(): JSX.Element {
    return (
      <DropdownMenu
        width="100%"
        options={this.searchResult}
        noResultText={this.$t('no_result')}
        selectOption={this.selectResult}
        forceOpen
        scopedSlots={{
          menuOption: ({ option }: { option: App.DropdownMenuOption }) =>
            this.renderSearchResult(option),
        }}
      >
        <Input
          label={this.$t('supplier')}
          placeholder={this.$t('search_for_supplier')}
          name="supplierId"
          height="48px"
          iconSize="24"
          iconColor="envy"
          prefixIcon="search"
          value={this.search}
          changeValue={this.handleInputSearch}
        />
      </DropdownMenu>
    );
  }
}
