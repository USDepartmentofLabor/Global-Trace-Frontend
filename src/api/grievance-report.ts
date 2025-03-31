import httpRequest from './http-request';

export const createReport = (
  params: GrievanceReport.CreateReportParams,
): Promise<void> => httpRequest.post('/grievance-reports', params);

export const getCategories = (
  params: GrievanceReport.CategoryParams,
): Promise<GrievanceReport.Category[]> =>
  httpRequest.get('/categories/all', { params });

export const createRiskScanReport = (
  params: GrievanceReport.CommunityRiskScanParams,
): Promise<void> => httpRequest.post('/requests', params);

export const getReasons = (): Promise<GrievanceReport.Reason[]> =>
  httpRequest.get('/grievance-reports/reason-of-audit');

export const getAssignees = (): Promise<Auth.User[]> =>
  httpRequest.get('/grievance-reports/assignees');

export const getFacilities = (
  key?: string,
  signal?: AbortSignal,
): Promise<GrievanceReport.Facility[]> =>
  httpRequest.get(`/facilities?key=${key}`, { signal });

export const getGrievanceReport = (
  params: GrievanceReport.RequestParams,
): Promise<App.ListItem<GrievanceReport.Report>> =>
  httpRequest.get('/grievance-reports', { params });

export const getGrievanceReportDetail = (
  id: string,
): Promise<GrievanceReport.Report> =>
  httpRequest.get(`/grievance-reports/${id}`);

export const updateReport = (
  reportId: string,
  params: GrievanceReport.EditReportParams,
): Promise<void> => httpRequest.put(`/grievance-reports/${reportId}`, params);

export const createResponses = (
  id: string,
  params: GrievanceReport.ResponseRequestParams,
): Promise<GrievanceReport.Response> =>
  httpRequest.post(`/requests/${id}/responses`, params);
