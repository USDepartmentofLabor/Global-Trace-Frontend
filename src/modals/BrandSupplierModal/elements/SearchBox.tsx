import { Vue, Component, Prop } from 'vue-property-decorator';
import { debounce, get, map } from 'lodash';
import { searchBrandSupplier } from 'api/brand-supplier';
import DropdownMenu from 'components/DropdownMenu';
import { handleError } from 'components/Toast';
import Input from 'components/FormUI/Input';
import * as Styled from './styled';

@Component
export default class SearchBox extends Vue {
  @Prop({ default: null }) selectedFacility: Auth.Facility;
  @Prop({ required: true }) setFacility: (facility: Auth.Facility) => void;
  @Prop({ required: true }) changeSearch: (value: string) => void;

  private hasSearch: boolean = false;
  private search: string = '';
  private allFacilities: Auth.Facility[] = [];
  private abortController: AbortController = null;

  get facilityOptions(): App.DropdownMenuOption[] {
    return map(this.allFacilities, (facility) => ({
      id: facility.id,
      name: facility.name,
    }));
  }

  created(): void {
    this.onDebouncedSearch = debounce(this.onDebouncedSearch, 300);
    this.getListBusinessPartner();
  }

  async getListBusinessPartner(search: string = ''): Promise<void> {
    try {
      const params: BrandSupplier.SupplierPartnerRequestParams = {
        key: search,
      };
      this.abortController = new AbortController();
      const signal = this.abortController.signal;
      const facilityItems = await searchBrandSupplier(params, signal);
      this.allFacilities = facilityItems;
      this.updateHasSearch(facilityItems.length > 0);
    } catch (error) {
      if (error) {
        handleError(error as App.ResponseError);
      }
    } finally {
      this.abortController = null;
    }
  }

  updateHasSearch(hasSearch: boolean): void {
    if (!this.hasSearch) {
      this.hasSearch = hasSearch;
    }
  }

  handleInputSearch(value: string): void {
    this.search = value;
    this.onDebouncedSearch(value);
    this.changeSearch(value);
  }

  onDebouncedSearch(value: string): void {
    if (this.abortController) {
      this.abortController.abort();
    }
    this.getListBusinessPartner(value);
  }

  selectFacility(option: App.DropdownMenuOption): void {
    const facility = this.allFacilities.find(({ id }) => id === option.id);
    this.handleInputSearch(facility.name);
    this.$nextTick(() => {
      this.setFacility(facility);
    });
  }

  renderSearchResult(option: App.DropdownMenuOption): JSX.Element {
    const isActive = get(this.selectedFacility, 'id') === option.id;
    return (
      <Styled.Result isActive={isActive}>
        <Styled.Item>{option.name}</Styled.Item>
      </Styled.Result>
    );
  }

  render(): JSX.Element {
    return (
      <fragment>
        <DropdownMenu
          width="100%"
          options={this.facilityOptions}
          noResultText={this.$t('no_match_complete_section')}
          selectOption={this.selectFacility}
          forceOpen={this.hasSearch}
          scopedSlots={{
            menuOption: ({ option }: { option: App.DropdownMenuOption }) =>
              this.renderSearchResult(option),
          }}
        >
          <Input
            label={this.$t('business_name')}
            placeholder={this.$t('business_name')}
            name="name"
            height="48px"
            prefixIcon="search"
            iconSize="24"
            maxlength={255}
            autoTrim
            value={this.search}
            changeValue={this.handleInputSearch}
            validation="bail|required"
            validationMessages={{
              required: this.$t('validation.required', {
                field: this.$t('business_name').toLowerCase(),
              }),
            }}
          />
        </DropdownMenu>
      </fragment>
    );
  }
}
