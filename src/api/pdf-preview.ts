import httpRequest from './http-request';

export const getPDF = (
  params: App.PDFPreviewParams,
): Promise<PDFPreview.Response> => httpRequest.get('/pdf-export', { params });

export const getPDFFacilityDetails = (
  params: App.PDFPreviewParams,
): Promise<PDFPreview.Response> =>
  httpRequest.get('/pdf-export/facility-details', { params });
