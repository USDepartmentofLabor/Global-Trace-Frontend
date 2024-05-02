import { Vue, Component, Prop } from 'vue-property-decorator';
import { orderBy } from 'lodash';
import Button from 'components/FormUI/Button';
import AppModule from 'store/modules/app';
import * as Styled from './styled';

@Component
export default class IncompleteQuestionModal extends Vue {
  @Prop({ default: [] }) incompleteQuestions: SAQ.SelfAssessmentGroup[];

  get currentLocale(): string {
    return AppModule.locale;
  }

  closeModal(): void {
    this.$emit('close');
  }

  getQuestionNumber(numbers: string[] | number[]) {
    const concatNumber = orderBy(numbers).join(', ');
    return `${this.$t('question')} ${concatNumber}`;
  }

  renderResult(): JSX.Element {
    return (
      <fragment>
        {this.incompleteQuestions.map((group) => {
          if (group.questions.length > 0) {
            const questionNumbers = group.questions.map(({ order }) => order);
            return (
              <Styled.Part>
                <Styled.Label>{group.title[this.currentLocale]}</Styled.Label>
                <Styled.Text>
                  {this.getQuestionNumber(questionNumbers)}
                </Styled.Text>
              </Styled.Part>
            );
          }
        })}
      </fragment>
    );
  }

  render(): JSX.Element {
    return (
      <modal-layout showCloseIcon={false} title="">
        <Styled.Wrapper>
          <font-icon name="warning_outline" color="red" size="32" />
          <Styled.Title>{this.$t('selfAssessments.incomplete')}</Styled.Title>
          {this.renderResult()}
          <Button
            label={this.$t('common.action.ok')}
            width="128px"
            click={this.closeModal}
          />
        </Styled.Wrapper>
      </modal-layout>
    );
  }
}
