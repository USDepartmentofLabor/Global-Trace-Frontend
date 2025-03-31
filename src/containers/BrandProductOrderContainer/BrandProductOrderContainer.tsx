import { Component, Mixins } from 'vue-property-decorator';
import * as Styled from './styled';
import TraceProductMixin from './TraceProductMixin';

@Component
export default class BrandProductOrderContainer extends Mixins(
  TraceProductMixin,
) {
  render(): JSX.Element {
    return (
      <dashboard-layout>
        {this.isLoading ? (
          this.renderLoading()
        ) : (
          <Styled.Wrapper>
            {this.hasData ? this.renderDataTable() : this.renderAddNewOrder()}
          </Styled.Wrapper>
        )}
      </dashboard-layout>
    );
  }
}
