import { Vue, Component, Prop, Ref } from 'vue-property-decorator';
import { get, has, isEmpty } from 'lodash';
import { MATH_CALCULATION } from 'config/constants';
import { isNumber, scrollToElement } from 'utils/helpers';
import Input from './Input';
import * as Styled from './styled';
import InformationTooltip from '../InformationTooltip';

@Component
export default class InputTag extends Vue {
  @Prop({ default: [] }) value: App.DropdownOption[];
  @Prop({ default: '' }) placeholder: string;
  @Prop({ default: '' }) label: string;
  @Prop({ default: false }) hasError: boolean;
  @Prop({ default: '' })
  tooltipContent: string;
  @Prop({ default: [] }) options: App.DropdownOption[];
  @Prop({
    default: () => {
      //TODO
    },
  })
  change: (values: App.DropdownOption[]) => void;

  @Ref('calculatedInput')
  readonly calculatedInputComponent!: Vue;
  @Ref('popper')
  readonly popper!: App.Any;

  private search = '';
  private suggestIndex = 0;
  private selectedOptions: App.DropdownOption[] = [];

  get optionsDisplayed(): App.DropdownOption[] {
    if (isEmpty(this.search)) {
      return this.options;
    }
    return this.options.filter(
      ({ name }) => name.toLowerCase().indexOf(this.search.toLowerCase()) > -1,
    );
  }

  get suffixIcon(): string {
    if (!isEmpty(this.selectedOptions)) {
      return this.hasError ? 'circle_warning2' : 'check_circle';
    }
  }

  get iconColor(): string {
    return this.hasError ? 'red' : 'green';
  }

  created() {
    this.selectedOptions = this.value;
  }

  changeValue(search: string = '') {
    this.search = search;
    this.resetSuggest();
    if (isEmpty(this.optionsDisplayed)) {
      this.popper.hide();
    } else {
      this.popper.show();
    }
  }

  selectOption(option: App.DropdownOption) {
    this.selectedOptions.push(option);
    this.changeValue();
    this.change(this.selectedOptions);
    this.popper.hide();
  }

  keyDownInput(event: KeyboardEvent): void {
    switch (event.key) {
      case 'Backspace':
        this.handleRemoveTag();
        break;
      case 'ArrowUp':
        this.changeSuggestIndex(false);
        break;
      case 'ArrowDown':
        this.changeSuggestIndex();
        break;
      case 'Tab':
      case 'Enter':
        this.selectSuggest();
        event.preventDefault();
        this.$nextTick(() => {
          this.popper.hide();
        });
    }
  }

  resetSuggest() {
    this.suggestIndex = 0;
  }

  selectSuggest() {
    if (
      this.search &&
      isNumber(this.search) &&
      !MATH_CALCULATION.some(({ id }) => id === this.search)
    ) {
      this.selectedOptions.push({
        id: Number(this.search),
        name: this.search,
      });
      this.changeValue('');
      this.change(this.selectedOptions);
    } else if (has(this.optionsDisplayed, this.suggestIndex)) {
      this.selectedOptions.push(this.optionsDisplayed[this.suggestIndex]);
      this.changeValue('');
      this.change(this.selectedOptions);
    }
  }

  handleRemoveTag() {
    if (isEmpty(this.search) && !isEmpty(this.selectedOptions)) {
      this.selectedOptions.splice(-1);
      this.change(this.selectedOptions);
    }
  }

  changeSuggestIndex(isDown: boolean = true) {
    if (isDown && this.optionsDisplayed.length > this.suggestIndex + 1) {
      this.suggestIndex++;
    }
    if (!isDown && this.optionsDisplayed.length > 0 && this.suggestIndex > 0) {
      this.suggestIndex--;
    }
    this.scrollToOption();
  }

  scrollToOption() {
    if (has(this.$refs, `option_${this.suggestIndex}`)) {
      scrollToElement(
        get(this.$refs, `option_${this.suggestIndex}.$el`) as HTMLElement,
      );
    }
  }

  focusInput() {
    const input = this.calculatedInputComponent.$el.querySelector('input');
    input.focus();
  }

  renderTags(): JSX.Element {
    return (
      <fragment>
        {this.selectedOptions.map(({ name }) => (
          <Styled.Tag>{name}</Styled.Tag>
        ))}
      </fragment>
    );
  }

  renderOptions(): JSX.Element {
    return (
      <Styled.Options slot="popover">
        <perfect-scrollbar>
          {this.optionsDisplayed.map((option, index) => (
            <Styled.OptionName
              ref={`option_${index}`}
              isActive={this.suggestIndex === index}
              vOn:click={(e: Event) => {
                e.stopPropagation();
                this.selectOption(option);
              }}
            >
              {option.name}
            </Styled.OptionName>
          ))}
        </perfect-scrollbar>
      </Styled.Options>
    );
  }

  renderPopper(): JSX.Element {
    return (
      <v-popover
        trigger="click"
        placement="top-start"
        container={false}
        ref="popper"
      >
        <Styled.InputTagContent
          hasError={this.hasError}
          vOn:click={this.focusInput}
        >
          <Styled.InputTag>
            {this.renderTags()}
            <Input
              ref="calculatedInput"
              name="search"
              value={this.search}
              placeholder={this.placeholder}
              changeValue={this.changeValue}
              keyDownInput={this.keyDownInput}
            />
          </Styled.InputTag>

          {this.suffixIcon && (
            <font-icon
              name={this.suffixIcon}
              color={this.iconColor}
              size="24"
            />
          )}
        </Styled.InputTagContent>

        {this.renderOptions()}
      </v-popover>
    );
  }

  render(): JSX.Element {
    return (
      <Styled.InputTagContainer>
        <Styled.Label>
          {this.label}
          {this.tooltipContent && (
            <InformationTooltip
              placement="top-center"
              tooltipContent={this.tooltipContent}
            >
              <font-icon
                name="circle_warning"
                color="spunPearl"
                size="14"
                slot="content"
              />
            </InformationTooltip>
          )}
        </Styled.Label>
        {this.renderPopper()}
      </Styled.InputTagContainer>
    );
  }
}
