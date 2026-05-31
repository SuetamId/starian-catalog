import { HttpErrorResponse } from '@angular/common/http';

import { isNormalizedHttpError, NormalizedHttpError } from './http-error.model';

export function normalizeHttpError(error: unknown): NormalizedHttpError {
  if (isNormalizedHttpError(error)) {
    return error;
  }

  if (error instanceof HttpErrorResponse) {
    if (error.status === 0) {
      return {
        status: 0,
        message: 'Não foi possível conectar ao serviço. Tente novamente.',
        recoverable: true,
      };
    }

    if (error.status >= 400 && error.status <= 499) {
      return {
        status: error.status,
        message: 'Não foi possível processar a solicitação.',
        recoverable: true,
      };
    }

    if (error.status >= 500) {
      return {
        status: error.status,
        message: 'O serviço está temporariamente indisponível. Tente novamente.',
        recoverable: true,
      };
    }
  }

  return {
    status: 0,
    message: 'Ocorreu um erro inesperado. Tente novamente.',
    recoverable: true,
  };
}
