import { Vue, Component, Prop } from 'vue-property-decorator';
import { isEmpty } from 'lodash';
import Input from 'components/FormUI/Input';
import SpinLoading from 'components/Loaders/SpinLoading';
import * as Styled from './styled';

@Component
export default class DropdownMenu extends Vue {
  @Prop({ default: 'auto' }) readonly width: string;
  @Prop({ default: '' }) readonly noResultText: string;
  @Prop({ default: false }) allowSearch: boolean;
  @Prop({ default: false }) forceOpen: boolean;
  @Prop({ default: false }) isLoading: boolean;
  @Prop({ type: Array, default: (): App.DropdownMenuOption[] => [] })
  readonly options: App.DropdownMenuOption[];
  @Prop({
    type: Function,
    default: () => {
      //
    },
  })
  selectOption: (option: App.DropdownMenuOption) => void;

  private isOpen: boolean = false;
  private search: string = '';

  get filteredOptions(): App.DropdownMenuOption[] {
    if (!this.search) {
      return this.options;
    }
    return this.options.filter(
      (option) =>
        option.name.toLowerCase().indexOf(this.search.toLowerCase()) > -1,
    );
  }

  get isEmptyOptions(): boolean {
    return isEmpty(this.filteredOptions);
  }

  get hasContent(): boolean {
    return this.allowSearch || !this.isEmptyOptions;
  }

  get showPopup(): boolean {
    return this.isOpen && (this.forceOpen || this.hasContent);
  }

  toggle(): void {
    this.isOpen = !this.isOpen;
  }

  setIsOpen(value: boolean): void {
    this.isOpen = value;
  }

  renderOptions(): JSX.Element {
    return (
      <Styled.List>
        <perfect-scrollbar>
          {this.filteredOptions.map((option, idx) => (
            <Styled.Option
              key={idx}
              onClick={() => {
                this.selectOption(option);
              }}
            >
              {this.$scopedSlots.menuOption({ option })}
            </Styled.Option>
          ))}
        </perfect-scrollbar>
      </Styled.List>
    );
  }

  renderSearch(): JSX.Element {
    return (
      <Styled.Search>
        <Input
          height="32px"
          name="search"
          size="large"
          value={this.search}
          placeholder={this.$t('search')}
          changeValue={(value: string) => {
            this.search = value;
          }}
          suffixIcon="search"
        />
      </Styled.Search>
    );
  }

  renderEmpty(): JSX.Element {
    return <Styled.Empty>{this.noResultText}</Styled.Empty>;
  }

  renderLoading(): JSX.Element {
    return (
      <Styled.Loading>
        <SpinLoading size={12} />
      </Styled.Loading>
    );
  }

  renderContent(): JSX.Element {
    return (
      <fragment>
        {this.isEmptyOptions ? this.renderEmpty() : this.renderOptions()}
      </fragment>
    );
  }

  renderPopup(): JSX.Element {
    return (
      <fragment>
        <Styled.Popup>
          {this.allowSearch && this.renderSearch()}
          <Styled.Menu onClick={this.toggle}>
            {this.isLoading && this.renderLoading()}
            {!this.isLoading && this.renderContent()}
          </Styled.Menu>
        </Styled.Popup>

        <Styled.Backdrop onClick={this.toggle}></Styled.Backdrop>
      </fragment>
    );
  }

  render(): JSX.Element {
    return (
      <Styled.Wrapper width={this.width}>
        <Styled.Toggle
          isOpen={this.isOpen}
          onClick={() => this.setIsOpen(true)}
        >
          {this.$slots.default}
        </Styled.Toggle>
        {this.showPopup && this.renderPopup()}
      </Styled.Wrapper>
    );
  }
}
