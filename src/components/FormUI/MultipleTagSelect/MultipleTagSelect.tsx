import { Vue, Component, Prop, PropSync } from 'vue-property-decorator';
import { debounce } from 'lodash';
import * as Styled from './styled';

@Component({})
export default class MultipleTagSelect extends Vue {
  @Prop({ default: [] }) readonly options: App.DropdownOption[];
  @PropSync('value') syncValue: App.DropdownOption[];
  @Prop({ default: '100%' }) readonly width: string;
  @Prop({ default: '40px' }) readonly height: string;
  @Prop({ default: '' }) readonly className: string;
  @Prop({ default: '' }) readonly placeholder: string;
  @Prop({ default: '' }) readonly title: string;
  @Prop({ default: 'name' }) readonly label: string;
  @Prop({ default: 'id' }) readonly trackBy: string;
  @Prop({ default: 300 }) readonly maxHeight: number;
  @Prop({ default: false }) readonly disabled: boolean;
  @Prop({ default: false }) readonly loading: boolean;
  @Prop({ default: false }) readonly required: boolean;
  @Prop({ default: true }) readonly closeOnSelect: boolean;
  @Prop({ default: true }) readonly searchable: boolean;
  @Prop({ default: true }) readonly allowEmpty: boolean;
  @Prop({ default: false }) readonly hasError: boolean;
  @Prop({ default: true }) readonly hideSelected: boolean;
  @Prop({ default: false }) readonly overflow: boolean;
  @Prop({
    default: () => {
      //
    },
  })
  searchChange: (value: string) => void;
  @Prop({
    default: () => {
      //
    },
  })
  changeOptionValue: (
    option: App.DropdownOption | App.DropdownOption[],
  ) => void;
  @Prop({
    default: () => {
      //
    },
  })
  removeOptionValue: (option: App.DropdownOption) => void;

  private isTouched: boolean = false;
  private isOpenMenu: boolean = false;
  private searchKey: string = '';

  created(): void {
    this.debounceSearch = debounce(this.debounceSearch, 500);
  }

  get isInvalid(): boolean {
    if (this.hasError || (this.required && this.isTouched)) {
      return this.syncValue == null;
    }
    return false;
  }

  get hasValue(): boolean {
    if (this.syncValue instanceof Array) {
      return this.syncValue.length !== 0;
    }
    return !!this.syncValue;
  }

  getTagName(option: App.DropdownOption): JSX.Element {
    const tagName = this.$scopedSlots.tagName;
    return (
      <fragment>
        {tagName && tagName({ option })}
        {!tagName && option.name}
      </fragment>
    );
  }

  onSelect(option: App.DropdownOption | App.DropdownOption[]): void {
    if (this.changeOptionValue) {
      this.changeOptionValue(option);
      this.isTouched = true;
    }
  }

  onOpenMenu(): void {
    this.isOpenMenu = true;
  }

  onCloseMenu(): void {
    this.isOpenMenu = false;
    this.isTouched = true;
  }

  onSearch(value: string): void {
    this.searchKey = value;
    this.debounceSearch();
  }

  debounceSearch(): void {
    this.searchChange && this.searchKey && this.searchChange(this.searchKey);
  }

  onRemoveTag(option: App.DropdownOption) {
    if (this.removeOptionValue) {
      this.removeOptionValue(option);
      this.isTouched = true;
    }
  }

  renderTag(): JSX.Element {
    return <fragment />;
  }

  renderOption({ option }: { option: App.DropdownOption }): JSX.Element {
    const optionBody = this.$scopedSlots.optionBody;
    return (
      <fragment>
        {optionBody && optionBody({ option })}
        {!optionBody && (
          <Styled.Option>
            <Styled.ElementLabel>{option[this.label]}</Styled.ElementLabel>
            <Styled.ElementTier>{option.tier}</Styled.ElementTier>
          </Styled.Option>
        )}
      </fragment>
    );
  }

  renderNoOptions(): JSX.Element {
    return <Styled.NoResult>{this.$t('no_option')}</Styled.NoResult>;
  }

  renderNoResult(): JSX.Element {
    return <Styled.NoResult>{this.$t('data_not_found')}</Styled.NoResult>;
  }

  renderDropdown(): JSX.Element {
    return (
      <multiselect
        vModel={this.syncValue}
        vOn:input={this.onSelect}
        placeholder={this.$t(this.placeholder)}
        disabled={this.disabled}
        show-labels={false}
        allow-empty={this.allowEmpty}
        searchable={this.searchable}
        options={this.options}
        label={this.label}
        class={this.className}
        v-overflow={this.overflow}
        track-by={this.trackBy}
        close-on-select={this.closeOnSelect}
        internal-search
        loading={this.loading}
        multiple={true}
        max-height={this.maxHeight}
        hide-selected={this.hideSelected}
        ref="multiselect"
        vOn:search-change={this.onSearch}
        vOn:open={this.onOpenMenu}
        vOn:close={this.onCloseMenu}
        scopedSlots={{
          tag: this.renderTag,
          option: this.renderOption,
          noResult: this.renderNoResult,
          noOptions: this.renderNoOptions,
        }}
      />
    );
  }

  renderSelected(): JSX.Element {
    return (
      this.syncValue.length > 0 && (
        <Styled.SelectedWrapper>
          {this.syncValue.map((option: App.DropdownOption) => {
            return (
              <Styled.Tag>
                {this.getTagName(option)}
                <Styled.RemoveIcon vOn:click={() => this.onRemoveTag(option)}>
                  <font-icon name="close_circle" size="15" color="envy" />
                </Styled.RemoveIcon>
              </Styled.Tag>
            );
          })}
          {this.syncValue.length === 1 && (
            <Styled.SuggestionText>
              {this.$t('add_more_business_partners')}
            </Styled.SuggestionText>
          )}
        </Styled.SelectedWrapper>
      )
    );
  }

  render(): JSX.Element {
    return (
      <Styled.Wrapper
        hasValue={this.hasValue}
        width={this.width}
        height={this.height}
        isOpenMenu={this.isOpenMenu}
        validation={this.isInvalid}
        loading={this.loading}
      >
        {this.title && <Styled.Title>{this.title}</Styled.Title>}
        <Styled.SearchIcon>
          <font-icon name="search" size="24" color="envy" />
        </Styled.SearchIcon>
        {this.renderDropdown()}
        {this.renderSelected()}
      </Styled.Wrapper>
    );
  }
}
