export type ToastType = 'success' | 'error';

export interface ToastMessage {
  type: ToastType;
  message: string;
}
