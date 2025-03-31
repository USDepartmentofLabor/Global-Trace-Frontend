import { Vue, Component, Prop } from 'vue-property-decorator';
import { isEmpty } from 'lodash';
import { START_ORDER } from 'config/constants';
import { ChangeStepEnum } from 'enums/app';
import AppModule from 'store/modules/app';
import saqModule from 'store/modules/saq';
import { handleError } from 'components/Toast';
import Button from 'components/FormUI/Button';
import ShowingQuestions from './ShowingQuestions';
import * as Styled from './styled';

const IncompleteQuestionModal = () => import('modals/IncompleteQuestionModal');

@Component
export default class Form extends Vue {
  @Prop({ default: false }) readonly isView: boolean;
  @Prop({ default: true }) isFirstStep: boolean;
  @Prop({ default: false }) isLastStep: boolean;
  @Prop({ default: true }) isShowQuestion: boolean;
  @Prop({ default: null }) currentSAQGroup: SAQ.SelfAssessmentGroup;
  @Prop({ default: START_ORDER }) readonly currentQuestionId: string;
  @Prop({
    default: () => {
      //
    },
  })
  changeStep: (type: ChangeStepEnum) => void;
  @Prop({
    default: () => {
      //
    },
  })
  beforeSaveDraft: () => void;
  @Prop({
    default: () => {
      //
    },
  })
  finishSaveDraft: () => void;
  @Prop({
    default: () => {
      //
    },
  })
  finishSAQ: () => void;

  private formName: string = 'SAQForm';
  private isSubmitting: boolean = false;
  private isSubmit: boolean = false;

  get showQuestion(): SAQ.SelfAssessmentQuestion {
    return this.currentSAQGroup.questions.find(
      ({ id }) => id === this.currentQuestionId,
    );
  }

  get currentLocale(): string {
    return AppModule.locale;
  }

  beforeDestroy(): void {
    if (!this.isSubmit) {
      if (saqModule.answers.length > 0 && !this.isView) {
        this.beforeSaveDraft();
        saqModule.submitAnswers({
          params: this.getAnswerParams(),
          callback: {
            onSuccess: () => {
              this.finishSaveDraft();
            },
            onFailure: (error: App.ResponseError) => {
              handleError(error);
            },
            onFinish: () => {
              this.isSubmitting = false;
            },
          },
        });
      }
      saqModule.resetSAQState();
    }
  }

  getAnswerParams(): SAQ.AnswerParams {
    return {
      answers: saqModule.answers,
    };
  }

  showIncompleteQuestions(): void {
    const incompleteQuestions = saqModule.selfAssessment.incompleteQuestions;
    if (!isEmpty(incompleteQuestions)) {
      this.$modal.show(
        IncompleteQuestionModal,
        {
          incompleteQuestions,
        },
        { width: '363px', height: 'auto', clickToClose: false, adaptive: true },
      );
    } else {
      this.$toast.success(this.$t('selfAssessments.completed'));
      this.isSubmit = true;
      this.finishSAQ();
      this.finishSaveDraft();
    }
  }

  onSubmit(): void {
    this.isSubmitting = true;
    this.saveAnswers(false, () => {
      saqModule.getSAQData({
        callback: {
          onSuccess: () => {
            this.showIncompleteQuestions();
          },
          onFailure: (error: App.ResponseError) => {
            handleError(error);
          },
          onFinish: () => {
            this.isSubmitting = false;
          },
        },
      });
    });
  }

  saveAnswers(notify: boolean = true, success: () => void): void {
    saqModule.submitAnswers({
      params: this.getAnswerParams(),
      callback: {
        onSuccess: () => {
          if (notify) {
            this.$toast.success(this.$t('saved_saq'));
          }
          success();
        },
        onFailure: (error: App.ResponseError) => {
          handleError(error);
        },
      },
    });
  }

  renderHeader(): JSX.Element {
    return (
      <Styled.Header>
        {!this.isFirstStep && (
          <Styled.BackButton>
            <Button
              variant="transparentSecondary"
              label={this.$t('back')}
              icon="arrow_back"
              click={() => this.changeStep(ChangeStepEnum.BACK)}
            />
          </Styled.BackButton>
        )}
        {!this.isLastStep && (
          <Styled.NextButton>
            <Button
              variant="transparentSecondary"
              label={this.$t('next')}
              icon="arrow_forward"
              iconPosition="suffix"
              click={() => this.changeStep(ChangeStepEnum.NEXT)}
            />
          </Styled.NextButton>
        )}
      </Styled.Header>
    );
  }

  renderFooter(): JSX.Element {
    return (
      <Styled.Footer>
        <Button
          width="240px"
          label={this.$t('common.action.submit')}
          type="submit"
          isLoading={this.isSubmitting}
          disabled={this.isSubmitting}
        />
      </Styled.Footer>
    );
  }

  render(): JSX.Element {
    return (
      <formulate-form
        name={this.formName}
        vOn:submit={this.onSubmit}
        novalidate
        scopedSlots={{
          default: () => (
            <Styled.Form>
              {this.renderHeader()}
              <Styled.Content>
                {this.isShowQuestion && (
                  <ShowingQuestions
                    question={this.showQuestion}
                    allQuestions={this.currentSAQGroup.questions}
                    isView={this.isView}
                  />
                )}
              </Styled.Content>
              {!this.isView && this.isLastStep && this.renderFooter()}
            </Styled.Form>
          ),
        }}
      />
    );
  }
}
