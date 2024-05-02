import { Vue, Component, Prop } from 'vue-property-decorator';
import Button from 'components/FormUI/Button';
import Input from 'components/FormUI/Input';
import MessageError from 'components/FormUI/MessageError';
import { InputType } from 'enums/app';
import * as Styled from './styled';
import RoleWeight from './RoleWeight';

@Component
export default class Information extends Vue {
  @Prop({ default: false }) isSubmitting: boolean;
  @Prop({ default: null })
  properties: RiskAssessmentManagement.RiskAssessmentProperties;
  @Prop({ default: [] })
  reportRoles: RoleAndPermission.Role[];
  @Prop({
    default: {
      geographyWeight: null,
      listOfGoodsWeight: null,
      saqsWeight: null,
      dnaWeight: null,
      roleWeights: [],
    },
  })
  defaultValue: RiskAssessmentManagement.RiskAssessmentParams;

  @Prop({ default: null }) readonly messageErrors: App.MessageError;
  @Prop({
    default: () => {
      //
    },
  })
  clearMessageErrors: () => void;
  @Prop({
    default: () => {
      //
    },
  })
  back: () => void;
  @Prop({
    default: () => {
      //
    },
  })
  next: (data: RiskAssessmentManagement.RiskAssessmentParams) => void;

  private formInput: RiskAssessmentManagement.RiskAssessmentParams = {
    geographyWeight: null,
    listOfGoodsWeight: null,
    saqsWeight: null,
    dnaWeight: null,
    hotlineWeight: null,
    roleWeights: [],
  };

  created() {
    this.initData();
  }

  initData() {
    this.formInput = this.defaultValue;
    this.reportRoles.forEach((role) => {
      const roleWeight = this.formInput.roleWeights.find(
        ({ roleId }) => roleId === role.id,
      );
      if (!roleWeight) {
        this.formInput.roleWeights.push({ roleId: role.id, weight: null });
      }
    });
  }

  onChangeRoleWeight(role: RoleAndPermission.Role, weight: string) {
    const index = this.formInput.roleWeights.findIndex(
      ({ roleId }) => roleId === role.id,
    );
    if (index > -1) {
      this.formInput.roleWeights[index].weight = parseInt(weight, 10);
    }
    this.clearMessageErrors();
  }

  renderGeography(): JSX.Element {
    return (
      <Styled.Input>
        <Input
          type={InputType.NUMBER}
          label={this.$t('geography')}
          placeholder={this.$t('enter_a_weight')}
          name="geographyWeight"
          height="48px"
          validation="bail|required|min:1"
          disabled={this.isSubmitting}
          changeValue={this.clearMessageErrors}
          validationMessages={{
            required: this.$t('validation.required_weight', {
              field: this.$t('geography').toLowerCase(),
              interpolation: { escapeValue: false },
            }),
            min: this.$t('validation.min_weight', {
              field: this.$t('geography'),
              compare_field: 1,
            }),
          }}
        />
        {this.messageErrors && (
          <MessageError
            field="geographyWeight"
            messageErrors={this.messageErrors}
          />
        )}
      </Styled.Input>
    );
  }

  renderListOfGoods(): JSX.Element {
    return (
      <Styled.Input>
        <Input
          type={InputType.NUMBER}
          label={this.$t('product_risk_listings')}
          placeholder={this.$t('enter_a_weight')}
          name="listOfGoodsWeight"
          height="48px"
          validation="bail|required|min:1"
          disabled={this.isSubmitting}
          changeValue={this.clearMessageErrors}
          validationMessages={{
            required: this.$t('validation.required_weight', {
              field: this.$t('product_risk_listings').toLowerCase(),
              interpolation: { escapeValue: false },
            }),
            min: this.$t('validation.min_weight', {
              field: this.$t('product_risk_listings'),
              compare_field: 1,
            }),
          }}
        />
        {this.messageErrors && (
          <MessageError
            field="listOfGoodsWeight"
            messageErrors={this.messageErrors}
          />
        )}
      </Styled.Input>
    );
  }

  renderSAQs(): JSX.Element {
    if (this.properties.hasSAQ) {
      return (
        <Styled.Input>
          <Input
            type={InputType.NUMBER}
            label={this.$t('saqs')}
            placeholder={this.$t('enter_a_weight')}
            name="saqsWeight"
            height="48px"
            validation="bail|required|min:1"
            disabled={this.isSubmitting}
            changeValue={this.clearMessageErrors}
            validationMessages={{
              required: this.$t('validation.required_weight', {
                field: this.$t('saqs').toLowerCase(),
                interpolation: { escapeValue: false },
              }),
              min: this.$t('validation.min_weight', {
                field: this.$t('saqs'),
                compare_field: 1,
              }),
            }}
          />
          {this.messageErrors && (
            <MessageError
              field="saqsWeight"
              messageErrors={this.messageErrors}
            />
          )}
        </Styled.Input>
      );
    }
  }

  renderDNA(): JSX.Element {
    if (this.properties.hasDNA) {
      return (
        <Styled.Input>
          <Input
            type={InputType.NUMBER}
            label={this.$t('dna_test_results')}
            placeholder={this.$t('enter_a_weight')}
            name="dnaWeight"
            height="48px"
            validation="bail|required|min:1"
            disabled={this.isSubmitting}
            changeValue={this.clearMessageErrors}
            validationMessages={{
              required: this.$t('validation.required_weight', {
                field: this.$t('dna_test_results').toLowerCase(),
                interpolation: { escapeValue: false },
              }),
              min: this.$t('validation.min_weight', {
                field: this.$t('dna_test_results'),
                compare_field: 1,
              }),
            }}
          />
          {this.messageErrors && (
            <MessageError
              field="dnaWeight"
              messageErrors={this.messageErrors}
            />
          )}
        </Styled.Input>
      );
    }
  }

  renderHotline(): JSX.Element {
    if (this.properties.hasHotline) {
      return (
        <Styled.Input>
          <Input
            type={InputType.NUMBER}
            label={this.$t('admin')}
            placeholder={this.$t('enter_a_weight')}
            name="hotlineWeight"
            height="48px"
            validation="bail|required|min:1"
            disabled={this.isSubmitting}
            changeValue={this.clearMessageErrors}
            validationMessages={{
              required: this.$t('validation.required_weight', {
                field: this.$t('admin').toLowerCase(),
                interpolation: { escapeValue: false },
              }),
              min: this.$t('validation.min_weight', {
                field: this.$t('admin'),
                compare_field: 1,
              }),
            }}
          />
          {this.messageErrors && (
            <MessageError
              field="hotlineWeight"
              messageErrors={this.messageErrors}
            />
          )}
        </Styled.Input>
      );
    }
  }

  renderRoleWeights(): JSX.Element {
    return (
      <fragment>
        {this.reportRoles.map((role, index) => (
          <RoleWeight
            key={role.id}
            role={role}
            isSubmitting={this.isSubmitting}
            roleWeights={this.defaultValue.roleWeights}
            messageErrors={this.messageErrors}
            changeRoleWeight={(value: string) =>
              this.onChangeRoleWeight(role, value)
            }
          />
        ))}
      </fragment>
    );
  }

  render(): JSX.Element {
    return (
      <Styled.Wrapper>
        <formulate-form
          v-model={this.formInput}
          name="riskAssessmentSetting"
          vOn:submit={this.next}
          scopedSlots={{
            default: ({ hasErrors }: { hasErrors: boolean }) => {
              return (
                <Styled.Wrapper>
                  <Styled.Box>
                    <Styled.Title>
                      {this.$t('risk_assessment_question_2')}
                    </Styled.Title>
                    {this.renderGeography()}
                    {this.renderListOfGoods()}
                    {this.renderSAQs()}
                    {this.renderDNA()}
                    {this.renderHotline()}
                    {this.renderRoleWeights()}
                  </Styled.Box>
                  <Styled.Actions>
                    <Button
                      variant="outlinePrimary"
                      label={this.$t('back')}
                      disabled={this.isSubmitting}
                      click={() => this.back()}
                    />
                    <Button
                      label={this.$t('next')}
                      disabled={this.isSubmitting || hasErrors}
                      click={() => this.next(this.formInput)}
                    />
                  </Styled.Actions>
                </Styled.Wrapper>
              );
            },
          }}
        />
      </Styled.Wrapper>
    );
  }
}
