import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { API_CONFIG } from '../../../../core/config/api.config';
import {
  ApiProduct,
  CreateProductPayload,
  UpdateProductPayload,
} from '../../../catalog/models/product.model';

@Injectable({ providedIn: 'root' })
export class ProductApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = API_CONFIG.baseUrl;

  getProducts(): Observable<ApiProduct[]> {
    return this.http.get<ApiProduct[]>(`${this.baseUrl}/products`);
  }

  getProductById(id: number): Observable<ApiProduct> {
    return this.http.get<ApiProduct>(`${this.baseUrl}/products/${id}`);
  }

  getCategories(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/products/categories`);
  }

  createProduct(payload: CreateProductPayload): Observable<ApiProduct> {
    return this.http.post<ApiProduct>(`${this.baseUrl}/products`, payload);
  }

  updateProduct(id: number, payload: UpdateProductPayload): Observable<ApiProduct> {
    return this.http.put<ApiProduct>(`${this.baseUrl}/products/${id}`, payload);
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/products/${id}`);
  }
}
