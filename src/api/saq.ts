import { jsonToFormData } from 'utils/helpers';
import httpRequest from './http-request';

export const getSAQ = (): Promise<SAQ.SAQData> =>
  httpRequest.get('/self-assessments');

export const getAnswers = (): Promise<SAQ.SelfAssessmentAnswer[]> =>
  httpRequest.get('/self-assessments/answers');

export const submitAnswers = (
  params: SAQ.AnswerParams,
): Promise<SAQ.SelfAssessmentAnswer[]> =>
  httpRequest.post('/self-assessments/answers', params);

export const getConfigurableSAQ = (
  params: App.RequestParams,
): Promise<SAQ.ConfigurableSAQ[]> =>
  httpRequest.get('/self-assessments/list-role-with-file', { params });

export const validateSAQFile = (
  params: SAQ.ImportParams,
): Promise<Files.UploadedSAQResponse[]> =>
  httpRequest.post(
    '/self-assessments/import/validate',
    jsonToFormData(params),
    {
      headers: { 'Content-Type': 'multipart/form-data' },
    },
  );

export const importSAQ = (params: SAQ.ImportParams): Promise<void> =>
  httpRequest.post('/self-assessments/import', jsonToFormData(params), {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const uploadSAQTranslation = (
  params: SAQ.TranslationParams,
): Promise<SAQ.UploadedFileResponse> =>
  httpRequest.post('/self-assessments/translations', jsonToFormData(params), {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
