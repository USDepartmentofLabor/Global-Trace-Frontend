import { jsonToFormData } from 'utils/helpers';
import httpRequest from './http-request';

export const validateTranslationProductsTemplate = (
  file: Files.UploadedFileParam,
): Promise<Files.UploadedFileResponse> =>
  httpRequest.post('/product-translations/products', jsonToFormData(file), {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const validateTranslationAttributesTemplate = (
  file: Files.UploadedFileParam,
): Promise<Files.UploadedFileResponse> =>
  httpRequest.post('/product-translations/attributes', jsonToFormData(file), {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const updateTranslationProducts = (fileId: string): Promise<void> =>
  httpRequest.post(`/product-translations/products/${fileId}`);

export const updateTranslationAttributes = (fileId: string): Promise<void> =>
  httpRequest.post(`/product-translations/attributes/${fileId}`);
