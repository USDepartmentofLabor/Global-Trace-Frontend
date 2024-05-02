import { Vue, Component, Prop } from 'vue-property-decorator';
import { find } from 'lodash';
import { isSupplier } from 'utils/user';
import Dropdown from 'components/FormUI/Dropdown';
import * as Styled from './styled';

@Component
export default class SupplierInfo extends Vue {
  @Prop({ default: false }) readonly disabledTier: boolean;
  @Prop({ default: false }) readonly disabledRoleId: boolean;
  @Prop({ default: null }) readonly tierDefault: string;
  @Prop({ default: [] }) readonly roles: RoleAndPermission.Role[];
  @Prop({ default: null }) readonly roleIdDefault: number;
  @Prop({ required: true }) setRoleId: (type: string) => void;
  @Prop({ required: true }) changeTier: (option: App.DropdownOption) => void;
  @Prop({ required: true }) changeRoleId: (option: App.DropdownOption) => void;

  private roleSelected: App.DropdownOption = null;

  get roleOptions(): App.DropdownOption[] {
    return this.roles
      .filter((role) => {
        return isSupplier(role.type);
      })
      .map(({ id, name }) => ({ id, name }));
  }

  get formName(): string {
    return this.$formulate.registry.keys().next().value;
  }

  get formData(): UserManagement.User {
    return this.$formulate.registry.get(this.formName).proxy;
  }

  created(): void {
    this.roleSelected = find(
      this.roleOptions,
      (option) => option.id === this.roleIdDefault,
    );
  }

  onChangeRoleId(option: App.DropdownOption): void {
    this.roleSelected = option;
    this.setRoleId(option.id as string);
  }

  render(): JSX.Element {
    return (
      <Styled.Row isSupplier>
        <Dropdown
          title={this.$t('type')}
          options={this.roleOptions}
          width="100%"
          height="48px"
          value={this.roleSelected}
          changeOptionValue={this.onChangeRoleId}
          placeholder={this.$t('type')}
          disabled={this.disabledRoleId}
          allowEmpty={false}
          overflow
        />
      </Styled.Row>
    );
  }
}
