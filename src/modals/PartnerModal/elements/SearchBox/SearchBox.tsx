import { Vue, Component, Prop } from 'vue-property-decorator';
import { debounce, get } from 'lodash';
import { UserRoleEnum } from 'enums/user';
import {
  getPartnerFacilities,
  getPartnerTransporters,
  getPartnerBrokers,
  getBusinessPartnerBrokers,
} from 'api/onboard';
import { PartnerTypeEnum } from 'enums/onboard';
import auth from 'store/modules/auth';
import { getUserRole } from 'utils/user';
import DropdownMenu from 'components/DropdownMenu';
import Input from 'components/FormUI/Input';
import * as Styled from './styled';

@Component
export default class SearchBox extends Vue {
  @Prop({ required: true }) type: PartnerTypeEnum;
  @Prop({ default: null }) facility: Auth.Facility;
  @Prop() setFacility: (facility: Auth.Facility) => void;
  @Prop() changeSearch: (value: string) => void;

  private hasSearch: boolean = false;

  get user(): Auth.User {
    return auth.user;
  }

  get userRole(): Auth.User {
    return getUserRole(this.user);
  }

  private disableChangeSearch: boolean = false;
  private search: string = '';
  private searchedFacilities: Auth.Facility[] = [];

  get searchResult(): App.DropdownMenuOption[] {
    return this.searchedFacilities.map((facility) => ({
      id: facility.id,
      name: facility.name,
      descriptions: [
        facility.oarId ? `${this.$t('os_id')}: ${facility.oarId}` : null,
        facility.businessRegisterNumber
          ? `${this.$t('reg_no')}: ${facility.businessRegisterNumber}`
          : null,
      ],
    }));
  }

  created(): void {
    this.onDebouncedSearch = debounce(this.onDebouncedSearch, 300);
    this.onDebouncedSearch('');
  }

  handleInputSearch(value: string): void {
    this.search = value;
    this.onDebouncedSearch(value);
    if (!this.disableChangeSearch) {
      this.changeSearch(value);
    } else {
      this.disableChangeSearch = false;
    }
  }

  partnerType(): string | null {
    switch (this.type) {
      case PartnerTypeEnum.BROKER:
        return UserRoleEnum.BROKER.toString();
      case PartnerTypeEnum.PROCESSING_FACILITY:
        if (this.userRole.name === UserRoleEnum.SPINNER) {
          return [UserRoleEnum.GINNER, UserRoleEnum.MILL].join(';');
        }
        return UserRoleEnum.SPINNER.toString();
      case PartnerTypeEnum.TRANSPORTER:
        return UserRoleEnum.TRANSPORTER.toString();
      default:
        return null;
    }
  }

  onDebouncedSearch(value: string): void {
    let getPartners;
    switch (this.type) {
      case PartnerTypeEnum.BROKER:
        getPartners = getPartnerBrokers;
        break;
      case PartnerTypeEnum.TRANSPORTER:
        getPartners = getPartnerTransporters;
        break;
      case PartnerTypeEnum.TRANSFORMATION_PARTNER:
        getPartners = getBusinessPartnerBrokers;
        break;
      default:
        getPartners = getPartnerFacilities;
        break;
    }

    getPartners({
      key: value,
    }).then((result: Auth.Facility[]) => {
      this.searchedFacilities = result;
      this.updateHasSearch(result.length > 0);
    });
  }

  updateHasSearch(hasSearch: boolean): void {
    if (!this.hasSearch) {
      this.hasSearch = hasSearch;
    }
  }

  selectResult(option: App.DropdownMenuOption): void {
    const facility = this.searchedFacilities.find(({ id }) => id === option.id);
    this.disableChangeSearch = true;
    this.search = facility.name;
    this.setFacility(facility);
  }

  renderSearchResult(option: App.DropdownMenuOption): JSX.Element {
    const isActive = get(this.facility, 'id') === option.id;
    return (
      <Styled.Result isActive={isActive}>
        <Styled.Label class="label">{option.name}</Styled.Label>
        {option.descriptions.map(
          (description) =>
            description && (
              <Styled.SubLabel class="sub-label">{description}</Styled.SubLabel>
            ),
        )}
      </Styled.Result>
    );
  }

  render(): JSX.Element {
    return (
      <Styled.PartnerInfoContainer>
        <DropdownMenu
          options={this.searchResult}
          noResultText={this.$t('no_match')}
          selectOption={this.selectResult}
          forceOpen={this.hasSearch}
          width="100%"
          scopedSlots={{
            menuOption: ({ option }: { option: App.DropdownMenuOption }) =>
              this.renderSearchResult(option),
          }}
        >
          <Styled.SearchInput>
            <Input
              width="100%"
              height="48px"
              name="search"
              size="large"
              value={this.search}
              label={this.$t(`partnerModal.${this.type}_search_label`)}
              placeholder={this.$t(`${this.type}_search_placeholder`)}
              changeValue={(value: string) => {
                this.handleInputSearch(value);
              }}
              suffixIcon="search"
            />
          </Styled.SearchInput>
        </DropdownMenu>
        <Styled.Line />
      </Styled.PartnerInfoContainer>
    );
  }
}
