import { Vue, Component, Prop } from 'vue-property-decorator';
import LanguageDropdown from 'components/FormUI/Dropdown/LanguageDropdown';
import MasterLayout from './MasterLayout';
import * as Styled from './styled';

@Component
export default class GuestLayout extends Vue {
  @Prop({ default: true }) isShowLogo: boolean;
  @Prop({
    default: 'medium',
    validator(this, value) {
      return ['large', 'medium'].includes(value);
    },
  })
  readonly logoSize: string;
  @Prop({ default: true }) isShowLanguageDropdown: boolean;

  renderLogo(): JSX.Element {
    if (this.isShowLogo) {
      return (
        <Styled.LogoContainer size={this.logoSize}>
          <Styled.Logo />
        </Styled.LogoContainer>
      );
    }
    return null;
  }

  render(): JSX.Element {
    return (
      <MasterLayout>
        <Styled.GuestLayout>
          {this.isShowLanguageDropdown && (
            <Styled.LanguageDropdown>
              <LanguageDropdown />
            </Styled.LanguageDropdown>
          )}
          <Styled.GuestContainer>{this.$slots.default}</Styled.GuestContainer>
          {this.renderLogo()}
        </Styled.GuestLayout>
      </MasterLayout>
    );
  }
}
