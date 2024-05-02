import {
  Action,
  getModule,
  Module,
  Mutation,
  VuexModule,
} from 'vuex-module-decorators';
import { findIndex, get, noop } from 'lodash';
import { OptionTypeEnum } from 'enums/saq';
import {
  getAnswers,
  getSAQ,
  submitAnswers,
  validateSAQFile,
  getConfigurableSAQ,
} from 'api/saq';
import store from 'store/index';
import { MODULE } from './constants';

@Module({
  dynamic: true,
  namespaced: true,
  name: MODULE,
  store: store,
})
class saq extends VuexModule implements AppStore.SAQState {
  public groups: SAQ.SelfAssessmentGroup[] = [];
  public selfAssessment: SAQ.SelfAssessment = null;
  public answers: SAQ.Answer[] = [];
  public uploadedSAQFile: Files.UploadedFile = {};
  public uploadedFacilityFile: Files.UploadedFile = {};
  public uploadedResponse: Files.UploadedSAQResponse[] = [];
  public configurableSAQ: SAQ.ConfigurableSAQ[] = [];

  get totalQuestionCount(): number {
    return get(this.selfAssessment, 'totalQuestions', 0);
  }

  @Action
  public resetSAQState(): void {
    this.RESET_SAQ();
  }

  @Action
  async getSAQData({ callback }: { callback: App.Callback }): Promise<void> {
    const onSuccess = get(callback, 'onSuccess', noop);
    const onFailure = get(callback, 'onFailure', noop);
    const onFinish = get(callback, 'onFinish', noop);
    try {
      const response = await getSAQ();
      this.SET_SAQ_DATA(response);
      onSuccess(response);
    } catch (error) {
      onFailure(error);
    } finally {
      onFinish();
    }
  }

  @Action
  async getAnswers({ callback }: { callback: App.Callback }): Promise<void> {
    const onSuccess = get(callback, 'onSuccess', noop);
    const onFailure = get(callback, 'onFailure', noop);
    const onFinish = get(callback, 'onFinish', noop);
    try {
      const response = await getAnswers();
      this.INIT_ANSWERS(response);
      onSuccess(response);
    } catch (error) {
      onFailure(error);
    } finally {
      onFinish();
    }
  }

  @Action
  async submitAnswers({
    params,
    callback,
  }: {
    params: SAQ.AnswerParams;
    callback: App.Callback;
  }): Promise<void> {
    const onSuccess = get(callback, 'onSuccess', noop);
    const onFailure = get(callback, 'onFailure', noop);
    const onFinish = get(callback, 'onFinish', noop);
    try {
      const response = await submitAnswers(params);
      onSuccess(response);
    } catch (error) {
      onFailure(error);
    } finally {
      onFinish();
    }
  }

  @Action
  public setAnswer(answer: SAQ.Answer): void {
    this.SET_ANSWER(answer);
  }

  @Action
  public updateAnswers(answers: SAQ.Answer[]): void {
    this.UPDATE_ANSWERS(answers);
  }

  @Action
  public async uploadSAQFile({
    data,
    callback,
  }: {
    data: SAQ.ImportParams;
    callback: App.Callback;
  }) {
    const onSuccess = get(callback, 'onSuccess', noop);
    const onFailure = get(callback, 'onFailure', noop);
    const onFinish = get(callback, 'onFinish', noop);

    try {
      const response = await validateSAQFile(data);
      this.ADD_UPLOAD_FILE(data.fileSaq, data.fileFacilityGroupTemplate);
      this.ADD_UPLOAD_SAQ_RESPONSE(response);
      onSuccess();
    } catch (error) {
      onFailure(error);
    } finally {
      onFinish();
    }
  }

  @Action
  public resetFileUpload() {
    this.RESET_UPLOAD_FILE();
  }

  @Action
  async getConfigurableSAQ({
    params,
    callback,
  }: {
    params: App.RequestParams;
    callback: App.Callback;
  }): Promise<void> {
    const onSuccess = get(callback, 'onSuccess', noop);
    const onFailure = get(callback, 'onFailure', noop);
    const onFinish = get(callback, 'onFinish', noop);

    try {
      const data = await getConfigurableSAQ(params);
      this.SET_SAQ_LIST(data);
      onSuccess(data);
    } catch (error) {
      onFailure(error);
    } finally {
      onFinish();
    }
  }

  @Mutation
  private SET_SAQ_DATA(data: SAQ.SAQData): void {
    this.groups = data.groups.map((group, index) => {
      group.questions = group.questions.map((question) => {
        question.questionResponses = question.questionResponses.map(
          (response) => {
            response.riskScore = get(response, 'riskLevel', 0);
            return response;
          },
        );
        return question;
      });
      group.order = index + 1;
      return group;
    });
    data.selfAssessment.incompleteQuestions =
      data.selfAssessment.incompleteQuestions.map((question) => {
        question.part = question.order;
        return question;
      });
    this.selfAssessment = data.selfAssessment;
  }

  @Mutation
  private INIT_ANSWERS(answers: SAQ.SelfAssessmentAnswer[]): void {
    this.answers = answers.map(({ selfAssessmentQuestionId, answers }) => {
      return {
        selfAssessmentQuestionId,
        answerValues: answers.map(({ questionResponse, value }) => ({
          value,
          isOther: questionResponse.optionType === OptionTypeEnum.OTHER,
          selfAssessmentQuestionResponseId: questionResponse.id,
        })),
      };
    });
  }

  @Mutation
  private RESET_SAQ(): void {
    this.groups = [];
    this.selfAssessment = null;
    this.answers = [];
  }

  @Mutation
  private SET_ANSWER(answer: SAQ.Answer): void {
    const founded = findIndex(
      this.answers,
      (a) => a.selfAssessmentQuestionId === answer.selfAssessmentQuestionId,
    );
    if (founded < 0) {
      this.answers.push(answer);
    } else {
      this.answers[founded].answerValues = answer.answerValues;
    }
  }

  @Mutation
  private UPDATE_ANSWERS(answers: SAQ.Answer[]): void {
    this.answers = answers;
  }

  @Mutation
  private ADD_UPLOAD_FILE(
    fileSAQ: Files.UploadedFile,
    fileFacility?: Files.UploadedFile,
  ): void {
    if (fileFacility) {
      this.uploadedFacilityFile = fileFacility;
    }
    this.uploadedSAQFile = fileSAQ;
  }

  @Mutation
  private ADD_UPLOAD_SAQ_RESPONSE(data: Files.UploadedSAQResponse[]): void {
    this.uploadedResponse = data;
  }

  @Mutation
  private RESET_UPLOAD_FILE(): void {
    this.uploadedResponse = [];
  }

  @Mutation
  private SET_SAQ_LIST(data: SAQ.ConfigurableSAQ[]): void {
    this.configurableSAQ = data;
  }
}

export default getModule(saq);
