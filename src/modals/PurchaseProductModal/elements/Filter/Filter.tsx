import { Vue, Component, Prop } from 'vue-property-decorator';
import * as Styled from './styled';

@Component
export default class Filter extends Vue {
  @Prop({ required: true }) filters: Purchase.LotFilterParams;
  @Prop({ required: true }) changeSortFilter: (key: string) => void;

  render(): JSX.Element {
    return (
      <Styled.Wrapper>
        <Styled.FilterContainer>
          <Styled.FilterWrapper
            sortType={this.filters.createdAt}
            vOn:click={() => this.changeSortFilter('createdAt')}
          >
            {this.$t('added_date')}{' '}
            <font-icon name="arrow_dropdown" size="24" />
          </Styled.FilterWrapper>
          <Styled.FilterWrapper
            sortType={this.filters.code}
            vOn:click={() => this.changeSortFilter('code')}
          >
            {this.$t('product_id')}{' '}
            <font-icon name="arrow_dropdown" size="24" />
          </Styled.FilterWrapper>
          <Styled.FilterWrapper>
            {this.$t('file_and_attachment')}
          </Styled.FilterWrapper>
          <Styled.FilterAction />
        </Styled.FilterContainer>
      </Styled.Wrapper>
    );
  }
}
