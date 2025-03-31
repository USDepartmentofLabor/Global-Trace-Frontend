import { Vue, Component, Prop } from 'vue-property-decorator';
import { isEmpty } from 'lodash';
import { roleIconsOptions } from 'utils/icon';
import * as Styled from './styled';

@Component
export default class Icons extends Vue {
  @Prop({ default: '' }) search: string;
  @Prop({ default: '' }) currentIcon: App.DropdownOption;
  @Prop({
    type: Function,
    default: () => {
      //
    },
  })
  readonly setCurrentIconValue: (value: App.DropdownOption) => void;

  private icons: App.DropdownOption[] = roleIconsOptions;

  get previewIcons(): App.DropdownOption[] {
    if (!this.search) {
      return this.icons;
    }
    return this.icons.filter(
      (option) =>
        option.name.toLowerCase().indexOf(this.search.toLowerCase()) > -1 ||
        option.value.toLowerCase().indexOf(this.search.toLowerCase()) > -1,
    );
  }

  get iconValue(): string {
    if (this.previewIcons.length <= 1) {
      return this.$t('value_icon', { value: this.previewIcons.length });
    }
    return this.$t('value_icons', { value: this.previewIcons.length });
  }

  renderEmpty(): JSX.Element {
    return (
      <Styled.EmptyContainer>
        <Styled.EmptyImage />
        <text-direction>
          <Styled.EmptyText
            domProps={{
              innerHTML: this.$t('no_result_for', { value: this.search }),
            }}
          />
        </text-direction>
      </Styled.EmptyContainer>
    );
  }

  renderContent(): JSX.Element {
    return (
      <fragment>
        {this.previewIcons.map((icon) => (
          <Styled.IconContent
            isActivated={this.currentIcon?.id === icon.id}
            vOn:click={() => this.setCurrentIconValue(icon)}
          >
            <font-icon name={icon.id} color="stormGray" size="20" />
            <Styled.IconName>{icon.name}</Styled.IconName>
          </Styled.IconContent>
        ))}
      </fragment>
    );
  }

  render(): JSX.Element {
    return (
      <Styled.IconsWrapper>
        <Styled.IconValue>{this.iconValue}</Styled.IconValue>
        {isEmpty(this.previewIcons) && this.renderEmpty()}
        <perfect-scrollbar>
          <Styled.IconsGrid>{this.renderContent()}</Styled.IconsGrid>
        </perfect-scrollbar>
      </Styled.IconsWrapper>
    );
  }
}
