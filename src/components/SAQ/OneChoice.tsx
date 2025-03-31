import { Vue, Component, Prop } from 'vue-property-decorator';
import { find, get, head, isEmpty } from 'lodash';
import AppModule from 'store/modules/app';
import saqModule from 'store/modules/saq';
import RadioGroup from 'components/FormUI/Radio/RadioGroup';

@Component
export default class OneChoice extends Vue {
  @Prop({ default: false }) readonly isView: boolean;
  @Prop({ default: [] }) options: App.CheckboxGroup[];
  @Prop({ required: true }) question: SAQ.SelfAssessmentQuestion;

  private value: string = '';
  private answers: SAQ.AnswerValues[] = [];

  get questionId(): string {
    return get(this.question, 'id');
  }

  get currentLocale(): string {
    return AppModule.locale;
  }

  created(): void {
    this.initValue();
  }

  initValue(): void {
    const currentAnswer = find(
      saqModule.answers,
      (answer) => answer.selfAssessmentQuestionId === this.questionId,
    );
    this.value = currentAnswer ? head(currentAnswer.answerValues).value : '';
  }

  updateAnswers(): void {
    const answer: SAQ.Answer = {
      selfAssessmentQuestionId: this.questionId,
      answerValues: this.answers,
    };
    saqModule.setAnswer(answer);
  }

  changeCheckboxValue(value: string): void {
    if (isEmpty(value)) return;
    const questionResponses = get(this.question, 'questionResponses', []);
    const questionResponse = find(questionResponses, ({ id }) => id === value);
    this.value = value;
    const answer: SAQ.Answer = {
      selfAssessmentQuestionId: this.questionId,
      answerValues: [
        {
          value,
          selfAssessmentQuestionResponseId: get(questionResponse, 'id'),
        },
      ],
    };
    saqModule.setAnswer(answer);
  }

  render(): JSX.Element {
    return (
      <RadioGroup
        value={this.value}
        options={this.options}
        changeValue={this.changeCheckboxValue}
        readOnly={this.isView}
      />
    );
  }
}
