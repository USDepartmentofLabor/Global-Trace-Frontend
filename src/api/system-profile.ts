import { jsonToFormData } from 'utils/helpers';
import httpRequest from './http-request';

export const getBusinessDetail = (): Promise<SystemProfile.BusinessDetail> =>
  httpRequest.get('/business-details');

export const updateBusinessDetail = (
  params: SystemProfile.BusinessDetailParams,
): Promise<void> =>
  httpRequest.put('/business-details', jsonToFormData(params), {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

export const getCommodities = (): Promise<SystemProfile.Commodities[]> =>
  httpRequest.get('/business-details/commodities');
