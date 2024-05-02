import { Vue, Component, Prop, Ref } from 'vue-property-decorator';
import Dropdown from 'components/FormUI/Dropdown';
import Button from 'components/FormUI/Button';
import * as Styled from './styled';

@Component
export default class SelectRolePopper extends Vue {
  @Prop({ default: true }) isCreate: boolean;
  @Prop({ default: [] }) roles: RoleAndPermission.Role[];
  @Prop({ default: [] }) products: ProductManagement.Product[];
  @Prop({ default: [] }) selectedRole: RoleAndPermission.Role;
  @Prop({ default: [] }) selectedProduct: ProductManagement.Product;
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
  done: () => void;
  @Prop({
    default: () => {
      //
    },
  })
  removeNode: () => void;

  @Ref('popper')
  readonly popper!: App.Any;

  get title(): string {
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

  renderHeader(): JSX.Element {
    return (
      <Styled.Header>
        <Styled.Title>{this.title}</Styled.Title>
      </Styled.Header>
    );
  }

  renderForm(): JSX.Element {
    return (
      <Styled.Form>
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
        {this.renderForm()}
        {this.renderAction()}
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
      >
        {this.$slots.default}
        {this.renderContent()}
      </v-popover>
    );
  }
}
