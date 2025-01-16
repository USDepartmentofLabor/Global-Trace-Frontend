/* eslint-disable max-lines, max-params */
import { Vue, Component, Prop } from 'vue-property-decorator';
import moment from 'moment';
import { get, head, isEmpty, isNull, map, pick } from 'lodash';
import { CapStatusEnum } from 'enums/brand';
import { ButtonType, InputType } from 'enums/app';
import auth from 'store/modules/auth';
import { convertDateToTimestamp, convertTimestampToDate } from 'utils/date';
import { convertEnumToTranslation, getCategoryName } from 'utils/translation';
import Input from 'components/FormUI/Input';
import DatePicker from 'components/FormUI/DatePicker';
import CommentBox from 'components/CommentBox';
import Button from 'components/FormUI/Button';
import FileUpload from 'components/FormUI/FileUpload';
import InputGroup from 'components/FormUI/InputGroup';
import {
  createCAP,
  createComment,
  deleteComment,
  updateCAP,
  updateComment,
} from 'api/cap';
import { handleError } from 'components/Toast';
import * as Styled from './styled';
import Indicators from '../Indicators';

@Component
export default class Form extends Vue {
  @Prop({ default: null })
  readonly capDetail: CAP.CAP;
  @Prop({ required: true })
  readonly facility: Auth.Facility;
  @Prop({ required: true })
  readonly indicatorRiskData: Auth.IndicatorRiskData[];
  @Prop({
    default: () => {
      // TODO
    },
  })
  cancel: (status: CapStatusEnum) => void;
  @Prop({
    default: () => {
      // TODO
    },
  })
  requestEvidence: () => void;
  @Prop({
    default: () => {
      // TODO
    },
  })
  success: (status: CapStatusEnum) => void;

  private isSubmitting = false;
  private formName = 'actionPlanForm';
  private uploadFiles: App.SelectedFile[] = [];
  private formInput: CAP.CAPParams = {
    subIndicatorId: null,
    action: null,
    targetCompletionAt: null,
    files: [],
    status: null,
    riskScoreLevel: null,
    deleteBlobNames: [],
  };

  private status: CapStatusEnum = CapStatusEnum.DRAFT;
  private comments: CAP.Comment[] = [];

  get isEdit(): boolean {
    return !isEmpty(this.capDetail);
  }

  get cap(): CAP.CAP {
    return get(this.capDetail, 'indicatorRiskData.subIndicatorRiskData.cap');
  }

  get capId(): string {
    return get(this.cap, 'id');
  }

  get isDraft(): boolean {
    return this.status === CapStatusEnum.DRAFT;
  }

  get isDisabledActionInput(): boolean {
    return !this.isDraft;
  }

  get isDisabledTargetCompletionDate(): boolean {
    if (!this.isOwner) {
      return true;
    }
    return !this.isDraft && !this.isUnderReview;
  }

  get isOwner(): boolean {
    return this.isDraft || get(this.cap, 'isOwner', false);
  }

  get showCommentInput(): boolean {
    return !this.isDraft && !this.isResolved;
  }

  get showCommentList(): boolean {
    return !isEmpty(this.comments);
  }

  get showRequestEvidence(): boolean {
    return this.isOwner && this.isUnderReview;
  }

  get showUploadFile(): boolean {
    return this.isDraft || this.isOverdue;
  }

  get showUploadedFiles(): boolean {
    return !isEmpty(get(this.cap, 'files', []));
  }

  get showSubmitButton(): boolean {
    if (this.isOwner) {
      return this.isDraft || this.isUnderReview;
    }
    return this.isNew || this.isInProgress;
  }

  get hasComment(): boolean {
    const { id } = auth.user;
    return this.comments.some(({ userId }) => userId === id);
  }

  get isInvalid(): boolean {
    if (this.isOwner) {
      return false;
    }
    return this.isInProgress && !this.hasComment;
  }

  get isOverdue(): boolean {
    return this.status === CapStatusEnum.OVERDUE;
  }

  get isNew(): boolean {
    return this.status === CapStatusEnum.NEW;
  }

  get isInProgress(): boolean {
    return this.status === CapStatusEnum.IN_PROGRESS;
  }

  get isUnderReview(): boolean {
    return this.status === CapStatusEnum.UNDER_REVIEW;
  }

  get isResolved(): boolean {
    return this.status === CapStatusEnum.RESOLVED;
  }

  get isEmptyTargetCompletionAt(): boolean {
    return isNull(this.targetCompletionAt);
  }

  get actionLabel(): string {
    switch (this.status) {
      case CapStatusEnum.DRAFT:
        return this.$t('common.action.submit');
      case CapStatusEnum.NEW:
      case CapStatusEnum.IN_PROGRESS:
        return this.$t('mark_as_resolved');
      case CapStatusEnum.RESOLVED:
        return this.$t('done');
      case CapStatusEnum.UNDER_REVIEW:
        return this.$t('accept_evidence');
    }
  }

  get isDisabled(): boolean {
    if (this.isDraft) {
      return this.isEmptyTargetCompletionAt;
    }
    return false;
  }

  get categoryName(): string {
    const item = head(this.indicatorRiskData);
    return getCategoryName(
      get(item, 'indicator.category.name', ''),
      get(item, 'indicator.category.translation'),
    );
  }

  get formData(): CAP.CAPParams {
    return this.$formulate.registry.get(this.formName).proxy;
  }

  get targetCompletionAt(): Date {
    const { targetCompletionAt } = this.formData;
    return targetCompletionAt
      ? convertTimestampToDate(targetCompletionAt)
      : null;
  }

  set targetCompletionAt(value: Date) {
    this.$formulate.setValues(this.formName, {
      ...this.formData,
      targetCompletionAt: value ? convertDateToTimestamp(value) : null,
    });
  }

  created() {
    this.initRiskData();
    if (this.isNew && !this.isOwner) {
      this.updateCAP(
        {
          status: CapStatusEnum.IN_PROGRESS,
        },
        false,
      );
    }
  }

  initRiskData() {
    const indicatorRiskData = head(this.indicatorRiskData);
    const subIndicatorRiskData = head(
      get(indicatorRiskData, 'subIndicatorRiskData', []),
    );
    this.formInput.subIndicatorId = get(
      subIndicatorRiskData,
      'subIndicator.id',
    );
    if (this.cap) {
      const { status, targetCompletionAt, action, comments, riskScoreLevel } =
        this.cap;
      this.comments = comments;
      this.status = status;
      this.formInput.status = status;
      this.formInput.targetCompletionAt = targetCompletionAt;
      this.formInput.action = action;
      this.formInput.riskScoreLevel = riskScoreLevel;
    }
  }

  async updateCAP(params: CAP.CAPParams = {}, handleSuccess: boolean = true) {
    try {
      this.isSubmitting = true;
      if (params.status) {
        this.status = params.status;
      }
      await updateCAP(this.facility.id, this.capId, {
        ...this.formInput,
        ...params,
      });
      if (handleSuccess) {
        this.success(this.status);
      }
    } catch (error) {
      handleError(error as App.ResponseError);
    } finally {
      this.isSubmitting = false;
    }
  }

  changeTargetCompletionDate(targetCompletionAt: string): void {
    this.targetCompletionAt = targetCompletionAt
      ? moment(targetCompletionAt).endOf('date').toDate()
      : null;
  }

  async onSubmit(): Promise<void> {
    if (this.isDraft) {
      this.createNewCAP();
    } else if (this.isInProgress) {
      this.updateCAP({
        status: CapStatusEnum.UNDER_REVIEW,
      });
    } else if (this.isUnderReview) {
      this.requestEvidence();
    }
  }

  underReviewToInprogress() {
    this.updateCAP({
      status: CapStatusEnum.IN_PROGRESS,
    });
  }

  disabledDate(date: Date): boolean {
    const validDate = moment().subtract(1, 'days').toDate();
    return date < validDate;
  }

  async submitComment(
    content: string,
    selectedFiles: App.SelectedFile[],
    callback: () => void,
  ): Promise<void> {
    try {
      const files = selectedFiles.map(({ file }) => file);
      const comment = await createComment(this.capId, {
        content,
        files,
      });
      this.comments.unshift(comment);
      if (callback) {
        callback();
      }
    } catch (error) {
      handleError(error as App.ResponseError);
    } finally {
      if (callback) {
        callback();
      }
    }
  }

  removeBlobName(commentId: string, blobName: string) {
    const index = this.comments.findIndex(({ id }) => id === commentId);
    if (index > -1) {
      this.addDeleteBlobName(index, blobName);
    }
  }

  addDeleteBlobName(index: number, blobName: string) {
    if (!isEmpty(get(this.comments[index], 'deleteBlobNames'))) {
      this.comments[index].deleteBlobNames.push(blobName);
    } else {
      this.comments[index].deleteBlobNames = [blobName];
    }
    this.comments[index].files = this.comments[index].files.filter(
      (item) => item.blobName !== blobName,
    );
  }

  async updateComment(
    commentId: string,
    content: string,
    selectedFiles: App.SelectedFile[],
    callback: () => void,
  ): Promise<void> {
    try {
      const index = this.comments.findIndex(({ id }) => id === commentId);
      if (index > -1) {
        const files = selectedFiles.map(({ file }) => file);
        const comment = await updateComment(this.capId, commentId, {
          content,
          files,
          deleteBlobNames: this.comments[index].deleteBlobNames,
        });

        this.comments[index].files = comment.files;
        this.comments[index].content = content;
        callback();
      }
    } catch (error) {
      handleError(error as App.ResponseError);
    }
  }

  async deleteComment(commentId: string): Promise<void> {
    try {
      const index = this.comments.findIndex(({ id }) => commentId === id);
      if (index > -1) {
        this.comments.splice(index, 1);
      }
      await deleteComment(this.capId, commentId);
    } catch (error) {
      handleError(error as App.ResponseError);
    }
  }

  onChangeFiles(selectedFiles: App.SelectedFile[]): void {
    this.uploadFiles = selectedFiles;
  }

  async createNewCAP(): Promise<void> {
    const params = pick(this.formInput, [
      'subIndicatorId',
      'action',
      'targetCompletionAt',
    ]);
    try {
      this.isSubmitting = true;
      const files = this.uploadFiles.map(({ file }) => file);
      await createCAP(this.facility.id, {
        files,
        ...params,
      });
      this.success(this.status);
      this.$toast.success(
        this.$t('cap_assigned_to_supplier', { name: this.facility.name }),
      );
    } catch (error) {
      handleError(error as App.ResponseError);
    } finally {
      this.isSubmitting = false;
    }
  }

  downloadFile(downloadUrl: string) {
    window.open(downloadUrl, '_blank');
  }

  renderUploadFile(): JSX.Element {
    return (
      <fragment>
        {this.showUploadFile && (
          <Styled.Row>
            <FileUpload
              variant="secondary"
              values={[]}
              inputId="fileId"
              label={this.$t('upload_file')}
              disabled={this.isSubmitting}
              changeFiles={this.onChangeFiles}
            />
          </Styled.Row>
        )}
        {this.showUploadedFiles && (
          <Styled.CAPFiles>
            {map(get(this.cap, 'files', []), ({ fileName, link }) => (
              <Styled.CAPFile
                vOn:click={() => {
                  this.downloadFile(link);
                }}
              >
                <Styled.File>
                  <font-icon name="attach_file" color="highland" size="20" />
                  {fileName}
                </Styled.File>
              </Styled.CAPFile>
            ))}
          </Styled.CAPFiles>
        )}
      </fragment>
    );
  }

  renderAction(): JSX.Element {
    return (
      <Styled.Row>
        <Input
          type={InputType.TEXTAREA}
          label={this.$t('actions')}
          name="action"
          height="66px"
          maxlength={255}
          placeholder={this.$t('action_plan_placeholder')}
          disabled={this.isSubmitting || this.isDisabledActionInput}
          validation="bail|required"
          validationMessages={{
            required: this.$t('validation.required', {
              field: this.$t('action').toLowerCase(),
            }),
          }}
        />
      </Styled.Row>
    );
  }

  renderTargetCompletionDate(): JSX.Element {
    return (
      <DatePicker
        label={this.$t('target_completion_date')}
        height="48px"
        placeholder={this.$t('select_due_date')}
        value={this.targetCompletionAt}
        selectDate={this.changeTargetCompletionDate}
        disabledDate={this.disabledDate}
        disabled={this.isSubmitting || this.isDisabledTargetCompletionDate}
        appendToBody={false}
      />
    );
  }

  renderComment(): JSX.Element {
    return (
      <CommentBox
        showInput={this.showCommentInput}
        showCommentList={this.showCommentList}
        comments={this.comments}
        submit={this.submitComment}
        removeBlobName={this.removeBlobName}
        updateComment={this.updateComment}
        deleteComment={this.deleteComment}
      />
    );
  }

  renderActions(hasErrors: boolean): JSX.Element {
    return (
      <Styled.Actions>
        {this.showRequestEvidence && (
          <Button
            label={this.$t('request_further_evidence')}
            variant="outlinePrimary"
            click={this.underReviewToInprogress}
          />
        )}
        <Styled.ButtonGroupEnd>
          <Button
            label={this.$t('common.action.cancel')}
            variant="transparentPrimary"
            disabled={this.isSubmitting}
            click={this.cancel}
          />
          {this.showSubmitButton && (
            <Button
              width="100%"
              type={ButtonType.SUBMIT}
              variant="primary"
              label={this.actionLabel}
              isLoading={this.isSubmitting}
              disabled={
                hasErrors ||
                this.isSubmitting ||
                this.isDisabled ||
                this.isInvalid
              }
            />
          )}
        </Styled.ButtonGroupEnd>
      </Styled.Actions>
    );
  }

  renderFormHeader(): JSX.Element {
    return (
      <Styled.Header>
        <Styled.CategoryName>{this.categoryName}</Styled.CategoryName>
        <Styled.Status variant={this.status}>
          {this.$t(convertEnumToTranslation(this.status))}
        </Styled.Status>
      </Styled.Header>
    );
  }

  renderFormBody(): JSX.Element {
    return (
      <Styled.Container>
        <Indicators indicatorRiskData={this.indicatorRiskData} />
        <formulate-form
          name={this.formName}
          v-model={this.formInput}
          vOn:submit={this.onSubmit}
          scopedSlots={{
            default: ({ hasErrors }: { hasErrors: boolean }) => {
              return (
                <InputGroup>
                  {this.renderAction()}
                  {this.renderTargetCompletionDate()}
                  {this.renderUploadFile()}
                  {this.renderComment()}
                  {this.renderActions(hasErrors)}
                </InputGroup>
              );
            },
          }}
        />
      </Styled.Container>
    );
  }

  render(): JSX.Element {
    return (
      <Styled.Wrapper>
        <perfect-scrollbar>
          {this.renderFormHeader()}
          {this.renderFormBody()}
        </perfect-scrollbar>
      </Styled.Wrapper>
    );
  }
}
