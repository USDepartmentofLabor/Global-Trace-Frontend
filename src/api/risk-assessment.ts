import httpRequest from './http-request';

export const getRiskAssessment =
  (): Promise<RiskAssessmentManagement.RiskAssessment> =>
    httpRequest.get('/risk-assessments');

export const updateRiskAssessment = (
  params: RiskAssessmentManagement.RiskAssessmentParams,
): Promise<void> => httpRequest.put('/risk-assessments', params);

export const getRiskAssessmentProperties =
  (): Promise<RiskAssessmentManagement.RiskAssessmentProperties> =>
    httpRequest.get('/risk-assessments/properties');

export const getRiskAssessmentReportRoles = (): Promise<
  RoleAndPermission.Role[]
> => httpRequest.get('/risk-assessments/submit-report-roles');
