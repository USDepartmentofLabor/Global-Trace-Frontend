import { Vue, Component, Prop } from 'vue-property-decorator';
import { get, head } from 'lodash';
import appModule from 'store/modules/app';
import { LOCALES } from 'config/constants';
import { hasUrduCharacter } from 'utils/translation';
import * as Styled from './styled';

@Component
export default class TextDirection extends Vue {
  @Prop({
    default: null,
  })
  locale: string;

  private isRight = false;

  get currentLocale(): string {
    return appModule.locale;
  }

  updateDirection() {
    const el = head(this.$slots.default);
    const text = get(el, 'elm.textContent');
    if (text && !hasUrduCharacter(text)) {
      this.isRight = false;
    } else {
      const locale = this.locale || this.currentLocale;
      this.isRight = locale && locale === LOCALES.UR;
    }
  }

  mounted() {
    this.updateDirection();
  }

  render(): JSX.Element {
    return (
      <Styled.Wrapper isRight={this.isRight}>
        {this.$slots.default}
      </Styled.Wrapper>
    );
  }
}
