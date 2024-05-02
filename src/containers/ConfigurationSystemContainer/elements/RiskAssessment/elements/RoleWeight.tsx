import { Vue, Component, Prop } from 'vue-property-decorator';
import Input from 'components/FormUI/Input';
import MessageError from 'components/FormUI/MessageError';
import { InputType } from 'enums/app';
import * as Styled from './styled';

@Component
export default class RoleWeight extends Vue {
  @Prop({ required: true }) role: RoleAndPermission.Role;
  @Prop({ default: false }) isSubmitting: boolean;
  @Prop({ default: [] }) roleWeights: RiskAssessmentManagement.RoleWeight[];
  @Prop({ default: null }) readonly messageErrors: App.MessageError;
  @Prop({
    default: () => {
      //
    },
  })
  changeRoleWeight: (value: string) => void;

  private value = '';

  created() {
    this.initData();
  }

  initData() {
    const roleWeight = this.roleWeights.find(
      ({ roleId }) => roleId === this.role.id,
    );
    if (roleWeight && roleWeight.weight) {
      this.value = roleWeight.weight.toString();
    }
  }

  onChangeRoleWeight(value: string) {
    this.value = value;
    this.changeRoleWeight(value);
  }

  render(): JSX.Element {
    return (
      <Styled.Input>
        <Input
          type={InputType.NUMBER}
          label={this.role.name}
          placeholder={this.$t('enter_a_weight')}
          name={this.role.id}
          value={this.value}
          height="48px"
          validation="bail|required|min:1"
          disabled={this.isSubmitting}
          changeValue={this.onChangeRoleWeight}
          validationMessages={{
            required: this.$t('validation.required_weight', {
              field: this.role.name,
              interpolation: { escapeValue: false },
            }),
            min: this.$t('validation.min_weight', {
              field: this.role.name,
              compare_field: 1,
            }),
          }}
        />
        {this.messageErrors && (
          <MessageError
            field={this.role.id}
            messageErrors={this.messageErrors}
          />
        )}
      </Styled.Input>
    );
  }
}
