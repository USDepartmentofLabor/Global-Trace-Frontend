import { TransactionTypeEnum } from 'enums/app';

export const downloadFile = (url: string): void => {
  const link = document.createElement('a');
  link.setAttribute('download', null);
  link.style.display = 'none';
  document.body.appendChild(link);
  link.setAttribute('href', url);
  link.setAttribute('target', '_blank');
  link.click();
  document.body.removeChild(link);
};

export const downloadQRCodeUrl = (
  QRCodeId: string,
  shortToken: string,
): string => {
  return `${API_URL}qr-code-batchs/${QRCodeId}/download?shortToken=${shortToken}`;
};

export const downloadProductAttachmentsUrl = (
  productId: string,
  shortToken: string,
): string => {
  return `${API_URL}products/${productId}/download-certifications?shortToken=${shortToken}`;
};

export const downloadTemplateUrl = (shortToken: string): string => {
  return `${API_URL}templates/export-excel?shortToken=${shortToken}`;
};

export const downloadDocumentsUrl = (
  orderId: string,
  transactionId: string,
  shortToken: string,
): string => {
  return `${API_URL}orders/${orderId}/trace/download-documents?transactionIds=${transactionId}&shortToken=${shortToken}`;
};

/* eslint-disable max-params */
export const downloadOrderPdfUrl = (
  orderId: string,
  timezone: string,
  shortToken: string,
  language: string,
): string => {
  return `${API_URL}pdf-export/download?orderId=${orderId}&timezone=${timezone}&shortToken=${shortToken}&language=${language}`;
};

export const downloadFacilityGroupTemplateUrl = (
  id: string,
  shortToken: string,
): string => {
  return `${API_URL}facility-groups/download-template?roleId=${id}&shortToken=${shortToken}`;
};

export const downloadFacilityGroupRiskAssessment = (
  shortToken: string,
  roleId: string,
  facilityGroupId: string,
): string => {
  return `${API_URL}facility-groups/download-template?shortToken=${shortToken}&roleId=${roleId}&facilityGroupId=${facilityGroupId}`;
};

export const downloadDocumentAssociatedUrl = (
  transactionIds: string,
  type: TransactionTypeEnum,
  shortToken: string,
): string =>
  `${API_URL}histories/download-documents?transactionId=${transactionIds}&type=${type}&shortToken=${shortToken}`;

export const downloadTaxonomyExploitationTemplate = (
  shortToken: string,
): string => {
  return `${API_URL}taxonomy-exploitations/upload-templates?shortToken=${shortToken}`;
};

export const downloadTranslationProductsTemplate = (
  shortToken: string,
): string => {
  return `${API_URL}product-translations/products?shortToken=${shortToken}`;
};

export const downloadTranslationAttributesTemplate = (
  shortToken: string,
): string => {
  return `${API_URL}product-translations/attributes?shortToken=${shortToken}`;
};

export const downloadTaxonomyTranslationTemplate = (
  shortToken: string,
): string => {
  return `${API_URL}taxonomy-translations?shortToken=${shortToken}`;
};

export const downloadSAQTemplate = (
  shortToken: string,
  roleId: string,
): string => {
  return `${API_URL}self-assessments/download-template?roleId=${roleId}&shortToken=${shortToken}`;
};

export const downloadSAQTranslationTemplate = (
  shortToken: string,
  roleId: string,
): string => {
  return `${API_URL}self-assessments/translations?roleId=${roleId}&shortToken=${shortToken}`;
};

export const downloadFacilityDetailsPdfUrl = (
  id: string,
  query: string,
): string => {
  return `${API_URL}pdf-export/facility-details/${id}/download?${query}`;
};
