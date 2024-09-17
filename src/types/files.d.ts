declare namespace Files {
  export type UploadedFile = App.Any;

  export type UploadedFileParam = {
    file: UploadedFile;
  };

  export type UpdateFileParam = {
    isUpdating: boolean;
  };

  export type UploadedFileResponse = {
    totalItems?: number;
    validatedItemCount?: number;
    fileId?: string;
    validationErrors?: ValidationError[];
    validationCommunityRiskErrors?: ValidationError[];
    validationFarmLevelRiskErrors?: ValidationError[];
  };

  export type ValidationError = {
    rowIndex?: number;
    errors: Error[];
    sheet?: string;
    index?: number;
    error?: string;
    isShowRow?: boolean;
  };

  export type Error = {
    currentValue: App.Any;
    error: string;
    key: string;
    isShowKey: boolean;
    isBlankRow: boolean;
  };

  export type UploadedSAQResponse = {
    fileName: string;
    validation: UploadedFileResponse;
  };
}
