import { Vue, Component, Prop } from 'vue-property-decorator';
import { cloneDeep, find, findIndex, get } from 'lodash';
import AppModule from 'store/modules/app';
import saqModule from 'store/modules/saq';
import { OptionTypeEnum } from 'enums/saq';
import CheckboxGroup from 'components/FormUI/Checkbox/CheckboxGroup';
import Input from 'components/FormUI/Input';
import * as Styled from './styled';

@Component
export default class MultipleChoice extends Vue {
  @Prop({ default: false }) readonly isView: boolean;
  @Prop({ default: [] }) options: App.CheckboxGroup[];
  @Prop({ required: true }) question: SAQ.SelfAssessmentQuestion;

  private values: string[] = [];
  private answers: SAQ.AnswerValues[] = [];
  private isOther: boolean = false;
  private otherCode: string = '';
  private otherValue: string = '';

  get currentLocale(): string {
    return AppModule.locale;
  }

  get questionId(): string {
    return get(this.question, 'id');
  }

  get currentAnswer(): SAQ.Answer {
    return find(
      saqModule.answers,
      (answer) => answer.selfAssessmentQuestionId === this.questionId,
    );
  }

  get otherOption(): SAQ.QuestionResponse {
    return this.question.questionResponses.find(
      ({ optionType }) => optionType === OptionTypeEnum.OTHER,
    );
  }

  get checkedAnswers(): string[] {
    const currentAnswer = find(
      saqModule.answers,
      (answer) => answer.selfAssessmentQuestionId === this.questionId,
    );
    if (currentAnswer) {
      return currentAnswer.answerValues.map(
        (answer) => answer.selfAssessmentQuestionResponseId,
      );
    }
    return [];
  }

  get isCheckedOther(): boolean {
    return this.values.includes(get(this.otherOption, 'id'));
  }

  get optionsDisplayed(): App.CheckboxGroup[] {
    let options = cloneDeep(this.options);
    if (this.isCheckedOther) {
      options = options.map((item) => {
        const response = this.question.questionResponses.find(
          ({ id }) => id === item.value,
        );
        if (response.optionType !== OptionTypeEnum.OTHER) {
          item.disabled = true;
        }
        return item;
      });
    }
    return options;
  }

  created(): void {
    this.initOtherValue();
    this.changeCheckboxValue(this.checkedAnswers);
  }

  initOtherValue(): void {
    if (this.currentAnswer && this.otherOption) {
      const otherQuestionResponse = find(
        this.currentAnswer.answerValues,
        ({ selfAssessmentQuestionResponseId }) =>
          selfAssessmentQuestionResponseId === this.otherOption.id,
      );
      if (!otherQuestionResponse) return;
      this.otherValue = otherQuestionResponse.value;
      this.changeIsOther(
        true,
        otherQuestionResponse.selfAssessmentQuestionResponseId,
      );
    }
  }

  updateAnswers(): void {
    const answer: SAQ.Answer = {
      selfAssessmentQuestionId: this.questionId,
      answerValues: this.answers,
    };
    saqModule.setAnswer(answer);
  }

  changeCheckboxValue(values: string[]): void {
    const questionResponses = get(this.question, 'questionResponses', []);
    const otherOptionId = get(this.otherOption, 'id');
    const isCheckedOther = values.some(
      (optionId) => optionId === otherOptionId,
    );
    if (isCheckedOther) {
      this.values = [otherOptionId];
    } else {
      this.values = values.filter((value) => value !== otherOptionId);
    }
    this.answers = values.map((value) => {
      const questionResponse: SAQ.QuestionResponse = find(
        questionResponses,
        (v) => v.id === value,
      );
      if (questionResponse) {
        if (questionResponse.optionType === OptionTypeEnum.OTHER) {
          value = this.otherValue;
        }
        return {
          selfAssessmentQuestionResponseId: questionResponse.id,
          value,
        };
      }
    });
    this.updateAnswers();
  }

  changeIsOther(isOther: boolean, otherCode?: string): void {
    this.isOther = isOther;
    if (otherCode) {
      this.otherCode = otherCode;
    } else {
      this.otherValue = '';
    }
  }

  changeInputValue(value: string): void {
    this.otherValue = value;
    const otherAnswerIndex = findIndex(
      this.answers,
      (a) => a.selfAssessmentQuestionResponseId === this.otherCode,
    );
    this.answers[otherAnswerIndex].value = value;
    this.updateAnswers();
  }

  renderOtherInput(): JSX.Element {
    const { placeholder } = find(
      this.options,
      (o) => o.value === this.otherCode,
    );
    return (
      <Styled.OtherInput>
        <Input
          value={this.otherValue}
          placeholder={placeholder}
          name="other"
          width="312px"
          changeValue={this.changeInputValue}
        />
      </Styled.OtherInput>
    );
  }

  render(): JSX.Element {
    return (
      <fragment>
        <CheckboxGroup
          values={this.values}
          options={this.optionsDisplayed}
          changeValue={(values: string[]) => {
            this.changeCheckboxValue(values);
          }}
          changeIsOther={this.changeIsOther}
          readOnly={this.isView}
        />
        {this.isOther && this.renderOtherInput()}
      </fragment>
    );
  }
}
