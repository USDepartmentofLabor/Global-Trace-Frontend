import { Vue, Component, Prop, Ref } from 'vue-property-decorator';
import { roleIconsOptions } from 'utils/icon';
import * as Styled from './styled';
import Header from './elements/Header';
import Icons from './elements/Icons';

@Component
export default class IconDropdown extends Vue {
  @Prop({ default: '' }) value: string;
  @Prop({
    type: Function,
    default: () => {
      //
    },
  })
  readonly success: (value: App.DropdownOption) => void;

  @Ref('popper')
  readonly popper!: App.Any;

  private search = '';
  private currentIcon: App.DropdownOption = null;

  created() {
    if (this.value) {
      this.currentIcon = roleIconsOptions.find(({ id }) => id === this.value);
    }
  }

  changeSearch(value: string) {
    this.search = value;
  }

  setCurrentIconValue(option: App.DropdownOption) {
    this.currentIcon = option;
    this.success(option);
    this.popper.hide();
  }

  renderCurrentIcon(): JSX.Element | string {
    if (this.currentIcon) {
      return (
        <font-icon name={this.currentIcon.id} size="20" color="stormGray" />
      );
    }
    return this.$t('select_icon');
  }

  renderInput(): JSX.Element {
    return (
      <Styled.InputContainer>
        <Styled.Label>
          {this.$t('select_icon')}
          <Styled.Optional>({this.$t('optional')})</Styled.Optional>
        </Styled.Label>
        <Styled.Input isActivated={Boolean(this.currentIcon)}>
          {this.renderCurrentIcon()}
          <font-icon name="arrow_dropdown" color="highland" size="24" />
        </Styled.Input>
      </Styled.InputContainer>
    );
  }

  renderContent(): JSX.Element {
    return (
      <Styled.Content slot="popover">
        <Header changeSearch={this.changeSearch} />
        <Icons
          search={this.search}
          currentIcon={this.currentIcon}
          setCurrentIconValue={this.setCurrentIconValue}
        />
      </Styled.Content>
    );
  }

  render(): JSX.Element {
    return (
      <v-popover
        trigger="click"
        placement="bottom-start"
        container="body"
        openClass="overwrite-popper shadow-popper"
        autoHide
        ref="popper"
      >
        {this.renderInput()}
        {this.renderContent()}
      </v-popover>
    );
  }
}
