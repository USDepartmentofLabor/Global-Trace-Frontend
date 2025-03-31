declare module '@braid/vue-formulate' {
  import { PluginObject } from 'vue';

  export interface Context {
    addLabel?: string;
    attributes?: Attributes;
    blurHandler?: () => void;
    classification?: string;
    component?: string;
    classes?: Record<string, string[]>;
    disableErrors?: boolean;
    errors?: string[];
    hasValue?: boolean;
    hasLabel?: boolean;
    hasValidationErrors?: Promise<boolean>;
    help?: string;
    helpPosition?: string;
    getValidationErrors?: Promise<string[]>;
    id?: string;
    index?: number;
    isValid?: boolean;
    imageBehavior?: string;
    isSubField?: () => boolean;
    label?: string;
    labelPosition?: string;
    limit?: number;
    minimum?: number;
    model?: string[] | string | number;
    name?: string;
    options?: [];
    slotComponents?: Record<string, string | boolean>;
    slotProps?: Record<string, string | boolean>;
    pseudoProps?: Record<string, unknown>;
    rules?: unknown[];
    performValidation?: () => never;
    preventWindowDrops?: boolean;
    removeLabel?: string;
    removeItem?: () => void;
    repeatable?: boolean;
    rootEmit?: () => never;
    setErrors?: () => void;
    showValidationErrors?: boolean;
    type?: string;
    uploadBehavior?: 'live' | 'delayed';
    uploader?: () => void;
    uploadUrl?: string;
    validationErrors?: string[];
    value?: boolean;
    visibleValidationErrors?: string[];
    hasGivenName?: boolean;
  }

  export interface OptionWithContext {
    addLabel: string;
    classes: Record<string, string[]>;
    debounceDelay: boolean;
    disableErrors: boolean;
    errors: string[];
    formShouldShowErrors: boolean;
    groupErrors: Record<string, unknown>;
    hasGivenName: boolean;
    hasValue: boolean;
    helpPosition: string;
    id: string;
    ignored: boolean;
    imageBehavior: string;
    isGrouped: boolean;
    label: string;
    limit: number;
    minimum: number;
    name: boolean;
    preventWindowDrops: boolean;
    removeLabel: string;
    removePosition: boolean;
    repeatable: boolean;
    type: string;
    uploadBehavior: string;
    uploadUrl: boolean;
    uploader: () => void;
    value: string;
    disabled: boolean;
  }

  export interface Attributes {
    [key: string]: unknown;
  }

  export interface ValidationEventPayload {
    name: string;
    errors: string[];
    hasErrors: boolean;
  }

  export interface FormulateErrors {
    inputErrors: Record<string, string[]>;
    formErrors: string[];
  }
  export interface FormulateGlobalInstance {
    handle: (
      err: FormulateErrors,
      formName: string,
      skip?: boolean,
    ) => void | typeof Error;
    reset: <V>(formName: string, initialValue?: V) => void;
    resetValidation: (formName: string) => void;
    setValues: <V>(formName: string, values: V) => void;
    registry: Map<string, FormInstance>;
  }

  interface VueFormulateOptions {
    // TODO: see https://github.com/wearebraid/vue-formulate/blob/10ab31b4939323ed9d61cf810eddc676c4242bd1/src/Formulate.js#L43
  }

  const VueFormulate: PluginObject<VueFormulateOptions>;
  export default VueFormulate;

  declare module 'vue/types/vue' {
    interface Vue {
      $formulate: FormulateGlobalInstance;
    }
  }
}
