import { Vue, Component, Prop } from 'vue-property-decorator';
import { find, get } from 'lodash';
import saqModule from 'store/modules/saq';
import { InputType } from 'enums/app';
import { SAQTypesEnum } from 'enums/saq';
import AppModule from 'store/modules/app';
import { DEFAULT_LANGUAGE } from 'config/constants';
import InputText from './InputText';
import * as Styled from './styled';

@Component
export default class InputGroup extends Vue {
  @Prop({ default: false }) readonly isView: boolean;
  @Prop({ required: true }) question: SAQ.SelfAssessmentQuestion;

  private oldValue: string[];

  get questionId(): string {
    return get(this.question, 'id');
  }

  get questionResponses(): SAQ.QuestionResponse[] {
    return get(this.question, 'questionResponses', []);
  }

  get currentLocale(): string {
    return AppModule.locale;
  }

  created(): void {
    this.initValue();
  }

  initValue() {
    const currentAnswer = find(
      saqModule.answers,
      (answer) => answer.selfAssessmentQuestionId === this.questionId,
    );
    if (currentAnswer) {
      this.oldValue = currentAnswer.answerValues.map(({ value }) => value);
    } else {
      this.oldValue = this.questionResponses.map(() => '');
    }
  }

  getInputType(): string {
    if (this.question.type === SAQTypesEnum.NUMBER) {
      return InputType.NUMBER;
    }
    return InputType.TEXT;
  }

  changeInputValue(index: number, value: string): void {
    this.oldValue[index] = value;
    const answerValues = this.oldValue.map((answer, answerIndex) => {
      const questionResponse = this.questionResponses[answerIndex];
      return {
        selfAssessmentQuestionResponseId: get(questionResponse, 'id'),
        value: answer,
      };
    });
    const answer: SAQ.Answer = {
      selfAssessmentQuestionId: this.questionId,
      answerValues: answerValues,
    };
    saqModule.setAnswer(answer);
  }

  render(): JSX.Element {
    return (
      <Styled.InputGroup>
        {this.questionResponses.map(
          ({ id, option, translation }, index: number) => {
            const value = this.oldValue[index];
            const placeholder =
              this.currentLocale === DEFAULT_LANGUAGE
                ? option
                : translation[this.currentLocale] || option;
            return (
              <InputText
                value={value}
                type={this.getInputType()}
                name={id}
                placeholder={placeholder}
                changeValue={(value: string) => {
                  this.changeInputValue(index, value);
                }}
                isView={this.isView}
              />
            );
          },
        )}
      </Styled.InputGroup>
    );
  }
}
