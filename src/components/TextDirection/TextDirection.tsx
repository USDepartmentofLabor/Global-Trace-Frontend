import { Vue, Component, Prop } from 'vue-property-decorator';
import appModule from 'store/modules/app';
import { LOCALES } from 'config/constants';
import * as Styled from './styled';

@Component
export default class TextDirection extends Vue {
  @Prop({
    default: null,
  })
  locale: string;

  get currentLocale(): string {
    return appModule.locale;
  }

  get isRight(): boolean {
    if (this.locale) {
      return this.locale === LOCALES.UR;
    }
    return this.currentLocale === LOCALES.UR;
  }

  render(): JSX.Element {
    return (
      <Styled.Wrapper isRight={this.isRight}>
        {this.$slots.default}
      </Styled.Wrapper>
    );
  }
}
