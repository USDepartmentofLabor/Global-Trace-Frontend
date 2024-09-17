/* eslint-disable */
type FormulateValidationType = {
  name: string;
  value: string;
  getFormValues: () => { [key: string]: string };
};

export const passwordValidator = (data: FormulateValidationType): boolean => {
  const { value } = data;

  if (value.includes(' ')) {
    return false;
  }

  // at least 1 number, 1 special, 1 lowercase, 1 uppercase, at least 8 characters
  return /(?=(.*[0-9]))(?=.*[!@#$%^&*])(?=.*[a-z])(?=(.*[A-Z]))(?=(.*)).{8,}/.test(
    value,
  );
};

export const nameValidator = (data: FormulateValidationType): boolean => {
  const { value } = data;

  return /^[a-zA-Z\s]+$/.test(value);
};

export const difference = (
  data: FormulateValidationType,
  ...fields: string[]
): boolean => {
  const formValues = data.getFormValues();
  return fields.every((field: string) => {
    return formValues[field] && formValues[field] !== formValues[data.name];
  });
};

export const emailValid = (data: FormulateValidationType): boolean => {
  let { value } = data;
  value = value.trim();

  if (value.includes(' ')) {
    return false;
  }

  return RegExp(
    /^\w+([\\.-]?\w+)*(\+\w+)?@\w+([\\.-]?\w+)*(\.[a-zA-Z]{2,3})+$/,
  ).test(value);
};

export const length = (
  data: FormulateValidationType,
  ...args: string[]
): boolean => {
  let { value } = data;
  const length = parseInt(args[0]);
  return value.length === length;
};

export const alphabetAndNumber = (data: FormulateValidationType): boolean => {
  const { value } = data;

  const ALPHABET_AND_NUMBER_REG = /^[a-zA-Z0-9]*$/im;

  return ALPHABET_AND_NUMBER_REG.test(value);
};

export const notInApp = (data: FormulateValidationType): boolean => {
  const { value } = data;

  return !value.includes('app');
};

export const specialChar = (data: FormulateValidationType): boolean => {
  const { value } = data;

  const SPECIAL_CHAR_REGEX = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.~`<>\/?]+/;

  return (
    !SPECIAL_CHAR_REGEX.test(value.charAt(0)) &&
    !SPECIAL_CHAR_REGEX.test(value.charAt(value.length - 1))
  );
};

export const integer = (data: FormulateValidationType) => {
  const { value } = data;

  const ALPHABET_AND_NUMBER_REG = /^[0-9]*$/im;

  return ALPHABET_AND_NUMBER_REG.test(value);
};

export const uuid = (data: FormulateValidationType): boolean => {
  const { value } = data;

  const IS_UUID_REG = /^[a-zA-Z0-9-]*$/im;

  return IS_UUID_REG.test(value);
};
