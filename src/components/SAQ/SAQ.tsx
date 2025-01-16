import { Vue, Component, Prop } from 'vue-property-decorator';
import { find, get, head, isEmpty, last, map, maxBy } from 'lodash';
import { DEFAULT_LANGUAGE, START_ORDER } from 'config/constants';
import { ChangeStepEnum } from 'enums/app';
import { GoToTypeEnum } from 'enums/saq';
import { handleError } from 'components/Toast';
import { SpinLoading } from 'components/Loaders';
import AppModule from 'store/modules/app';
import saqModule from 'store/modules/saq';
import Form from './Form';
import * as Styled from './styled';

@Component
export default class SAQ extends Vue {
  @Prop({ default: false }) readonly isView: boolean;
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

  private isLoading: boolean = false;
  private isLoaded: boolean = false;
  private currentPart: number = START_ORDER;
  private currentQuestionId: string = null;
  private isShowQuestion: boolean = true;

  get currentSAQGroup(): SAQ.SelfAssessmentGroup {
    return find(saqModule.groups, (group) => group.order === this.currentPart);
  }

  get currentQuestion(): SAQ.SelfAssessmentQuestion {
    return this.currentSAQGroup.questions.find(
      ({ id }) => id === this.currentQuestionId,
    );
  }

  get currentAnswer(): SAQ.Answer {
    return this.getQuestionAnswer(this.currentQuestionId);
  }

  get currentLocale(): string {
    return AppModule.locale;
  }

  get isLastGroup(): boolean {
    return this.currentPart === saqModule.groups.length;
  }

  get isFirstStep(): boolean {
    const firstGroup = head(saqModule.groups);
    return this.currentQuestionId === get(head(firstGroup.questions), 'id');
  }

  get isLastStep(): boolean {
    if (!isEmpty(get(this.currentAnswer, 'answerValues', []))) {
      return (
        this.currentResponse &&
        !this.currentResponse.nextQuestionId &&
        this.currentPart === saqModule.groups.length
      );
    }
    const lastGroup = last(saqModule.groups);
    const lastQuestionIds = lastGroup.questions
      .filter(({ questionResponses }) =>
        questionResponses.some(({ nextQuestionId }) => !nextQuestionId),
      )
      .map(({ id }) => id);
    return lastQuestionIds.includes(this.currentQuestionId);
  }

  get isLastQuestion(): boolean {
    if (!isEmpty(get(this.currentAnswer, 'answerValues', []))) {
      return (
        this.currentResponse &&
        !this.currentResponse.nextQuestionId &&
        !this.isLastGroup
      );
    }
    const lastQuestionIds = this.currentSAQGroup.questions
      .filter(({ questionResponses }) =>
        questionResponses.some(({ nextQuestionId }) => !nextQuestionId),
      )
      .map(({ id }) => id);
    return (
      lastQuestionIds.includes(this.currentQuestionId) && !this.isLastGroup
    );
  }

  get currentResponse(): SAQ.QuestionResponse {
    return this.currentQuestion.questionResponses.find(({ id }) => {
      const answerValues = get(this.currentAnswer, 'answerValues', []);
      return id === get(head(answerValues), 'selfAssessmentQuestionResponseId');
    });
  }

  get isBreak(): boolean {
    return get(this.currentResponse, 'goToType') === GoToTypeEnum.BREAK;
  }

  get isEnd(): boolean {
    return get(this.currentResponse, 'goToType') === GoToTypeEnum.END;
  }

  created(): void {
    this.getSAQData();
  }

  getSAQData(): void {
    this.isLoading = true;
    saqModule.getSAQData({
      callback: {
        onSuccess: () => {
          this.currentQuestionId = this.getFirstQuestionId();
          this.getAnswers();
        },
        onFailure: (error: App.ResponseError) => {
          handleError(error);
        },
        onFinish: () => {
          this.isLoading = false;
        },
      },
    });
  }

  getAnswers(): void {
    this.isLoading = true;
    saqModule.getAnswers({
      callback: {
        onFinish: () => {
          this.isLoading = false;
          this.isLoaded = true;
        },
      },
    });
  }

  onChangePart(part: number): void {
    this.isShowQuestion = false;
    this.currentPart = part;
    this.updateQuestionId();
    this.$nextTick(() => {
      this.isShowQuestion = true;
    });
  }

  updateQuestionId(): string {
    if (this.isView) {
      return null;
    }
    this.currentQuestionId = this.getFirstQuestionId();
    let questionIndex = 0;
    do {
      const question = this.currentSAQGroup.questions.find(
        ({ id }) => id === this.currentQuestionId,
      );
      if (question) {
        questionIndex = this.currentSAQGroup.questions.findIndex(
          ({ id }) => id === question.id,
        );
        const answer = this.getQuestionAnswer(question.id);
        if (!isEmpty(answer) && !isEmpty(answer.answerValues)) {
          if (questionIndex === this.currentSAQGroup.questions.length - 1) {
            this.currentQuestionId = this.getFirstQuestionId();
            break;
          }
          this.currentQuestionId = this.getNextQuestionId(answer);
        } else {
          break;
        }
      } else {
        this.currentQuestionId = this.getFirstQuestionId();
        break;
      }
    } while (questionIndex < this.currentSAQGroup.questions.length);
  }

  getQuestionAnswer(id: string): SAQ.Answer {
    return saqModule.answers.find(
      ({ selfAssessmentQuestionId }) => selfAssessmentQuestionId === id,
    );
  }

  getFirstQuestionId(): string {
    return get(head(this.currentSAQGroup.questions), 'id', '');
  }

  onChangeStep(type: ChangeStepEnum): void {
    if (type === ChangeStepEnum.NEXT) {
      if (this.isLastQuestion || this.isEnd) {
        this.currentPart++;
        this.currentQuestionId = this.getFirstQuestionId();
      } else if (!this.isLastStep || this.isBreak) {
        this.currentQuestionId = this.getNextQuestionId(this.currentAnswer);
      }
    } else {
      this.currentQuestionId = this.getPreviousQuestionId(
        this.currentQuestionId,
      );
      if (!this.currentQuestionId) {
        this.currentPart--;
        this.currentQuestionId = this.getPreviousQuestionId();
      }
    }
    this.$nextTick(() => {
      this.isShowQuestion = true;
    });
  }

  getNextQuestionId(answer: SAQ.Answer): string {
    if (isEmpty(answer) || isEmpty(get(answer, 'answerValues', []))) {
      return this.getQuestionResponseDefault(this.currentQuestion);
    }
    const firstAnswer = head(answer.answerValues);
    if (isEmpty(firstAnswer)) {
      return this.getQuestionResponseDefault(this.currentQuestion);
    }
    const responseId = firstAnswer.selfAssessmentQuestionResponseId;
    const response = find(
      this.currentQuestion.questionResponses,
      ({ id }) => id === responseId,
    );
    return response.nextQuestionId;
  }

  getQuestionResponseDefault(currentQuestion: SAQ.SelfAssessmentQuestion) {
    const responses = currentQuestion.questionResponses;
    let responseDefault: SAQ.QuestionResponse = null;
    const hasRiskLevel = responses.some(({ riskLevel }) => !isEmpty(riskLevel));
    if (hasRiskLevel) {
      responseDefault = maxBy(responses, 'riskScore');
    } else {
      responseDefault = head(responses);
    }
    return responseDefault.nextQuestionId;
  }

  getPreviousQuestionId(currentQuestionId: string = null): string {
    const previousQuestion = this.currentSAQGroup.questions.find(
      ({ questionResponses }) =>
        questionResponses.find(
          ({ nextQuestionId }) => nextQuestionId === currentQuestionId,
        ),
    );
    if (previousQuestion) {
      return get(previousQuestion, 'id', '');
    }
  }

  renderPartTitle(): JSX.Element {
    const defaultTitle = get(this.currentSAQGroup, ['title', DEFAULT_LANGUAGE]);
    return (
      <Styled.Part>
        {get(this.currentSAQGroup, ['title', this.currentLocale], defaultTitle)}
      </Styled.Part>
    );
  }

  renderStep(): JSX.Element {
    return (
      <Styled.StepContainer>
        {map(saqModule.groups, (group) => (
          <Styled.Step
            isActive={this.currentPart === group.order}
            vOn:click={() => this.onChangePart(group.order)}
          />
        ))}
      </Styled.StepContainer>
    );
  }

  renderForm(): JSX.Element {
    return (
      <Form
        isView={this.isView}
        currentPart={this.currentPart}
        currentQuestionId={this.currentQuestionId}
        currentSAQGroup={this.currentSAQGroup}
        isFirstStep={this.isFirstStep}
        isLastStep={this.isLastStep || this.isEnd}
        isShowQuestion={this.isShowQuestion}
        beforeSaveDraft={() => {
          if (this.beforeSaveDraft) {
            this.beforeSaveDraft();
          }
        }}
        finishSaveDraft={() => {
          if (this.finishSaveDraft) {
            this.finishSaveDraft();
          }
        }}
        finishSAQ={this.finishSAQ}
        changeStep={this.onChangeStep}
      />
    );
  }

  renderContent(): JSX.Element {
    return (
      <Styled.Wrapper>
        {this.currentSAQGroup && this.renderPartTitle()}
        {this.renderStep()}
        {this.renderForm()}
      </Styled.Wrapper>
    );
  }

  render(): JSX.Element {
    return (
      <fragment>
        {this.isLoading && <SpinLoading isInline={false} />}
        {this.isLoaded && this.renderContent()}
      </fragment>
    );
  }
}
