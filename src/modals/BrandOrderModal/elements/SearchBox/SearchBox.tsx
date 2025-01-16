import { Vue, Component, Prop } from 'vue-property-decorator';
import { debounce, get } from 'lodash';
import { getUserInfo } from 'api/user-setting';
import { handleError } from 'components/Toast';
import { getSuppliers } from 'api/brand-orders';
import auth from 'store/modules/auth';
import DropdownMenu from 'components/DropdownMenu';
import Input from 'components/FormUI/Input';
import { SpinLoading } from 'components/Loaders';
import * as Styled from './styled';

@Component
export default class SearchBox extends Vue {
  @Prop({ default: null }) selectedSupplier: Auth.Facility;
  @Prop({ required: true }) setSupplier: (supplier: Auth.Facility) => void;
  @Prop({ required: true }) changeSearch: (value: string) => void;

  private suppliers: Auth.Facility[] = [];
  private disableChangeSearch: boolean = false;
  private isLoading: boolean = false;
  private search: string = '';
  private searchResult: App.DropdownMenuOption[] = [];

  created(): void {
    if (auth.isProductRole) {
      this.initCurrentFacility();
    } else {
      this.initSupplier();
    }
  }

  async initCurrentFacility(): Promise<void> {
    try {
      this.isLoading = true;
      const { currentFacility } = await getUserInfo();
      this.search = currentFacility.name;
      this.setSupplier(currentFacility);
    } catch (error) {
      handleError(error as App.ResponseError);
    } finally {
      this.isLoading = false;
    }
  }

  initSupplier() {
    if (this.selectedSupplier) {
      this.search = this.selectedSupplier.name;
      this.setSupplier(this.selectedSupplier);
    }
    this.getSupplierList();
    this.onDebouncedSearch = debounce(this.onDebouncedSearch, 300);
  }

  async getSupplierList(search: string = ''): Promise<void> {
    try {
      const params: BrandSupplier.SupplierPartnerRequestParams = {
        key: search,
      };
      this.suppliers = await getSuppliers(params);
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
    const supplier = this.suppliers.find(({ id }) => id === option.id);
    this.disableChangeSearch = true;
    this.search = supplier.name;
    this.setSupplier(supplier);
  }

  renderSearchResult(option: App.DropdownMenuOption): JSX.Element {
    const isActive = get(this.selectedSupplier, 'id') === option.id;
    return (
      <Styled.Result isActive={isActive}>
        <Styled.Label class="label">{option.name}</Styled.Label>
      </Styled.Result>
    );
  }

  render(): JSX.Element {
    return (
      <fragment>
        {this.isLoading && <SpinLoading isInline={false} />}
        <DropdownMenu
          width="100%"
          options={this.searchResult}
          noResultText={this.$t('no_match')}
          selectOption={this.selectResult}
          scopedSlots={{
            menuOption: ({ option }: { option: App.DropdownMenuOption }) =>
              this.renderSearchResult(option),
          }}
        >
          <Input
            label={this.$t('supplier')}
            name="supplierId"
            height="48px"
            iconSize="24"
            prefixIcon="search"
            disabled={auth.isProductRole}
            value={this.search}
            changeValue={(value: string) => {
              this.handleInputSearch(value);
            }}
          />
        </DropdownMenu>
      </fragment>
    );
  }
}
