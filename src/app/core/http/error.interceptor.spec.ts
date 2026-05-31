import {
  HttpClient,
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { isNormalizedHttpError } from './http-error.model';
import { errorInterceptor } from './error.interceptor';

describe('errorInterceptor', () => {
  let http: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([errorInterceptor])),
        provideHttpClientTesting(),
      ],
    });

    http = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('leaves successful requests unchanged', async () => {
    const responsePromise = firstValueFrom(http.get<{ ok: true }>('/health'));

    const request = httpTestingController.expectOne('/health');
    expect(request.request.method).toBe('GET');
    request.flush({ ok: true });

    await expect(responsePromise).resolves.toEqual({ ok: true });
  });

  it('converts HTTP 404 errors into NormalizedHttpError', async () => {
    const responsePromise = firstValueFrom(http.get('/products/999'));

    const request = httpTestingController.expectOne('/products/999');
    request.flush('Not Found', { status: 404, statusText: 'Not Found' });

    await expect(responsePromise).rejects.toSatisfy((error: unknown) => {
      return (
        isNormalizedHttpError(error) &&
        error.status === 404 &&
        error.message === 'Não foi possível processar a solicitação.' &&
        error.recoverable === true
      );
    });
  });

  it('converts network failures into NormalizedHttpError', async () => {
    const responsePromise = firstValueFrom(http.get('/products'));

    const request = httpTestingController.expectOne('/products');
    request.error(new ProgressEvent('error'));

    await expect(responsePromise).rejects.toSatisfy((error: unknown) => {
      return (
        isNormalizedHttpError(error) &&
        error.status === 0 &&
        error.message === 'Não foi possível conectar ao serviço. Tente novamente.' &&
        error.recoverable === true
      );
    });
  });

  it('does not alter request method, URL or payload', () => {
    const payload = { title: 'Sample product' };

    http.post('/products', payload).subscribe({ error: () => undefined });

    const request = httpTestingController.expectOne('/products');
    expect(request.request.method).toBe('POST');
    expect(request.request.url).toBe('/products');
    expect(request.request.body).toEqual(payload);

    request.flush('Bad Request', { status: 400, statusText: 'Bad Request' });
  });
});
