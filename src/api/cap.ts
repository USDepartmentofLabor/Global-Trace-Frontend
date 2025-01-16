import { jsonToFormData } from 'utils/helpers';
import httpRequest from './http-request';

export const createCAP = (
  facilityId: string,
  params: CAP.CAPParams,
): Promise<void> =>
  httpRequest.post(`/facilities/${facilityId}/caps`, jsonToFormData(params), {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const updateCAP = (
  facilityId: string,
  capId: string,
  params: CAP.CAPParams,
): Promise<void> =>
  httpRequest.put(`/facilities/${facilityId}/caps/${capId}`, params);

export const getCAPList = (
  params: CAP.RequestParams,
): Promise<App.ListItem<CAP.CAP>> => httpRequest.get('/caps', { params });

export const getCAPDetail = (
  facilityId: string,
  capId: string,
): Promise<CAP.CAPDetail> =>
  httpRequest.get(`/facilities/${facilityId}/caps/${capId}`);

export const createComment = (
  capId: string,
  params: CAP.CommentParams,
): Promise<CAP.Comment> =>
  httpRequest.post(`/caps/${capId}/comments`, jsonToFormData(params), {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const updateComment = (
  capId: string,
  commentId: string,
  params: CAP.CommentParams,
): Promise<CAP.Comment> =>
  httpRequest.put(
    `/caps/${capId}/comments/${commentId}`,
    jsonToFormData(params),
    {
      headers: { 'Content-Type': 'multipart/form-data' },
    },
  );

export const deleteComment = (
  capId: string,
  commentId: string,
): Promise<void> => httpRequest.delete(`/caps/${capId}/comments/${commentId}`);

export const requestExtension = (
  facilityId: string,
  capId: string,
  params: CAP.RequestExtensionParams,
): Promise<void> =>
  httpRequest.put(
    `/facilities/${facilityId}/caps/${capId}/request-extension`,
    params,
  );

export const approveRequestExtension = (
  facilityId: string,
  capId: string,
): Promise<void> =>
  httpRequest.put(
    `/facilities/${facilityId}/caps/${capId}/request-extension/approve`,
  );

export const declineRequestExtension = (
  facilityId: string,
  capId: string,
): Promise<void> =>
  httpRequest.put(
    `/facilities/${facilityId}/caps/${capId}/request-extension/decline`,
  );
