import { Vue, Component, Prop } from 'vue-property-decorator';
import { find, get, head, isEmpty } from 'lodash';
import AppModule from 'store/modules/app';
import saqModule from 'store/modules/saq';
import YesNo from 'components/FormUI/Radio/YesNo';

@Component
export default class YesNoQuestion extends Vue {
  @Prop({ default: false }) readonly isView: boolean;
  @Prop({ required: true }) question: SAQ.SelfAssessmentQuestion;

  private value: string;

  get questionId(): string {
    return get(this.question, 'id');
  }

  get options(): App.CheckboxGroup[] {
    return this.question.questionResponses.map(
      ({ id, option, translation }) => ({
        label: get(translation, this.currentLocale, option),
        value: id,
      }),
    );
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

  onChangeValue(value: string) {
    if (isEmpty(value)) return;
    this.value = value;
    const questionResponses = get(this.question, 'questionResponses');
    const questionResponse = find(questionResponses, ({ id }) => id === value);
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
      <YesNo
        options={this.options}
        value={this.value}
        changeValue={this.onChangeValue}
        readOnly={this.isView}
      />
    );
  }
}
