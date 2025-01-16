import { Vue, Component, Prop, PropSync } from 'vue-property-decorator';
import { debounce } from 'lodash';
import { htmlDecode } from 'utils/helpers';
import * as Styled from './styled';

@Component({})
export default class Dropdown extends Vue {
  @Prop({ default: false }) readonly isMultiple: boolean;
  @Prop({ default: [] }) readonly options: App.DropdownOption[];
  @PropSync('value') syncValue: App.DropdownOption | App.DropdownOption[];
  @Prop({ default: '100%' }) readonly width: string;
  @Prop({ default: '40px' }) readonly height: string;
  @Prop({ default: '' }) readonly className: string;
  @Prop({ default: '' }) readonly placeholder: string;
  @Prop({ default: '' }) readonly title: string;
  @Prop({ default: 'name' }) readonly label: string;
  @Prop({ default: '' }) readonly trackBy: string;
  @Prop({ default: 300 }) readonly maxHeight: number;
  @Prop({ default: false }) readonly disabled: boolean;
  @Prop({ default: false }) readonly loading: boolean;
  @Prop({ default: true }) readonly internalSearch: boolean;
  @Prop({ default: false }) readonly required: boolean;
  @Prop({ default: true }) readonly closeOnSelect: boolean;
  @Prop({ default: true }) readonly searchable: boolean;
  @Prop({ default: true }) readonly allowEmpty: boolean;
  @Prop({ default: false }) readonly hasError: boolean;
  @Prop({ default: false }) readonly hideSelected: boolean;
  @Prop({ default: false }) readonly overflow: boolean;
  @Prop({ default: false }) readonly taggable: boolean;
  @Prop({ default: 99999 }) readonly limit: number;

  @Prop({
    default: 'default',
    validator(this, value) {
      return ['default', 'color'].includes(value);
    },
  })
  readonly type: string;
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
    if (this.searchChange) {
      this.searchChange(this.searchKey);
    }
  }

  renderSingleLabel({ option }: { option: App.DropdownOption }): JSX.Element {
    const singleLabel = this.$scopedSlots.singleLabel;
    return (
      <fragment>
        {singleLabel && singleLabel(option)}
        {!singleLabel && option[this.label]}
      </fragment>
    );
  }

  renderTag({ option }: { option: App.DropdownOption }): JSX.Element {
    if (this.taggable) {
      return <Styled.Tag>{option.name}</Styled.Tag>;
    }
    return null;
  }

  renderLimit(): JSX.Element {
    const values = this.syncValue as App.DropdownOption[];
    return (
      <fragment>
        {this.limit && <Styled.Limit>+ {values.length - 1}</Styled.Limit>}
      </fragment>
    );
  }

  renderPlaceholder(): JSX.Element {
    if (this.placeholder) {
      return (
        <Styled.Placeholder
          domProps={{
            innerHTML: htmlDecode(this.placeholder),
          }}
        />
      );
    }
  }

  renderOption({ option }: { option: App.DropdownOption }): JSX.Element {
    const optionBody = this.$scopedSlots.optionBody;
    return (
      <fragment>
        {optionBody && optionBody(option)}
        {!optionBody && (
          <Styled.Option>
            <Styled.ElementLabel type={this.type}>
              {option[this.label]}
            </Styled.ElementLabel>
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
        placeholder={this.placeholder}
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
        internal-search={this.internalSearch}
        loading={this.loading}
        multiple={this.isMultiple}
        max-height={this.maxHeight}
        limit={this.limit}
        hide-selected={this.hideSelected}
        ref="multiselect"
        vOn:search-change={this.onSearch}
        vOn:open={this.onOpenMenu}
        vOn:close={this.onCloseMenu}
        scopedSlots={{
          tag: this.renderTag,
          limit: this.renderLimit,
          singleLabel: this.renderSingleLabel,
          option: this.renderOption,
          noResult: this.renderNoResult,
          noOptions: this.renderNoOptions,
          placeholder: this.renderPlaceholder,
        }}
      />
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
        disabled={this.disabled}
      >
        {this.title && (
          <Styled.Title
            class="dropdown-label"
            domProps={{
              innerHTML: this.title,
            }}
          />
        )}
        {this.renderDropdown()}
      </Styled.Wrapper>
    );
  }
}
