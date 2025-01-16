import { Vue, Component, Prop } from 'vue-property-decorator';
import Input from 'components/FormUI/Input';
import * as Styled from './styled';

@Component
export default class Header extends Vue {
  @Prop({
    type: Function,
    default: () => {
      //
    },
  })
  readonly changeSearch: (value: string) => void;

  private search = '';
  handleInputSearch(value: string) {
    this.search = value;
    this.changeSearch(value);
  }

  render(): JSX.Element {
    return (
      <Styled.Header>
        <Styled.HeaderLeft>
          <Styled.Title>{this.$t('icons')}</Styled.Title>
          <Styled.SubTitle>{this.$t('search_and_select_icon')}</Styled.SubTitle>
        </Styled.HeaderLeft>
        <Input
          width="240px"
          height="48px"
          name="search"
          size="large"
          value={this.search}
          placeholder={this.$t('search_by_keyword')}
          changeValue={(value: string) => {
            this.handleInputSearch(value);
          }}
          prefixIcon="search"
        />
      </Styled.Header>
    );
  }
}
