import { jsonToFormData } from 'utils/helpers';
import httpRequest from './http-request';

export const createRecordByProduct = (
  params: RecordByProduct.RequestParams,
): Promise<void> =>
  httpRequest.post(`/events/record-by-product`, jsonToFormData(params), {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
