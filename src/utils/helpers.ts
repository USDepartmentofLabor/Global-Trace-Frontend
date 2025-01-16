/* eslint-disable max-lines, no-useless-escape */
import i18n from 'i18next';
import moment from 'moment';
import { get, head, isEmpty, isNil, isNull, keys, omitBy } from 'lodash';
import JSZip from 'jszip';
import { AvailableWeightUnit } from 'enums/product';
import {
  ALL_FILE_EXTENSION,
  DEFAULT_LANGUAGE,
  LBS_PER_KG,
  OTHER_COUNTRY_ID,
  OTHER_DISTRICT_ID,
  OTHER_PROVINCE_ID,
  SIZE,
  UNIT_PER_KG,
} from 'config/constants';
import { uploadFiles } from 'api/upload';

export const translate = (key: string, data: {} = {}) => {
  return i18n.t(key, data);
};

export const getWindow = () => {
  return typeof window !== 'undefined' ? window : null;
};

export function windowRedirect(url: string) {
  if (typeof window !== 'undefined') {
    window.location.href = url;
  }
}

export function windowOpen(url: string) {
  if (typeof window !== 'undefined') {
    window.open(url, '_blank');
  }
}

export function windowReload() {
  if (typeof window !== 'undefined') {
    window.location.reload();
  }
}

export function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function isUUID(id: string): boolean {
  return !isEmpty(id.match(/^\w{8}-\w{4}-\w{4}-\w{4}-\w{12}$/gm));
}

export const convertUnixTime = (time: string) => {
  return moment(Number(time) * 1000).format('YYYY-MM-DD');
};

export const dataURLtoFile = (dataUrl: string, filename: string): File => {
  const arr = dataUrl.split(',');
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
};

export const resetBodyOverFlow = (): void => {
  if (typeof document !== 'undefined') {
    document.body.style.overflow = 'auto';
  }
};

export const setBodyOverFlow = (): void => {
  if (typeof document !== 'undefined') {
    document.body.style.overflow = 'hidden';
  }
};

export const htmlDecode = (text: string): string => {
  try {
    const doc = new DOMParser().parseFromString(text, 'text/html');
    return doc.documentElement.textContent;
  } catch (error) {
    return text;
  }
};

export const isImageExtension = (extension: string): boolean => {
  return /image\/(gif|jpe?g|tiff?|png|webp|bmp)$/i.test(extension);
};

export const formatNumber = (number: number): string => {
  return number.toLocaleString('en-US');
};

const buildFormData = (
  formData: FormData,
  data: App.Any,
  parentKey?: string,
) => {
  if (
    data &&
    typeof data === 'object' &&
    !(data instanceof Date) &&
    !(data instanceof File)
  ) {
    keys(data).forEach((key) => {
      buildFormData(formData, data[key], parentKey ? `${parentKey}` : key);
    });
  } else {
    const value = isNull(data) ? '' : data;
    formData.append(parentKey, value);
  }
};

const buildNestedFormData = (
  formData: FormData,
  data: App.Any,
  parentKey?: string,
) => {
  if (
    data &&
    typeof data === 'object' &&
    !(data instanceof Date) &&
    !(data instanceof File)
  ) {
    keys(data).forEach((key) => {
      let newKey: string;
      if (data[key] instanceof File) {
        newKey = parentKey ? `${parentKey}` : key;
      } else {
        newKey = parentKey ? `${parentKey}[${key}]` : key;
      }
      buildNestedFormData(formData, data[key], newKey);
    });
  } else {
    const value = isNull(data) ? '' : data;
    formData.append(parentKey, value);
  }
};

export const jsonToFormData = (data: App.Any): FormData => {
  const formData = new FormData();
  buildFormData(formData, data);
  return formData;
};

export const nestedJsonToFormData = (data: App.Any): FormData => {
  const formData = new FormData();
  buildNestedFormData(formData, data);
  return formData;
};

export const convertUnitToKg = (weight: number, weightUnit: string): number => {
  switch (weightUnit.toUpperCase()) {
    case AvailableWeightUnit.UNIT:
      return weight * UNIT_PER_KG;
    case AvailableWeightUnit.LBS:
      return weight * LBS_PER_KG;
    default:
      return weight;
  }
};

export const convertKgToUnit = (weight: number, weightUnit: string): number => {
  switch (weightUnit.toUpperCase()) {
    case AvailableWeightUnit.UNIT:
      return weight / UNIT_PER_KG;
    case AvailableWeightUnit.LBS:
      return weight / LBS_PER_KG;
    default:
      return weight;
  }
};

export const convertUnixTimestampToDate = (timestamp: number): Date => {
  return moment(timestamp * 1000).toDate();
};

export const formatWeight = (weight: number): number => Math.ceil(weight);

export const numberWithHyphen = (value: string): string => {
  const realNumber = value.replace(/[^a-z0-9]/gi, '').toUpperCase();
  const dashedNumber = realNumber.match(/.{1,3}/g);
  if (dashedNumber) {
    return dashedNumber.join('-');
  }
  return realNumber;
};

export const dashedAlphaNumber = (value: string): string => {
  return value.replace(/[^a-zA-Z0-9-]+/gi, '');
};

export const getInputValue = (value: string): string | undefined => {
  return !isEmpty(value) ? value : undefined;
};

export const getFileNameFromURL = (url: string): string => {
  const fileName = url.split('/').pop().split('?').shift();
  return replaceBlobName(decodeURI(fileName));
};

export const replaceBlobName = (blobName: string): string => {
  return blobName ? blobName.replace(/\b[a-f\d-]{37}\b/, '') : '';
};

export function isiOS() {
  const nav = typeof window !== 'undefined' && window.navigator;
  const isIPad =
    (nav && nav.userAgent.match(/(iPad)/)) /* iOS pre 13 */ ||
    (nav.platform === 'MacIntel' && nav.maxTouchPoints > 1); /* iPad OS 13 */
  const isIPhone =
    !isIPad &&
    nav &&
    (nav.userAgent.match(/iPhone/i) !== null ||
      nav.userAgent.match(/iPod/i) !== null);
  return isIPad || isIPhone;
}

export function isAndroid() {
  return (
    !isiOS() &&
    typeof window !== 'undefined' &&
    navigator.userAgent.match(/android/i) !== null
  );
}

export function isMobile() {
  return isiOS() || isAndroid();
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'HIGH':
      return 'red';
    case 'MEDIUM':
      return 'sandyBrown';
    case 'LOW':
      return 'envy';
    default:
      return 'ghost';
  }
}

export const validateFile = (
  file: File,
  uploadConfig: App.UploadFileConfigType,
): Record<'isErrorVolume' | 'isErrorFormat', boolean> => {
  const { name, type, size } = file;
  const { EXTENSIONS, ACCEPTED, MAX_SIZE } = uploadConfig;
  const fileExt = name.split('.').pop();
  const extensions = EXTENSIONS.split(',');
  const acceptedFiles = ACCEPTED.split(',');
  const isErrorVolume = size > MAX_SIZE;
  const isErrorFormat =
    EXTENSIONS !== ALL_FILE_EXTENSION &&
    !acceptedFiles.includes(type) &&
    (extensions.length < 2 || !extensions.includes(fileExt));
  return { isErrorVolume, isErrorFormat };
};

export const getRoundedPercent = (value: number, total: number): number => {
  return Math.round((value / total) * 100);
};

export const getBusinessLocation = (
  facility: Auth.Facility,
  showAddress = true,
  language = DEFAULT_LANGUAGE,
): string => {
  if (!facility) {
    return '';
  }
  const { address, district, province, country } = facility;
  if (country && country.id === OTHER_COUNTRY_ID) {
    return address;
  }
  let location: App.DropdownOption[] = [];
  if (language !== DEFAULT_LANGUAGE) {
    const translationKey = `translation.${language}`;
    location = [
      { id: get(district, 'id'), name: get(district, translationKey) },
      { id: get(province, 'id'), name: get(province, translationKey) },
      { id: get(country, 'id'), name: get(country, translationKey) },
    ];
  } else {
    location = [
      { id: get(district, 'id'), name: get(district, 'district') },
      { id: get(province, 'id'), name: get(province, 'province') },
      { id: get(country, 'id'), name: get(country, 'country') },
    ];
  }
  const locationName = location
    .filter(
      ({ id }) =>
        ![OTHER_COUNTRY_ID, OTHER_PROVINCE_ID, OTHER_DISTRICT_ID].includes(
          id as string,
        ),
    )
    .map(({ name }) => name);
  if (showAddress) {
    locationName.unshift(address);
  }
  return locationName.filter((item) => item).join(', ');
};

export const downloadFromUrl = (
  downloadUrl: string,
  callback?: () => void,
): void => {
  const downloadWindow = window.open(downloadUrl, '_blank');
  const timer = setInterval(() => {
    if (downloadWindow.closed) {
      clearInterval(timer);
      callback && callback();
    }
  }, 1000);
};

export const getUploadFileParams = async (
  files: File[],
): Promise<string[] | undefined> => {
  const hasFiles = !isEmpty(files);
  if (hasFiles) {
    const filesResponse = await uploadFiles({
      files: files as File[],
    });
    return filesResponse.map(({ blobName }) => blobName);
  }
  return undefined;
};

export const getUploadFileObjectParams = async (
  files: File[],
): Promise<App.UploadFilesResponse[]> => {
  const hasFiles = !isEmpty(files);
  if (hasFiles) {
    const filesResponse = await uploadFiles({
      files: files as File[],
    });
    return filesResponse.map(({ blobName, url }, index) => ({
      fileName: get(files[index], 'name', ''),
      blobName,
      url,
    }));
  }
  return undefined;
};

export function loadImage(
  src: string,
  callback: (success: boolean) => void,
): void {
  const img = new Image();
  img.src = src;
  img.onload = () => callback(true);
  img.onerror = () => callback(false);
}

export const getLanguageOptions = (): App.DropdownOption[] => {
  const columns = [
    ['English', 'en', 'us'],
    ['Français', 'fr', 'fr'],
  ];
  return columns.map((column) => ({
    id: column[1],
    name: column[0],
    icon: column[2],
  }));
};

export const formatSize = (size: number): string => {
  const sizeUnits = {
    TB: Math.pow(SIZE, 4),
    GB: Math.pow(SIZE, 3),
    MB: Math.pow(SIZE, 2),
    KB: SIZE,
  };
  for (const unit in sizeUnits) {
    if (size >= sizeUnits[unit]) {
      return `${(size / sizeUnits[unit]).toFixed(2)} ${unit}`;
    }
  }
  return `${size} B`;
};

export const getQueryString = (params: App.Any): string => {
  return new URLSearchParams(omitBy(params, isNil)).toString();
};

export const getErrorQrCode = (errors: Record<string, App.Any>): string => {
  const outputProductErrors = get(errors, 'children.outputProducts.children');
  let messageError = null;
  if (outputProductErrors) {
    Object.values(outputProductErrors).forEach((error) => {
      const invalidErrors = get(error, 'children.qrCode');
      if (invalidErrors) {
        messageError = head(invalidErrors.messages);
      }
    });
  }
  return messageError;
};

export const updateModalWidth = (modalElement: Element, width: number) => {
  const bodyWidth = document.body.clientWidth;
  if (width < bodyWidth) {
    const left = (bodyWidth - width) / 2;
    modalElement.parentElement.style.width = `${width}px`;
    modalElement.parentElement.style.left = `${left}px`;
  }
};

export const resetModalHeight = (modalElement: Element) => {
  modalElement.parentElement.style.height = 'auto';
};

export const scrollToElement = (element: HTMLElement) => {
  if (element) {
    element.scrollIntoView();
  }
};

export const isNumber = (value: string): boolean => {
  const regex = /^-?\d*\.?\d*$/g;
  return regex.test(value);
};

export const isDuplicateCalculation = (value: string): boolean => {
  const regex = /[\+|\-|\*|\/|\*\*]\s[\+|\-|\*|\/|\**]/g;
  return regex.test(value);
};

export const isDuplicateNumber = (value: string): boolean => {
  const regex = /\d+\s?-\d+/g;
  return regex.test(value);
};

export const downloadMultipleFiles = async (
  files: File[],
  callback: () => void,
) => {
  if (!isEmpty(files)) {
    const zip = new JSZip();
    for (const file of files) {
      const fileContent = await file.arrayBuffer();
      zip.file(file.name, fileContent);
    }

    zip
      .generateAsync({ type: 'blob' })
      .then(function (content) {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(content);
        link.download = 'certifications.zip';
        link.click();
      })
      .finally(() => {
        callback();
      });
  }
};
