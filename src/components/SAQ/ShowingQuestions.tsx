import { get } from 'lodash';
import { Vue, Component, Prop } from 'vue-property-decorator';
import { OptionTypeEnum, SAQTypesEnum } from 'enums/saq';
import { DEFAULT_LANGUAGE } from 'config/constants';
import AppModule from 'store/modules/app';
import MultipleChoice from './MultipleChoice';
import InputGroup from './InputGroup';
import YesNoQuestion from './YesNoQuestion';
import OneChoice from './OneChoice';
import * as Styled from './styled';

@Component
export default class ShowingQuestion extends Vue {
  @Prop({ default: false }) readonly isView: boolean;
  @Prop({ default: [] }) question: SAQ.SelfAssessmentQuestion;
  @Prop({ default: [] }) allQuestions: SAQ.SelfAssessmentQuestion[];

  private isAnswer: boolean = false;

  get currentLocale(): string {
    return AppModule.locale;
  }

  get currentTitle(): string {
    const { title } = this.question;
    return get(title, this.currentLocale);
  }

  get defaultTitle(): string {
    const { title } = this.question;
    return get(title, DEFAULT_LANGUAGE);
  }

  get questionLocale(): string {
    return this.currentTitle ? this.currentLocale : DEFAULT_LANGUAGE;
  }

  getTitle(): string {
    const { order } = this.question;
    const question = this.currentTitle ? this.currentTitle : this.defaultTitle;
    return `${order}. ${question}`;
  }

  getOption(
    option: string,
    translation: {
      [x: string]: string;
    },
  ): string {
    return this.currentLocale === DEFAULT_LANGUAGE
      ? option
      : translation[this.currentLocale] || option;
  }

  renderChoiceQuestions(
    questionResponse: SAQ.QuestionResponse[],
    type: SAQTypesEnum,
  ): JSX.Element {
    const options: App.CheckboxGroup[] = questionResponse.map(
      (value: SAQ.QuestionResponse) => {
        const { id, option, optionType, translation } = value;
        const inputOption = {
          label: this.getOption(option, translation),
          value: id,
        };
        if (optionType === OptionTypeEnum.OTHER) {
          return {
            ...inputOption,
            isOther: true,
            placeholder: this.getOption(option, translation),
          };
        }
        return inputOption;
      },
    );

    if (type === SAQTypesEnum.MULTI_CHOICE) {
      return (
        <MultipleChoice
          options={options}
          question={this.question}
          isView={this.isView}
        />
      );
    }

    return (
      <OneChoice
        options={options}
        question={this.question}
        isView={this.isView}
      />
    );
  }

  renderQuestionContent(): JSX.Element {
    const { type, questionResponses } = this.question;

    if (
      type === SAQTypesEnum.MULTI_CHOICE ||
      type === SAQTypesEnum.ONE_CHOICE
    ) {
      return this.renderChoiceQuestions(questionResponses, type);
    }

    if (type === SAQTypesEnum.FREE_TEXT || type === SAQTypesEnum.NUMBER) {
      return <InputGroup question={this.question} isView={this.isView} />;
    }

    if (type === SAQTypesEnum.YES_NO) {
      return (
        <YesNoQuestion
          isAnswer={this.isAnswer}
          question={this.question}
          isView={this.isView}
        />
      );
    }
  }

  render(): JSX.Element {
    return (
      <Styled.FormGroup key={this.question.id}>
        <text-direction locale={this.questionLocale}>
          <Styled.Title>{this.getTitle()}</Styled.Title>
        </text-direction>
        <Styled.QuestionAnswers>
          {this.renderQuestionContent()}
        </Styled.QuestionAnswers>
      </Styled.FormGroup>
    );
  }
}
