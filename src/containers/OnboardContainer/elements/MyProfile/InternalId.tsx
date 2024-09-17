import { Vue, Component, Prop } from 'vue-property-decorator';
import { get, head } from 'lodash';
import { RoleAttributeTypeEnum } from 'enums/role';
import Input from 'components/FormUI/Input';
import MessageError from 'components/FormUI/MessageError';
import * as Styled from './styled';

@Component
export default class InternalId extends Vue {
  @Prop({ default: false }) readonly isEdit: boolean;
  @Prop({ default: null }) defaultValue: string;
  @Prop({ required: true }) readonly userInfo: Auth.User;
  @Prop({ default: false }) readonly disabled: boolean;
  @Prop({ default: null }) readonly messageErrors: App.MessageError;
  @Prop() update: (params: Onboard.RoleAttributeParams[]) => void;

  private formInput = {
    internalId: '',
  };

  get roleAttributes(): Auth.RoleAttribute[] {
    const { roleAttributes } = this.userInfo;
    return roleAttributes[RoleAttributeTypeEnum.INTERNAL_INDENTIFIER_SYSTEM];
  }

  get internalIdAttribute(): Auth.RoleAttribute {
    return head(this.roleAttributes);
  }

  created(): void {
    this.initData();
  }

  initData() {
    this.formInput.internalId = get(this.internalIdAttribute, 'value');
  }

  handleInputSearch(value: string): void {
    this.update([
      {
        attributeId: get(this.internalIdAttribute, 'attributeId'),
        value,
        roleAttributeType: RoleAttributeTypeEnum.INTERNAL_INDENTIFIER_SYSTEM,
      },
    ]);
  }

  renderInput(): JSX.Element {
    return (
      <Styled.Column>
        <Input
          width="100%"
          height="48px"
          name="internalId"
          size="large"
          label={this.$t('internal_id')}
          placeholder={this.$t('internal_id')}
          disabled={this.disabled}
          changeValue={(value: string) => {
            this.handleInputSearch(value);
          }}
        />
        {this.messageErrors && (
          <MessageError
            field={get(this.internalIdAttribute, 'attributeId')}
            messageErrors={this.messageErrors}
          />
        )}
      </Styled.Column>
    );
  }

  render(): JSX.Element {
    return (
      <Styled.Group>
        <Styled.SubTitle>
          {this.$t('internal_identifier_system')}
        </Styled.SubTitle>
        <formulate-form
          v-model={this.formInput}
          name="internalAttribute"
          scopedSlots={{
            default: () => {
              return (
                <Styled.BusinessInformation column={this.isEdit ? 3 : 2}>
                  {this.renderInput()}
                </Styled.BusinessInformation>
              );
            },
          }}
        />
      </Styled.Group>
    );
  }
}
