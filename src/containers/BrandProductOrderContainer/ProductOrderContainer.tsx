import { Component, Mixins } from 'vue-property-decorator';
import * as Styled from './styled';
import TraceProductMixin from './TraceProductMixin';

@Component
export default class ProductOrderContainer extends Mixins(TraceProductMixin) {
  render(): JSX.Element {
    return (
      <Styled.Container>
        {this.isLoading ? (
          this.renderLoading()
        ) : (
          <Styled.Wrapper>
            <Styled.Title>{this.$t('trace_product')}</Styled.Title>
            {this.hasData ? this.renderDataTable() : this.renderAddNewOrder()}
          </Styled.Wrapper>
        )}
      </Styled.Container>
    );
  }
}
