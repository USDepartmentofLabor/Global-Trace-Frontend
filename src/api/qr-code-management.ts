import httpRequest from './http-request';

export const createQRCode = (
  data: QRCodeManagement.QRCodeRequestParams,
): Promise<QRCodeManagement.QRCode> =>
  httpRequest.post('/qr-code-batchs', data);

export const getQRCodeList = (
  params: QRCodeManagement.GetListRequestParams,
): Promise<App.ListItem<QRCodeManagement.QRCode>> =>
  httpRequest.get('/qr-code-batchs', { params });

export const getQRCodeHistory = (
  params: QRCodeManagement.GetListRequestParams,
): Promise<App.ListItem<QRCodeManagement.QRCode>> =>
  httpRequest.get('/qr-code-batchs/history', { params });

export const downloadQRCode = (id: string): Promise<File> =>
  httpRequest.get(`/qr-code-batchs/${id}/download`);

export const deleteAllQRCode = (): Promise<void> =>
  httpRequest.delete('/qr-code-batchs');

export const deleteQRCode = (id: string): Promise<void> =>
  httpRequest.delete(`/qr-code-batchs/${id}`);
