import { jsonToFormData } from 'utils/helpers';
import httpRequest from './http-request';

export const uploadFiles = (
  params: App.UploadFiles,
): Promise<App.UploadFilesResponse[]> =>
  httpRequest.post('/upload/files', jsonToFormData(params), {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
