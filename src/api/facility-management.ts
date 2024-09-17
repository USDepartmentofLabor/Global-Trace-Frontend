import { jsonToFormData } from 'utils/helpers';
import httpRequest from './http-request';

export const getFacilityList = (
  params: FacilityManagement.RequestParams,
): Promise<App.ListItem<Auth.Facility>> =>
  httpRequest.get('/facility-groups', { params });

export const getFacilityGroup = (id: string): Promise<Auth.Facility> =>
  httpRequest.get(`/facility-groups/${id}`);

export const validDownloadTemplate = (
  params: FacilityManagement.RequestParams,
): Promise<Auth.Facility> =>
  httpRequest.get('/facility-groups/valid-download-template', { params });

export const deleteFacilityGroup = (id: string): Promise<void> =>
  httpRequest.delete(`/facility-groups/${id}`);

export const importData = (
  params: FacilityManagement.UpdateFacilityRequest,
): Promise<void> => httpRequest.post(`/facility-groups/import-data`, params);

export const updateFacilities = (
  id: string,
  params: FacilityManagement.UpdateFacilityRequest,
): Promise<void> =>
  httpRequest.put(`/facility-groups/${id}/import-data`, params);

export const validateFacilityGroupTemplate = (
  file: Files.UploadedFileParam,
  params: FacilityManagement.UploadFileParams,
): Promise<Files.UploadedFileResponse> =>
  httpRequest.post(
    '/facility-groups/validate-import-template',
    jsonToFormData(file),
    {
      headers: { 'Content-Type': 'multipart/form-data' },
      params,
    },
  );

export const getFacilityFilterValues = (
  id: string,
  params: FacilityManagement.FilterParams,
): Promise<FacilityManagement.FilterValues> =>
  httpRequest.get(`/facilities/${id}/filter-values`, { params });
