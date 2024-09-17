import { Vue, Component, Prop } from 'vue-property-decorator';
import { isEmpty, get, debounce } from 'lodash';
import DropdownMenu from 'components/DropdownMenu';
import { getFacilities } from 'api/grievance-report';
import { handleError } from 'components/Toast';
import Input from 'components/FormUI/Input';
import * as Styled from './styled';

@Component
export default class FacilitySearchBox extends Vue {
  @Prop({ default: null }) selectedFacility: GrievanceReport.Category;
  @Prop({ required: true }) setFacility: (
    facility: GrievanceReport.Facility,
  ) => void;
  @Prop({ required: true }) changeSearch: (value: string) => void;

  private disableChangeSearch: boolean = false;
  private search: string = '';
  private facilities: GrievanceReport.Facility[] = [];
  private isLoading: boolean = false;
  private abortController: AbortController = null;

  get facilityOptions(): App.DropdownMenuOption[] {
    const results = this.facilities.filter(
      (facility) => !isEmpty(facility.name),
    );
    return results.map(({ id, name }) => ({
      id,
      name,
    }));
  }

  created(): void {
    this.getSupplierList();
    this.onDebouncedSearch = debounce(this.onDebouncedSearch, 300);
  }

  async getSupplierList(search: string = ''): Promise<void> {
    try {
      this.isLoading = true;
      this.abortController = new AbortController();
      const signal = this.abortController.signal;
      this.facilities = await getFacilities(search, signal);
    } catch (error) {
      if (error) {
        handleError(error as App.ResponseError);
      }
    } finally {
      this.isLoading = false;
      this.abortController = null;
    }
  }

  onDebouncedSearch(value: string): void {
    if (this.abortController) {
      this.abortController.abort();
    }
    this.getSupplierList(value);
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

  selectFacility(option: App.DropdownMenuOption): void {
    const facility = this.facilityOptions.find(({ id }) => id === option.id);
    this.disableChangeSearch = true;
    this.search = facility.name;
    const selectedFacility = this.facilities.find(({ id }) => id === option.id);
    this.setFacility(selectedFacility);
  }

  renderSearchResult(option: App.DropdownMenuOption): JSX.Element {
    const isActive = get(this.selectedFacility, 'id') === option.id;
    return (
      <Styled.Result isActive={isActive}>
        <Styled.Item class="label">{option.name}</Styled.Item>
      </Styled.Result>
    );
  }

  render(): JSX.Element {
    return (
      <Styled.Container>
        <DropdownMenu
          width="100%"
          options={this.facilityOptions}
          noResultText={this.$t('no_result')}
          selectOption={this.selectFacility}
          isLoading={this.isLoading}
          forceOpen
          scopedSlots={{
            menuOption: ({ option }: { option: App.DropdownMenuOption }) =>
              this.renderSearchResult(option),
          }}
        >
          <Input
            label={this.$t('createReportModal.facility')}
            name="search"
            placeholder={this.$t('createReportModal.facility_placeholder')}
            height="48px"
            iconSize="24"
            prefixIcon="search"
            value={this.search}
            changeValue={this.handleInputSearch}
          />
        </DropdownMenu>
      </Styled.Container>
    );
  }
}
