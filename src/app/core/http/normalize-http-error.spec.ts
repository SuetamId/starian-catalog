import { HttpErrorResponse } from '@angular/common/http';
import { describe, expect, it } from 'vitest';

import { NormalizedHttpError } from './http-error.model';
import { normalizeHttpError } from './normalize-http-error';

describe('normalizeHttpError', () => {
  it('preserves an already normalized error', () => {
    const normalized: NormalizedHttpError = {
      status: 422,
      message: 'Erro já normalizado.',
      recoverable: true,
    };

    expect(normalizeHttpError(normalized)).toBe(normalized);
  });

  it('normalizes network failures with status 0', () => {
    const error = new HttpErrorResponse({
      status: 0,
      statusText: 'Unknown Error',
      url: 'https://fakestoreapi.com/products',
    });

    expect(normalizeHttpError(error)).toEqual({
      status: 0,
      message: 'Não foi possível conectar ao serviço. Tente novamente.',
      recoverable: true,
    });
  });

  it('normalizes 4xx errors', () => {
    const error = new HttpErrorResponse({
      status: 404,
      statusText: 'Not Found',
      url: 'https://fakestoreapi.com/products/999',
    });

    expect(normalizeHttpError(error)).toEqual({
      status: 404,
      message: 'Não foi possível processar a solicitação.',
      recoverable: true,
    });
  });

  it('normalizes 5xx errors', () => {
    const error = new HttpErrorResponse({
      status: 503,
      statusText: 'Service Unavailable',
      url: 'https://fakestoreapi.com/products',
    });

    expect(normalizeHttpError(error)).toEqual({
      status: 503,
      message: 'O serviço está temporariamente indisponível. Tente novamente.',
      recoverable: true,
    });
  });

  it('normalizes unknown errors', () => {
    expect(normalizeHttpError('unexpected')).toEqual({
      status: 0,
      message: 'Ocorreu um erro inesperado. Tente novamente.',
      recoverable: true,
    });
  });

  it('always returns recoverable true', () => {
    const cases: unknown[] = [
      new HttpErrorResponse({ status: 0, statusText: 'Unknown Error' }),
      new HttpErrorResponse({ status: 400, statusText: 'Bad Request' }),
      new HttpErrorResponse({ status: 500, statusText: 'Internal Server Error' }),
      null,
    ];

    for (const error of cases) {
      expect(normalizeHttpError(error).recoverable).toBe(true);
    }
  });
});
