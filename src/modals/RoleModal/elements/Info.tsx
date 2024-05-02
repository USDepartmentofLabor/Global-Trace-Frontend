import { Vue, Component, Prop } from 'vue-property-decorator';
import { find } from 'lodash';
import Dropdown from 'components/FormUI/Dropdown';
import Input from 'components/FormUI/Input';
import MessageError from 'components/FormUI/MessageError';
import { RoleTypeEnum } from 'enums/role';
import * as Styled from './styled';

@Component
export default class Info extends Vue {
  @Prop({ default: '' }) formName: string;
  @Prop({ default: null }) readonly messageErrors: App.MessageError;
  @Prop({ default: false }) readonly isEdit: boolean;
  @Prop({
    type: Function,
    default: () => {
      //
    },
  })
  changeInput: () => void;
  @Prop({
    type: Function,
    default: () => {
      //
    },
  })
  changeType: (type: RoleTypeEnum) => void;

  private typeSelected: App.DropdownOption = null;

  private typeOptions: App.DropdownOption[] = [
    {
      id: RoleTypeEnum.ADMINISTRATOR,
      name: this.$t('administrator'),
    },
    {
      id: RoleTypeEnum.BRAND,
      name: this.$t('brand'),
    },
    {
      id: RoleTypeEnum.LABOR,
      name: this.$t('labor'),
    },
    {
      id: RoleTypeEnum.PRODUCT,
      name: this.$t('product'),
    },
  ];

  get formData(): App.Any {
    return this.$formulate.registry.get(this.formName).proxy;
  }

  created(): void {
    if (this.isEdit) {
      this.typeSelected = find(
        this.typeOptions,
        (option: App.DropdownOption) => option.id === this.formData.type,
      );
    }
  }

  get type(): string {
    const { type } = this.formData;
    return type ? type : null;
  }

  set type(value: string) {
    this.$formulate.setValues(this.formName, {
      ...this.formData,
      type: value,
    });
  }

  onChangeType(option: App.DropdownOption = null): void {
    this.typeSelected = option;
    this.type = option.id as string;
    this.changeType(this.type as RoleTypeEnum);
  }

  renderName(): JSX.Element {
    return (
      <fragment>
        <Input
          label={this.$t('role_name')}
          name="name"
          height="48px"
          placeholder={this.$t('input_a_role_name')}
          validation="bail|required"
          changeValue={this.changeInput}
          autoTrim
          maxLength={255}
          validationMessages={{
            required: this.$t('validation.required', {
              field: this.$t('role_name').toLowerCase(),
            }),
          }}
        />
        {this.messageErrors && (
          <MessageError field="name" messageErrors={this.messageErrors} />
        )}
      </fragment>
    );
  }

  renderType(): JSX.Element {
    return (
      <Dropdown
        title={this.$t('role_type')}
        placeholder={this.$t('select_one_of_the_role_type')}
        options={this.typeOptions}
        height="48px"
        trackBy="id"
        value={this.typeSelected}
        overflow
        allowEmpty={false}
        changeOptionValue={this.onChangeType}
      />
    );
  }

  render(): JSX.Element {
    return (
      <Styled.Info>
        {this.renderName()}
        {this.renderType()}
      </Styled.Info>
    );
  }
}
