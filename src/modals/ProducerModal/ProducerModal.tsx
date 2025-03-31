import { Vue, Component, Prop } from 'vue-property-decorator';
import { get, isNull, pick } from 'lodash';
import { createUser, updateUser } from 'api/producer-management';
import Button from 'components/FormUI/Button';
import InputGroup from 'components/FormUI/InputGroup';
import { UserStatusEnum } from 'enums/user';
import UserInfo from './elements/UserInfo';
import * as Styled from './styled';

@Component
export default class UserModal extends Vue {
  @Prop({ default: null }) readonly user: Auth.User;
  @Prop({
    type: Function,
    default: () => {
      //
    },
  })
  onSuccess: () => void;

  private formInput: ProducerManagement.User = {
    firstName: '',
    lastName: '',
    email: '',
    userType: null,
    status: null,
  };
  public isSubmitting: boolean = false;
  public messageErrors: App.MessageError = null;
  private formName = 'producerForm';

  get isEdit(): boolean {
    return this.user !== null;
  }

  get submitLabel(): string {
    return this.isEdit
      ? this.$t('common.action.save_changes')
      : this.$t('userModal.add_user');
  }

  get isEmptyType(): boolean {
    return isNull(this.formInput.userType);
  }

  get isDisableSubmit(): boolean {
    return this.isSubmitting || this.isEmptyType;
  }

  get isDisabledInput(): boolean {
    return this.isSubmitting || this.isEdit;
  }

  get title(): string {
    if (this.isEdit) {
      return this.$t('edit_user');
    }
    return this.$t('add_new_user');
  }

  created(): void {
    this.initData();
  }

  initData(): void {
    if (this.isEdit) {
      const { firstName, lastName, email, userType, status } = this.user;
      this.formInput.firstName = firstName;
      this.formInput.lastName = lastName;
      this.formInput.email = email;
      this.formInput.userType = userType;
      this.formInput.status = status;
    }
  }

  onClearMessageErrors(): void {
    if (this.messageErrors) {
      this.messageErrors = null;
    }
  }

  getCreateUserParams(): ProducerManagement.UserParams {
    return pick(this.formInput, ['email', 'firstName', 'lastName', 'userType']);
  }

  getEditUserParams(): ProducerManagement.UserParams {
    return pick(this.formInput, ['userType']);
  }

  async onSubmit(): Promise<void> {
    this.isSubmitting = true;
    try {
      if (this.isEdit) {
        await updateUser(this.user.id, this.getEditUserParams());
      } else {
        await createUser(this.getCreateUserParams());
      }
      this.onSuccess();
      this.closeModal();
      this.showSuccessMessage();
    } catch (error) {
      this.messageErrors = get(error, 'errors');
    } finally {
      this.isSubmitting = false;
    }
  }

  async updateUserStatus(): Promise<void> {
    this.isSubmitting = true;
    try {
      const status =
        this.user.status === UserStatusEnum.ACTIVE
          ? UserStatusEnum.DEACTIVATED
          : UserStatusEnum.ACTIVE;

      await updateUser(this.user.id, {
        status,
      });
      this.onSuccess();
      this.closeModal();
      this.$toast.info(
        this.$t(
          status === UserStatusEnum.ACTIVE
            ? 'user_is_activated'
            : 'user_is_deactivated',
          { user: this.formInput.firstName },
        ),
      );
    } catch (error) {
      this.messageErrors = get(error, 'errors');
    } finally {
      this.isSubmitting = false;
    }
  }

  showSuccessMessage(): void {
    const successMessage = this.isEdit
      ? this.$t('userModal.successfully_saved')
      : this.$t('userModal.add_new_user_successfully', {
          role: this.formInput.firstName,
        });
    this.$toast.success(successMessage);
  }

  closeModal(): void {
    this.$emit('close');
  }

  renderActions(hasErrors: boolean): JSX.Element {
    const isActivated =
      this.isEdit && this.user.status === UserStatusEnum.ACTIVE;
    return (
      <Styled.ButtonGroup isEdit={this.isEdit}>
        {this.isEdit && (
          <Button
            type="button"
            variant={isActivated ? 'outlineDanger' : 'outlinePrimary'}
            label={
              isActivated
                ? this.$t('deactivate_user')
                : this.$t('reactivate_user')
            }
            disabled={this.isSubmitting}
            click={this.updateUserStatus}
          />
        )}
        <Styled.ButtonGroupEnd>
          <Button
            label={this.$t('common.action.cancel')}
            variant="transparentPrimary"
            click={this.closeModal}
          />
          <Button
            type="submit"
            variant="primary"
            label={this.submitLabel}
            isLoading={this.isSubmitting}
            disabled={this.isDisableSubmit || hasErrors}
          />
        </Styled.ButtonGroupEnd>
      </Styled.ButtonGroup>
    );
  }

  renderForm(): JSX.Element {
    return (
      <formulate-form
        v-model={this.formInput}
        name={this.formName}
        scopedSlots={{
          default: ({ hasErrors }: { hasErrors: boolean }) => (
            <InputGroup>
              <UserInfo
                formName={this.formName}
                disabledRoleId={this.isSubmitting}
                statusDefault={this.formInput.status}
                typeDefault={this.formInput.userType}
                disabled={this.isDisabledInput}
                messageErrors={this.messageErrors}
                changeInput={this.onClearMessageErrors}
              />
              {this.renderActions(hasErrors)}
            </InputGroup>
          ),
        }}
        vOn:submit={this.onSubmit}
      />
    );
  }

  render(): JSX.Element {
    return (
      <modal-layout title={this.title} closeModal={this.closeModal}>
        <Styled.Content>
          <perfect-scrollbar>{this.renderForm()}</perfect-scrollbar>
        </Styled.Content>
      </modal-layout>
    );
  }
}
