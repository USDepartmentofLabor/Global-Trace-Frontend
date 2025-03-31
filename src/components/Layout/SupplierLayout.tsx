import { Vue, Component } from 'vue-property-decorator';
import MasterLayout from './MasterLayout';
import * as Styled from './styled';

@Component
export default class SupplierLayout extends Vue {
  render(): JSX.Element {
    return (
      <MasterLayout>
        <Styled.SupplierLayout>{this.$slots.default}</Styled.SupplierLayout>
      </MasterLayout>
    );
  }
}
