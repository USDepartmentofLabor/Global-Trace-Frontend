import { Vue, Component, Prop } from 'vue-property-decorator';
import { debounce, get, head, isEmpty } from 'lodash';
import { CIDAttributesEnum, RoleAttributeTypeEnum } from 'enums/role';
import auth from 'store/modules/auth';
import { searchCID } from 'api/onboard';
import { getUserRole } from 'utils/user';
import { handleError } from 'components/Toast';
import location from 'store/modules/location';
import DropdownMenu from 'components/DropdownMenu';
import Input from 'components/FormUI/Input';
import MessageError from 'components/FormUI/MessageError';
import * as Styled from './styled';
import CIDInfo from './CIDInfo';

@Component
export default class CID extends Vue {
  @Prop({ default: false }) readonly isEdit: boolean;
  @Prop({ required: true }) readonly userInfo: Auth.User;
  @Prop({ default: null }) readonly messageErrors: App.MessageError;
  @Prop({
    default: () => {
      //
    },
  })
  changeInput: () => void;
  @Prop() update: (params: Onboard.RoleAttributeParams[]) => void;
  @Prop({ default: false }) readonly disabled: boolean;

  private hasSearch: boolean = false;
  private formInput: Onboard.CIDParams = {
    facilityId: '',
    facilityName: '',
    metal: '',
    countryLocation: '',
    stateProvinceRegion: '',
  };
  private disableChangeSearch: boolean = false;
  private search: string = '';
  private result: Array<Onboard.RoleAttributeParams[]> = [];
  private searchedFacilities: App.DropdownMenuOption[] = [];
  private currentValue: Onboard.RoleAttributeParams[] = [];

  get countries(): Location.Country[] {
    return location.countries;
  }

  get formName(): string {
    return this.$formulate.registry.keys().next().value;
  }

  get user(): Auth.User {
    return auth.user;
  }

  get userRole(): Auth.User {
    return getUserRole(this.user);
  }

  get searchResult(): App.DropdownMenuOption[] {
    return this.searchedFacilities.map((facility) => ({
      id: facility.id,
      name: facility.name,
      descriptions: facility.descriptions,
    }));
  }

  get roleAttributes(): Auth.RoleAttribute[] {
    const { roleAttributes } = this.userInfo;
    return roleAttributes[RoleAttributeTypeEnum.RMI_CID];
  }

  created(): void {
    this.getCountries(() => {
      this.onDebouncedSearch = debounce(this.onDebouncedSearch, 300);
      this.initData();
    });
  }

  getAttribute(attributeName: CIDAttributesEnum): Auth.RoleAttribute {
    return this.roleAttributes.find(
      ({ attribute }) => attribute.name === attributeName,
    );
  }

  getCountries(onSuccess?: () => void): void {
    location.getCountries({
      callback: {
        onSuccess: onSuccess,
        onFailure: (error: App.ResponseError) => {
          handleError(error);
        },
      },
    });
  }

  initData(): void {
    const { roleAttributes } = this.userInfo;
    const attributes = roleAttributes[RoleAttributeTypeEnum.RMI_CID];
    const facilityIdAttribute = this.getAttribute(
      CIDAttributesEnum.FACILITY_ID,
    );
    const value = get(facilityIdAttribute, 'value', '');
    if (value) {
      this.search = value;
      this.currentValue = attributes;
    }
    this.onDebouncedSearch(value);
  }

  handleInputSearch(value: string): void {
    this.search = value;
    this.onDebouncedSearch(value);
    if (!this.disableChangeSearch) {
      this.update([]);
    } else {
      this.disableChangeSearch = false;
    }
    this.changeInput();
  }

  onDebouncedSearch(value: string): void {
    searchCID(value).then((result: Array<Onboard.RoleAttributeParams[]>) => {
      this.result = result;
      if (!isEmpty(result)) {
        this.searchedFacilities = result.map((item) => {
          const facilityIdAttribute = this.getAttribute(
            CIDAttributesEnum.FACILITY_ID,
          );
          const facilityId = item.find(
            ({ attributeId }) =>
              facilityIdAttribute.attributeId === attributeId,
          );

          const facilityNameAttribute = this.getAttribute(
            CIDAttributesEnum.FACILITY_NAME,
          );
          const facilityName = item.find(
            ({ attributeId }) =>
              facilityNameAttribute.attributeId === attributeId,
          );

          const metalAttribute = this.getAttribute(CIDAttributesEnum.METAL);
          const metal = item.find(
            ({ attributeId }) => metalAttribute.attributeId === attributeId,
          );

          const address = this.getFullAddress(item);
          return {
            id: get(facilityId, 'value', ''),
            name: get(facilityId, 'value', ''),
            descriptions: [
              get(facilityName, 'value', ''),
              get(metal, 'value', ''),
              address,
            ],
          };
        });
      } else {
        this.searchedFacilities = [];
      }

      this.updateHasSearch(result.length > 0);
    });
  }

  updateCIDAttribute(): void {
    const addressAttribute = this.getAttribute(CIDAttributesEnum.ADDRESS);
    const params = this.currentValue.map((attribute) => {
      if (attribute.attributeId === addressAttribute.attributeId) {
        attribute.value = this.formInput.stateProvinceRegion;
      }
      return attribute;
    });
    this.update(params);
  }

  getFullAddress(item: Onboard.RoleAttributeParams[]): string {
    const addressAttribute = this.getAttribute(CIDAttributesEnum.ADDRESS);
    let addressValue = '';
    if (addressAttribute) {
      const address = item.find(
        ({ attributeId }) => addressAttribute.attributeId === attributeId,
      );
      addressValue = get(address, 'value');
    }

    const countryAttribute = this.getAttribute(CIDAttributesEnum.COUNTRY);
    const country = item.find(
      ({ attributeId }) => countryAttribute.attributeId === attributeId,
    );
    const countryValue = this.getCountryNameById(get(country, 'value'));
    return [addressValue, countryValue]
      .filter((item) => !isEmpty(item))
      .join(',');
  }

  getCountryNameById(countryId: string): string {
    if (countryId) {
      return get(
        location.countries.find(({ id }) => id === countryId),
        'country',
      );
    }
    return '';
  }

  updateHasSearch(hasSearch: boolean): void {
    if (!this.hasSearch) {
      this.hasSearch = hasSearch;
    }
  }

  selectResult(option: App.DropdownMenuOption): void {
    this.currentValue = [];
    const facility = this.searchedFacilities.find(({ id }) => id === option.id);
    this.disableChangeSearch = true;
    this.search = facility.name;
    const cidResponse = this.result.find((items) =>
      items.some(({ value }) => value === option.id),
    );
    if (!isEmpty(cidResponse)) {
      this.update(cidResponse);
      this.$nextTick(() => {
        this.currentValue = cidResponse;
      });
    }
  }

  renderSearchResult(option: App.DropdownMenuOption): JSX.Element {
    const isActive = this.search === option.id;
    return (
      <Styled.Result isActive={isActive}>
        <Styled.InputLabel class="label">{option.name}</Styled.InputLabel>
        {option.descriptions &&
          option.descriptions.map(
            (description) =>
              description && (
                <Styled.SubLabel class="sub-label">
                  {description}
                </Styled.SubLabel>
              ),
          )}
      </Styled.Result>
    );
  }

  renderInputSearch(): JSX.Element {
    return (
      <Styled.Column>
        <DropdownMenu
          width="100%"
          options={this.searchResult}
          noResultText={this.$t('no_match')}
          selectOption={this.selectResult}
          forceOpen={this.hasSearch}
          scopedSlots={{
            menuOption: ({ option }: { option: App.DropdownMenuOption }) =>
              this.renderSearchResult(option),
          }}
        >
          <Input
            width="100%"
            height="48px"
            name="search"
            size="large"
            value={this.search}
            label={this.$t('facility_id')}
            placeholder={this.$t('facility_id')}
            disabled={this.disabled}
            changeValue={(value: string) => {
              this.handleInputSearch(value);
            }}
            suffixIcon="search"
          />
        </DropdownMenu>
        {this.messageErrors && (
          <MessageError
            field={get(head(this.roleAttributes), 'attributeId')}
            messageErrors={this.messageErrors}
          />
        )}
      </Styled.Column>
    );
  }

  render(): JSX.Element {
    return (
      <Styled.Group>
        <Styled.SubTitle>
          {this.$t('responsible_minerals_initiative_rmap_id')}
        </Styled.SubTitle>
        <formulate-form
          v-model={this.formInput}
          name="CID"
          scopedSlots={{
            default: () => {
              return (
                <Styled.BusinessInformation column={this.isEdit ? 3 : 2}>
                  {this.renderInputSearch()}
                  {!isEmpty(this.currentValue) && (
                    <CIDInfo
                      formName="CID"
                      roleAttributes={this.roleAttributes}
                      data={this.currentValue}
                      messageErrors={this.messageErrors}
                      changeInput={this.updateCIDAttribute}
                    />
                  )}
                </Styled.BusinessInformation>
              );
            },
          }}
        />
      </Styled.Group>
    );
  }
}
