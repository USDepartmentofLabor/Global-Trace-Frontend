import { Vue, Component, Prop, Ref } from 'vue-property-decorator';
import Dropdown from 'components/FormUI/Dropdown';
import Button from 'components/FormUI/Button';
import InputGroup from 'components/FormUI/InputGroup';
import * as Styled from './styled';
import Calculator from './elements/Calculator/Calculator';

@Component
export default class SelectRolePopper extends Vue {
  @Prop({ default: true }) isCreate: boolean;
  @Prop({ default: null }) fromNode: SupplyChain.Node;
  @Prop({ default: [] }) roles: RoleAndPermission.Role[];
  @Prop({ default: [] }) products: ProductManagement.Product[];
  @Prop({ default: null }) selectedRole: RoleAndPermission.Role;
  @Prop({ default: null }) selectedProduct: ProductManagement.Product;
  @Prop({ default: null }) selectedCalculator: SupplyChain.Calculator;
  @Prop() selectRole: (role: RoleAndPermission.Role) => void;
  @Prop({
    default: () => {
      //
    },
  })
  show: () => void;
  @Prop({
    default: () => {
      //
    },
  })
  selectProduct: (product: ProductManagement.Product) => void;
  @Prop({
    default: () => {
      //
    },
  })
  changeCalculator: (data: SupplyChain.ValidateCalculatorParams) => void;
  @Prop({
    default: () => {
      //
    },
  })
  done: () => void;
  @Prop({
    default: () => {
      //
    },
  })
  removeNode: () => void;

  @Ref('popper')
  readonly popper!: App.Any;

  private isEditCalculator = false;

  get title(): string {
    if (this.isEditCalculator) {
      return this.$t('edit_calculated_field');
    }
    return this.isCreate ? this.$t('add_a_role') : this.$t('edit_role');
  }

  get showRemoveButton(): boolean {
    return !this.isCreate;
  }

  handleSelectRole(role: RoleAndPermission.Role): void {
    this.selectRole(role);
  }

  handleSelectProduct(product: ProductManagement.Product): void {
    this.selectProduct(product);
  }

  handleSuccess(): void {
    this.popper.hide();
    this.done();
  }

  toggleEditCalculator() {
    this.isEditCalculator = !this.isEditCalculator;
  }

  onChangeCalculator(data: SupplyChain.ValidateCalculatorParams) {
    this.changeCalculator(data);
    if (data) {
      this.toggleEditCalculator();
    }
  }

  onHide() {
    this.isEditCalculator = false;
  }

  renderHeader(): JSX.Element {
    return (
      <Styled.Header>
        {this.isEditCalculator && (
          <Styled.Back onClick={this.toggleEditCalculator}>
            <font-icon name="arrow_left" color="highland" size="24" />
          </Styled.Back>
        )}
        <Styled.Title>{this.title}</Styled.Title>
      </Styled.Header>
    );
  }

  renderCalculateField(): JSX.Element {
    if (this.selectedProduct && this.fromNode) {
      return (
        <Styled.EditCalculator vOn:click={this.toggleEditCalculator}>
          {this.$t('edit_calculated_field')}
          <font-icon name="edit" color="killarney" size="18" />
        </Styled.EditCalculator>
      );
    }
  }

  renderForm(): JSX.Element {
    return (
      <Styled.Form>
        <InputGroup>
          <Dropdown
            title={this.$t('select_role')}
            options={this.roles}
            height="48px"
            trackBy="id"
            value={this.selectedRole}
            changeOptionValue={this.handleSelectRole}
            placeholder={this.$t('select_role')}
            allowEmpty={false}
          />
          <Dropdown
            title={this.$t('select_product_output')}
            options={this.products}
            height="48px"
            trackBy="id"
            value={this.selectedProduct}
            changeOptionValue={this.handleSelectProduct}
            placeholder={this.$t('select_product_output')}
            allowEmpty={false}
          />
          {this.renderCalculateField()}
        </InputGroup>
      </Styled.Form>
    );
  }

  renderAction(): JSX.Element {
    return (
      <Styled.Actions>
        {this.showRemoveButton && (
          <Button
            width="100%"
            variant="danger"
            label={this.$t('common.action.delete')}
            click={this.removeNode}
          />
        )}
        <Button
          label={this.$t('done')}
          width="100%"
          disabled={!this.selectedRole || !this.selectedProduct}
          click={this.handleSuccess}
        />
      </Styled.Actions>
    );
  }

  renderContent(): JSX.Element {
    return (
      <Styled.Content slot="popover">
        {this.renderHeader()}
        {this.isEditCalculator && (
          <Calculator
            isCreate={this.isCreate}
            fromNode={this.fromNode}
            selectedCalculator={this.selectedCalculator}
            selectedProduct={this.selectedProduct}
            cancel={this.toggleEditCalculator}
            change={this.onChangeCalculator}
          />
        )}
        {!this.isEditCalculator && (
          <fragment>
            {this.renderForm()}
            {this.renderAction()}
          </fragment>
        )}
      </Styled.Content>
    );
  }

  render(): JSX.Element {
    return (
      <v-popover
        trigger="click"
        placement="bottom-start"
        container="body"
        autoHide
        ref="popper"
        vOn:show={this.show}
        vOn:hide={this.onHide}
      >
        {this.$slots.default}
        {this.renderContent()}
      </v-popover>
    );
  }
}
