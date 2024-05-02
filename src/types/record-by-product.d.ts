declare namespace RecordByProduct {
  export type RequestParams = {
    totalWeight: number;
    weightUnit: string;
    recordedAt: number;
    uploadProofs: File[];
  };
}
