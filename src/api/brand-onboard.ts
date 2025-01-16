import { jsonToFormData } from 'utils/helpers';
import httpRequest from './http-request';

export const saveProfile = (
  params: BrandOnboard.RequestParams,
): Promise<void> =>
  httpRequest.put('/brands/profile', jsonToFormData(params), {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
