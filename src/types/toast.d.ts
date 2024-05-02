declare namespace Toast {
  export type ToastOption = {
    type?: 'success' | 'error' | 'info';
    duration?: number;
    showIcon?: boolean;
    size?: string;
  };

  export interface ToastApi<T> {
    success: (message: string | T, toastData?: ToastOption) => void;
    error: (message: string | T, toastData?: ToastOption) => void;
    info: (message: string | T, toastData?: ToastOption) => void;
  }
}
